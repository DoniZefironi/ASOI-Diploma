import { create } from 'zustand';
import { PlacedComponent, ComponentType, Wire, SimState } from '../types';
import { getComponentDef } from '../engine/componentDefs';

export interface SchematicState {
  components: PlacedComponent[];
  wires: Wire[];
  code: string;
  selectedBoard: 'esp32' | 'arduino-uno';

  // Wire drawing
  draggingWireFrom: { compId: string; pinId: string } | null;
  hoveredPin: { compId: string; pinId: string } | null;

  // Simulation
  simState: SimState;
  abortController: AbortController | null;

  // Actions
  addComponent: (type: ComponentType, x: number, y: number) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  removeComponent: (id: string) => void;
  setSelectedBoard: (board: 'esp32' | 'arduino-uno') => void;
  startWireFrom: (compId: string, pinId: string) => void;
  completeWireTo: (compId: string, pinId: string) => void;
  cancelWire: () => void;
  removeWire: (id: string) => void;
  setHoveredPin: (pin: { compId: string; pinId: string } | null) => void;
  updateCode: (code: string) => void;
  setSensorValue: (compId: string, key: string, value: number) => void;
  updateSimState: (patch: Partial<SimState>) => void;
  appendSerial: (line: string) => void;
  clearSerial: () => void;
  setAbortController: (ac: AbortController | null) => void;
  setRunning: (running: boolean) => void;
  loadTemplate: (type: ComponentType) => void;
}

const DEFAULT_ESP32_CODE = `// ESP32 — Hello World
void setup() {
  Serial.begin(115200);
  pinMode(2, OUTPUT);
  Serial.println("Simulation started!");
}

void loop() {
  digitalWrite(2, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(2, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`;

const DEFAULT_SIM_STATE: SimState = {
  pinValues: {},
  analogValues: {},
  sensorValues: {},
  serialLog: [],
  running: false,
  error: null,
  lcdText: ['', ''],
  servoAngles: {},
  ledStates: {},
  buzzerOn: false,
  buzzerFreq: 1000,
  relayStates: {},
};

export const useSchematicStore = create<SchematicState>((set, get) => ({
  components: [
    { id: 'board-1', type: 'esp32', x: 300, y: 80 },
  ],
  wires: [],
  code: DEFAULT_ESP32_CODE,
  selectedBoard: 'esp32',
  draggingWireFrom: null,
  hoveredPin: null,
  simState: { ...DEFAULT_SIM_STATE },
  abortController: null,

  addComponent: (type, x, y) => {
    const id = `${type}-${Date.now()}`;
    set(s => ({ components: [...s.components, { id, type, x, y }] }));
    // Set default sensor values
    const def = getComponentDef(type);
    if (def.sensorDefaults) {
      const compId = id;
      set(s => ({
        simState: {
          ...s.simState,
          sensorValues: {
            ...s.simState.sensorValues,
            [compId]: { ...def.sensorDefaults },
          },
        },
      }));
    }
  },

  moveComponent: (id, x, y) => {
    set(s => ({
      components: s.components.map(c => c.id === id ? { ...c, x, y } : c),
    }));
  },

  removeComponent: (id) => {
    set(s => ({
      components: s.components.filter(c => c.id !== id),
      wires: s.wires.filter(w => w.fromCompId !== id && w.toCompId !== id),
    }));
  },

  setSelectedBoard: (board) => {
    const { components } = get();
    const boardComp = components.find(c => c.type === 'esp32' || c.type === 'arduino-uno');
    if (boardComp) {
      set(s => ({
        selectedBoard: board,
        components: s.components.map(c =>
          c.id === boardComp.id ? { ...c, type: board } : c
        ),
      }));
    }
  },

  startWireFrom: (compId, pinId) => set({ draggingWireFrom: { compId, pinId } }),

  completeWireTo: (toCompId, toPinId) => {
    const { draggingWireFrom, wires } = get();
    if (!draggingWireFrom) return;
    if (draggingWireFrom.compId === toCompId && draggingWireFrom.pinId === toPinId) {
      set({ draggingWireFrom: null });
      return;
    }
    // Prevent duplicate wires
    const exists = wires.some(
      w => (w.fromCompId === draggingWireFrom.compId && w.fromPinId === draggingWireFrom.pinId &&
             w.toCompId === toCompId && w.toPinId === toPinId) ||
           (w.fromCompId === toCompId && w.fromPinId === toPinId &&
             w.toCompId === draggingWireFrom.compId && w.toPinId === draggingWireFrom.pinId),
    );
    if (!exists) {
      const newWire: Wire = {
        id: `wire-${Date.now()}`,
        fromCompId: draggingWireFrom.compId,
        fromPinId: draggingWireFrom.pinId,
        toCompId,
        toPinId,
      };
      set(s => ({ wires: [...s.wires, newWire], draggingWireFrom: null }));
    } else {
      set({ draggingWireFrom: null });
    }
  },

  cancelWire: () => set({ draggingWireFrom: null }),
  removeWire: (id) => set(s => ({ wires: s.wires.filter(w => w.id !== id) })),
  setHoveredPin: (pin) => set({ hoveredPin: pin }),
  updateCode: (code) => set({ code }),

  setSensorValue: (compId, key, value) => {
    set(s => ({
      simState: {
        ...s.simState,
        sensorValues: {
          ...s.simState.sensorValues,
          [compId]: { ...s.simState.sensorValues[compId], [key]: value },
        },
      },
    }));
  },

  updateSimState: (patch) => {
    set(s => ({ simState: { ...s.simState, ...patch } }));
  },

  appendSerial: (line) => {
    set(s => ({
      simState: {
        ...s.simState,
        serialLog: [...s.simState.serialLog.slice(-199), `[${formatTime(s.simState)}] ${line}`],
      },
    }));
  },

  clearSerial: () => {
    set(s => ({ simState: { ...s.simState, serialLog: [] } }));
  },

  setAbortController: (ac) => set({ abortController: ac }),
  setRunning: (running) => set(s => ({ simState: { ...s.simState, running, error: running ? null : s.simState.error } })),

  loadTemplate: (type) => {
    const def = getComponentDef(type);
    if (def.defaultCode) {
      set({ code: def.defaultCode });
    }
  },
}));

function formatTime(_state: SimState): string {
  return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
