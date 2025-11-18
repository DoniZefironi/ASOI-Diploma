import { create } from 'zustand';
import { Component, ComponentType, Pin, Wire } from '../types';

// Вспомогательные функции
const createArduinoPins = (): Pin[] => [
  { id: 'D13', type: 'output', x: 120, y: 80 },
  { id: 'GND', type: 'ground', x: 120, y: 100 },
];

const createLedPins = (): Pin[] => [
  { id: 'anode', type: 'input', x: 0, y: -8 },
  { id: 'cathode', type: 'ground', x: 0, y: 8 },
];

const createButtonPins = (): Pin[] => [
  { id: 'p1', type: 'input', x: -8, y: 0 },
  { id: 'p2', type: 'output', x: 8, y: 0 },
];

export interface SchematicState {
  components: Component[];
  wires: Wire[];
  arduinoCode: string;
  simulationRunning: boolean;
  hoveredPin: { compId: string; pinId: string } | null;
  draggingWireFrom: { compId: string; pinId: string } | null;

  addComponent: (type: ComponentType, x: number, y: number) => void;
  startWireFrom: (compId: string, pinId: string) => void;
  completeWireTo: (compId: string, pinId: string) => void;
  setHoveredPin: (pin: { compId: string; pinId: string } | null) => void;
  updateCode: (code: string) => void;
  setSimulationRunning: (running: boolean) => void;
}

export const useSchematicStore = create<SchematicState>((set, get) => ({
  components: [
    {
      id: 'mcu-1',
      type: 'arduino-un',
      x: 200,
      y: 200,
      pins: createArduinoPins(),
    },
  ],
  wires: [],
  arduinoCode: `void setup() {
  pinMode(2, INPUT_PULLUP); // кнопка на D2
  pinMode(13, OUTPUT);      // LED на D13
}
void loop() {
  if (digitalRead(2) == LOW) {
    digitalWrite(13, HIGH);
  } else {
    digitalWrite(13, LOW);
  }
}`,
  simulationRunning: false,
  hoveredPin: null,
  draggingWireFrom: null,

  addComponent: (type, x, y) => {
    let pins: Pin[] = [];
    if (type === 'led') pins = createLedPins();
    if (type === 'button') pins = createButtonPins();
    if (type === 'arduino-un') pins = createArduinoPins();

    set((state) => ({
      components: [...state.components, { id: Date.now().toString(), type, x, y, pins }],
    }));
  },

  startWireFrom: (compId, pinId) => set({ draggingWireFrom: { compId, pinId } }),
  setHoveredPin: (pin) => set({ hoveredPin: pin }),

  completeWireTo: (toCompId, toPinId) => {
    const { draggingWireFrom, wires } = get();
    if (!draggingWireFrom) return;
    if (draggingWireFrom.compId === toCompId) return; // нельзя соединять один компонент

    const newWire: Wire = {
      id: Date.now().toString(),
      from: draggingWireFrom,
      to: { compId: toCompId, pinId: toPinId },
    };

    set({
      wires: [...wires, newWire],
      draggingWireFrom: null,
    });
  },

  updateCode: (code) => set({ arduinoCode: code }),
  setSimulationRunning: (running) => set({ simulationRunning: running }),
}));