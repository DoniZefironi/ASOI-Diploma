export type ComponentType =
  | 'esp32' | 'arduino-uno'
  | 'dht22' | 'mq2' | 'ldr' | 'hcsr04'
  | 'led-red' | 'led-green' | 'led-blue' | 'led-yellow'
  | 'buzzer' | 'relay' | 'servo'
  | 'lcd-16x2'
  | 'button' | 'potentiometer' | 'resistor';

export type PinRole =
  | 'gpio' | 'adc' | 'power-3v3' | 'power-5v' | 'vin' | 'gnd'
  | 'vcc' | 'data' | 'signal' | 'trig' | 'echo'
  | 'anode' | 'cathode' | 'out' | 'in' | 'com' | 'no' | 'nc'
  | 'sda' | 'scl' | 'pwm';

export interface PinDef {
  id: string;
  label: string;
  role: PinRole;
  x: number;   // relative to component top-left
  y: number;
  gpioNum?: number;
}

export interface ComponentDef {
  type: ComponentType;
  label: string;
  category: 'board' | 'sensor' | 'actuator' | 'display' | 'input' | 'passive';
  width: number;
  height: number;
  pins: PinDef[];
  description: string;
  defaultCode?: string;
  sensorKeys?: string[];   // list of adjustable sensor values e.g. ['temperature', 'humidity']
  sensorLabels?: Record<string, string>;
  sensorRanges?: Record<string, [number, number]>;
  sensorDefaults?: Record<string, number>;
}

export interface PlacedComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
}

export interface Wire {
  id: string;
  fromCompId: string;
  fromPinId: string;
  toCompId: string;
  toPinId: string;
}

export interface SimState {
  pinValues: Record<number, number>;       // gpio pin number → 0 or 1
  analogValues: Record<number, number>;    // gpio pin number → 0-4095
  sensorValues: Record<string, Record<string, number>>; // compId → { key → value }
  serialLog: string[];
  running: boolean;
  error: string | null;
  lcdText?: string[];
  servoAngles: Record<string, number>;     // compId → angle 0-180
  ledStates: Record<string, boolean>;      // compId → on/off
  buzzerOn: boolean;
  buzzerFreq: number;
  relayStates: Record<string, boolean>;    // compId → on/off
}
