import { Wire, PlacedComponent, SimState } from '../types';
import { getComponentDef } from './componentDefs';

// ─── C++ → JS transpiler ──────────────────────────────────────────────────────
function transpile(cpp: string): string {
  let js = cpp;

  // Remove includes
  js = js.replace(/#include\s*[<"][^>"]*[>"]\s*/g, '');

  // #define CONST VALUE → const CONST = VALUE;
  js = js.replace(/#define\s+(\w+)\s+([^\n]+)/g, (_, name, val) => {
    return `const ${name} = ${val.trim()};`;
  });

  // Remove type keywords from variable/function declarations
  // Handle: int x = 5; float t; bool b = true; char c = 'a'; String s = "...";
  js = js.replace(/\b(void|int|float|double|bool|char|long|unsigned\s+long|unsigned\s+int|byte|uint8_t|uint16_t|uint32_t|int8_t|int16_t|int32_t|String)\s+(?=\w)/g, 'let ');

  // Fix: "let setup(" and "let loop(" should be async functions, not let
  js = js.replace(/let\s+setup\s*\(/g, 'async function setup(');
  js = js.replace(/let\s+loop\s*\(/g, 'async function loop(');
  js = js.replace(/let\s+(\w+)\s*\(([^)]*)\)\s*\{/g, 'async function $1($2) {');

  // Constants
  js = js.replace(/\bHIGH\b/g, '1');
  js = js.replace(/\bLOW\b/g, '0');
  js = js.replace(/\bOUTPUT\b/g, '"OUTPUT"');
  js = js.replace(/\bINPUT_PULLUP\b/g, '"INPUT_PULLUP"');
  js = js.replace(/\bINPUT\b/g, '"INPUT"');
  js = js.replace(/\btrue\b/g, 'true');
  js = js.replace(/\bfalse\b/g, 'false');
  js = js.replace(/\bnullptr\b/g, 'null');

  // Arduino API → _api.*
  js = js.replace(/\bpinMode\s*\(/g, '_api.pinMode(');
  js = js.replace(/\bdigitalWrite\s*\(/g, '_api.digitalWrite(');
  js = js.replace(/\bdigitalRead\s*\(/g, '_api.digitalRead(');
  js = js.replace(/\banalogWrite\s*\(/g, '_api.analogWrite(');
  js = js.replace(/\banalogRead\s*\(/g, '_api.analogRead(');
  js = js.replace(/\bdelay\s*\(/g, 'await _api.delay(');
  js = js.replace(/\bdelayMicroseconds\s*\(/g, 'await _api.delayMicroseconds(');
  js = js.replace(/\bmillis\s*\(\)/g, '_api.millis()');
  js = js.replace(/\bmicros\s*\(\)/g, '_api.micros()');
  js = js.replace(/\btone\s*\(/g, '_api.tone(');
  js = js.replace(/\bnoTone\s*\(/g, '_api.noTone(');
  js = js.replace(/\bpulseIn\s*\(/g, '_api.pulseIn(');
  js = js.replace(/\bmap\s*\(/g, '_api.map(');
  js = js.replace(/\bconstrain\s*\(/g, '_api.constrain(');

  // Serial
  js = js.replace(/\bSerial\b/g, '_api.Serial');

  // Library class instantiation: DHT dht(pin, DHT22); → let dht = new _api._DHT(pin, 'DHT22');
  js = js.replace(/\bDHT\s+(\w+)\s*\(([^)]*)\)\s*;/g, (_, name, args) => {
    return `let ${name} = new _api._DHT(${args});`;
  });
  js = js.replace(/\bServo\s+(\w+)\s*;/g, (_, name) => {
    return `let ${name} = new _api._Servo();`;
  });
  js = js.replace(/\bLiquidCrystal_I2C\s+(\w+)\s*\(([^)]*)\)\s*;/g, (_, name, args) => {
    return `let ${name} = new _api._LCD(${args});`;
  });

  // Remove 'let DHT', 'let Servo', 'let Wire' type references
  js = js.replace(/let\s+(DHT|Servo|Wire|LiquidCrystal_I2C)\b/g, 'let');

  return js;
}

// ─── Build GPIO→Component connection map from wires ───────────────────────────
export function buildConnectionMap(
  components: PlacedComponent[],
  wires: Wire[],
): Map<number, { compId: string; type: string; pinId: string }> {
  const map = new Map<number, { compId: string; type: string; pinId: string }>();

  for (const wire of wires) {
    const fromComp = components.find(c => c.id === wire.fromCompId);
    const toComp = components.find(c => c.id === wire.toCompId);
    if (!fromComp || !toComp) continue;

    const fromDef = getComponentDef(fromComp.type);
    const toDef = getComponentDef(toComp.type);
    const fromPin = fromDef.pins.find(p => p.id === wire.fromPinId);
    const toPin = toDef.pins.find(p => p.id === wire.toPinId);

    // If one end is a board GPIO and the other is a component signal pin
    if (fromPin?.gpioNum !== undefined) {
      map.set(fromPin.gpioNum, { compId: toComp.id, type: toComp.type, pinId: wire.toPinId });
    }
    if (toPin?.gpioNum !== undefined) {
      map.set(toPin.gpioNum, { compId: fromComp.id, type: fromComp.type, pinId: wire.fromPinId });
    }
  }

  return map;
}

// ─── Build the Arduino API object ─────────────────────────────────────────────
export function createArduinoAPI(
  getSensorValues: () => Record<string, Record<string, number>>,
  connectionMap: Map<number, { compId: string; type: string; pinId: string }>,
  onStateUpdate: (patch: Partial<SimState>) => void,
  onSerial: (line: string) => void,
  startTime: number,
  abortSignal: AbortSignal,
) {
  const pinModes: Record<number, string> = {};
  const pinValues: Record<number, number> = {};
  let serialBuffer = '';
  let buzzerOn = false;
  const servoAngles: Record<string, number> = {};
  const ledStates: Record<string, boolean> = {};
  const relayStates: Record<string, boolean> = {};
  const lcdLines: string[] = ['', ''];
  let lcdCursor = { row: 0, col: 0 };

  function getSensorValue(gpio: number, key: string, fallback: number): number {
    const conn = connectionMap.get(gpio);
    if (!conn) return fallback;
    return getSensorValues()[conn.compId]?.[key] ?? fallback;
  }

  function propagatePin(gpio: number, value: number) {
    pinValues[gpio] = value;
    const conn = connectionMap.get(gpio);
    if (!conn) return;

    if (conn.type.startsWith('led-')) {
      ledStates[conn.compId] = value === 1;
      onStateUpdate({ ledStates: { ...ledStates } });
    }
    if (conn.type === 'buzzer') {
      buzzerOn = value === 1;
      onStateUpdate({ buzzerOn });
    }
    if (conn.type === 'relay') {
      relayStates[conn.compId] = value === 0; // active LOW
      onStateUpdate({ relayStates: { ...relayStates } });
    }
    onStateUpdate({ pinValues: { ...pinValues } });
  }

  const api: any = {
    pinMode(pin: number, mode: string) { pinModes[pin] = mode; },

    digitalWrite(pin: number, value: number) { propagatePin(pin, value); },

    digitalRead(pin: number): number {
      const conn = connectionMap.get(pin);
      if (conn?.type === 'button') {
        return (getSensorValues()[conn.compId]?.pressed ?? 0) === 1 ? 0 : 1; // active LOW
      }
      return pinValues[pin] ?? 0;
    },

    analogWrite(pin: number, value: number) {
      // PWM 0-255 → propagate
      const conn = connectionMap.get(pin);
      if (conn?.type === 'servo') {
        const angle = Math.round((value / 255) * 180);
        servoAngles[conn.compId] = angle;
        onStateUpdate({ servoAngles: { ...servoAngles } });
      }
      if (conn?.type.startsWith('led-')) {
        ledStates[conn.compId] = value > 0;
        onStateUpdate({ ledStates: { ...ledStates } });
      }
    },

    analogRead(pin: number): number {
      const conn = connectionMap.get(pin);
      if (!conn) return 0;
      if (conn.type === 'mq2') return getSensorValues()[conn.compId]?.gas ?? 0;
      if (conn.type === 'ldr') return getSensorValues()[conn.compId]?.light ?? 500;
      if (conn.type === 'potentiometer') return getSensorValues()[conn.compId]?.value ?? 512;
      return 0;
    },

    async delay(ms: number): Promise<void> {
      if (abortSignal.aborted) throw new Error('SIMULATION_STOPPED');
      const limited = Math.min(ms, 5000);
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, limited);
        abortSignal.addEventListener('abort', () => { clearTimeout(timeout); reject(new Error('SIMULATION_STOPPED')); }, { once: true });
      });
    },

    async delayMicroseconds(us: number): Promise<void> {
      await api.delay(Math.ceil(us / 1000));
    },

    millis(): number { return Date.now() - startTime; },
    micros(): number { return (Date.now() - startTime) * 1000; },

    map(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
      return Math.round((val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
    },

    constrain(val: number, lo: number, hi: number): number {
      return Math.max(lo, Math.min(hi, val));
    },

    tone(pin: number, freq: number) {
      const conn = connectionMap.get(pin);
      if (conn?.type === 'buzzer') { buzzerOn = true; onStateUpdate({ buzzerOn: true, buzzerFreq: freq || 1000 }); }
    },

    noTone(pin: number) {
      const conn = connectionMap.get(pin);
      if (conn?.type === 'buzzer') { buzzerOn = false; onStateUpdate({ buzzerOn: false }); }
    },

    pulseIn(pin: number, _value: number): number {
      // Simulate HC-SR04 distance
      const conn = connectionMap.get(pin);
      if (conn?.type === 'hcsr04') {
        const dist = getSensorValues()[conn.compId]?.distance ?? 50;
        return dist * 58; // microseconds = distance_cm * 58
      }
      return 0;
    },

    Serial: {
      begin(_baud: number) {},
      print(msg: any) { serialBuffer += String(msg); },
      println(msg: any) {
        serialBuffer += String(msg);
        onSerial(serialBuffer);
        serialBuffer = '';
      },
      available() { return 0; },
      read() { return -1; },
    },

    // ── Library mocks ──
    _DHT: class DHT_Mock {
      pin: number;
      type: string;
      constructor(pin: number, type: string | number) {
        this.pin = pin;
        this.type = String(type);
      }
      begin() {}
      readTemperature(): number {
        return getSensorValue(this.pin, 'temperature', 25.0);
      }
      readHumidity(): number {
        return getSensorValue(this.pin, 'humidity', 55.0);
      }
      isnan(v: number) { return isNaN(v); }
    },

    _Servo: class Servo_Mock {
      pin = -1;
      attach(p: number) { this.pin = p; }
      write(angle: number) {
        const conn = connectionMap.get(this.pin);
        if (conn?.type === 'servo') {
          servoAngles[conn.compId] = Math.max(0, Math.min(180, angle));
          onStateUpdate({ servoAngles: { ...servoAngles } });
        }
      }
      read(): number {
        const conn = connectionMap.get(this.pin);
        return conn ? (servoAngles[conn.compId] ?? 90) : 90;
      }
    },

    _LCD: class LCD_Mock {
      constructor(_addr: number, _cols: number, _rows: number) {}
      init() { lcdLines[0] = ''; lcdLines[1] = ''; }
      backlight() {}
      noBacklight() {}
      clear() { lcdLines[0] = ''; lcdLines[1] = ''; onStateUpdate({ lcdText: [...lcdLines] }); }
      setCursor(col: number, row: number) { lcdCursor = { col, row }; }
      print(msg: any) {
        const r = Math.min(lcdCursor.row, 1);
        const line = lcdLines[r] ?? '';
        lcdLines[r] = (line + String(msg)).substring(0, 16);
        onStateUpdate({ lcdText: [...lcdLines] });
      }
    },
  };

  return api;
}

// ─── Main simulation runner ────────────────────────────────────────────────────
export async function runSimulation(
  code: string,
  components: PlacedComponent[],
  wires: Wire[],
  getSensorValues: () => Record<string, Record<string, number>>,
  onStateUpdate: (patch: Partial<SimState>) => void,
  onSerial: (line: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const connectionMap = buildConnectionMap(components, wires);
  const startTime = Date.now();

  const api = createArduinoAPI(getSensorValues, connectionMap, onStateUpdate, onSerial, startTime, signal);

  const jsCode = transpile(code);

  // Preamble: library/board constants the transpiler doesn't replace inline
  const preamble = `
const DHT11 = 11;
const DHT22 = 22;
const DHT21 = 21;
const DHTTYPE = 22;
const LED_BUILTIN = 2;
const A0 = 34; const A1 = 35; const A2 = 32; const A3 = 33;
const PI = Math.PI;
const abs = Math.abs; const min = Math.min; const max = Math.max;
const sqrt = Math.sqrt; const pow = Math.pow; const round = Math.round;
`;

  // Wrap in async IIFE with setup+loop
  const fullCode = `
${preamble}
${jsCode}

if (typeof setup === 'function') {
  await setup();
}
while (true) {
  if (typeof loop === 'function') {
    await loop();
  }
  // yield to browser each iteration if no delay in loop
  await _api.delay(10);
}
`;

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('_api', `return (async () => { ${fullCode} })();`);
    await fn(api);
  } catch (err: any) {
    if (err?.message !== 'SIMULATION_STOPPED') {
      onStateUpdate({ error: String(err?.message ?? err) });
      throw err;
    }
  }
}
