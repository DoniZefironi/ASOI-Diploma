import { create } from 'zustand';
import { NodeDef, Wire, NodeType, ID } from '../types/circuit.types';
import { evaluateNode, binaryToDecimal } from '../components/utils';

type SimulatorState = {
  nodes: Record<ID, NodeDef>;
  wires: Record<ID, Wire>;
  addNode: (node: Partial<NodeDef> & { type: NodeType }) => ID;
  removeNode: (id: ID) => void;
  updateNodePos: (id: ID, x: number, y: number) => void;
  toggleInputValue: (id: ID) => void;
  toggleClock: (id: ID) => void;
  startConnection: (fromNodeId: ID, fromSlot: number) => void;
  completeConnection: (toNodeId: ID, toSlot: number) => void;
  cancelConnection: () => void;
  connectionInProgress: null | { fromNodeId: ID; fromSlot: number };
  connectWire: (w: Wire) => void;
  removeWire: (id: ID) => void;
  runSimulation: () => void;
  exportCircuit: () => { nodes: Record<ID, NodeDef>; wires: Record<ID, Wire> };
  importCircuit: (data: { nodes: Record<ID, NodeDef>; wires: Record<ID, Wire> }) => void;
  clear: () => void;
  setNodeValue: (id: ID, value: boolean) => void;
  resetCounter: (id: ID) => void;
};

export const useCircuitStore = create<SimulatorState>((set, get) => ({
  nodes: {},
  wires: {},
  connectionInProgress: null,

  addNode: (node) => {
    const uid = (p = '') =>
      `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}${p}`;

    const id = uid(node.type);
    let defaultSlots = 1;
    let initialValues: Partial<NodeDef> = {};

    switch (node.type) {
      case 'INPUT':
        defaultSlots = 0;
        initialValues = { value: false };
        break;
      case 'OUTPUT':
        defaultSlots = 1;
        break;
      case 'NOT':
        defaultSlots = 1;
        break;
      case 'AND':
      case 'NAND':
      case 'OR':
      case 'NOR':
      case 'XOR':
      case 'XNOR':
        defaultSlots = 2;
        break;
      case 'COUNTER':
        defaultSlots = 3;
        initialValues = { counter: 0, bits: 4, maxCount: 15 };
        break;
      case 'CLOCK':
        defaultSlots = 0;
        initialValues = { clockSpeed: 1000, clockActive: false };
        break;
      case 'DISPLAY':
        defaultSlots = 4;
        initialValues = { displayValue: 0 };
        break;
      case 'SEVEN_SEGMENT':
        defaultSlots = 7;
        initialValues = { displayValue: 0 };
        break;
      case 'DFF':
      case 'TFF':
        defaultSlots = 2;
        initialValues = { state: false };
        break;
      case 'MUX':
        defaultSlots = 3;
        initialValues = { select: 0 };
        break;
      case 'DECODER':
        defaultSlots = 2;
        break;
      case 'ENCODER':
        defaultSlots = 4;
        break;
      case 'SHIFT_REGISTER':
        defaultSlots = 3;
        initialValues = { bits: 4, values: Array(4).fill(false) };
        break;
      case 'COMPARATOR':
        defaultSlots = 4;
        break;
      default:
        defaultSlots = 1;
    }

    const inputs = new Array(defaultSlots).fill(0).map(() => ({ id: null }));
    const nodeDef: NodeDef = {
      id,
      type: node.type,
      x: node.x ?? 100,
      y: node.y ?? 100,
      label: node.label ?? node.type,
      inputs,
      value: node.type === 'INPUT' ? false : undefined,
      ...initialValues,
    };
    set((state) => ({ nodes: { ...state.nodes, [id]: nodeDef } }));
    return id;
  },

  removeNode: (id) => {
    set((state) => {
      const newNodes = { ...state.nodes };
      delete newNodes[id];
      const newWires = Object.fromEntries(
        Object.entries(state.wires).filter(
          ([, w]) => w.from.nodeId !== id && w.to.nodeId !== id
        )
      );
      return { nodes: newNodes, wires: newWires };
    });
  },

  updateNodePos: (id, x, y) =>
    set((state) => ({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], x, y } },
    })),

  toggleInputValue: (id) =>
    set((state) => {
      const n = state.nodes[id];
      if (!n || n.type !== 'INPUT') return state;
      return {
        nodes: { ...state.nodes, [id]: { ...n, value: !n.value } },
      };
    }),

  toggleClock: (id) =>
    set((state) => {
      const n = state.nodes[id];
      if (!n || n.type !== 'CLOCK') return state;
      return {
        nodes: { ...state.nodes, [id]: { ...n, clockActive: !n.clockActive } },
      };
    }),

  setNodeValue: (id, value) =>
    set((state) => {
      const n = state.nodes[id];
      if (!n) return state;
      return {
        nodes: { ...state.nodes, [id]: { ...n, value } },
      };
    }),

  resetCounter: (id) =>
    set((state) => {
      const n = state.nodes[id];
      if (!n || n.type !== 'COUNTER') return state;
      return {
        nodes: { ...state.nodes, [id]: { ...n, counter: 0 } },
      };
    }),

  startConnection: (fromNodeId, fromSlot) =>
    set(() => ({ connectionInProgress: { fromNodeId, fromSlot } })),

  completeConnection: (toNodeId, toSlot) => {
    const prog = get().connectionInProgress;
    if (!prog) return;
    const uid = (p = '') =>
      `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}${p}`;
    const newWire: Wire = {
      id: uid('w'),
      from: { nodeId: prog.fromNodeId, slot: prog.fromSlot },
      to: { nodeId: toNodeId, slot: toSlot },
    };
    set((state) => ({
      wires: { ...state.wires, [newWire.id]: newWire },
      connectionInProgress: null,
    }));
  },

  cancelConnection: () => set(() => ({ connectionInProgress: null })),

  connectWire: (w) =>
    set((state) => ({ wires: { ...state.wires, [w.id]: w } })),

  removeWire: (id) =>
    set((state) => ({
      wires: Object.fromEntries(
        Object.entries(state.wires).filter(([, w]) => w.id !== id)
      ),
    })),

  runSimulation: () => {
    const state = get();
    const nodes = JSON.parse(JSON.stringify(state.nodes)) as Record<ID, NodeDef>;
    const wires = Object.values(state.wires) as Wire[];

    const incoming: Record<ID, Wire[]> = {};
    Object.keys(nodes).forEach((id) => (incoming[id] = []));
    wires.forEach((w) => {
      if (!incoming[w.to.nodeId]) incoming[w.to.nodeId] = [];
      incoming[w.to.nodeId].push(w);
    });

    const getInputValue = (nodeId: ID, slot: number): boolean => {
      const ins = incoming[nodeId].filter((w) => w.to.slot === slot);
      if (ins.length === 0) return false;
      return ins.some((w) => {
        const fromNode = nodes[w.from.nodeId];
        return !!fromNode?.value;
      });
    };

    const getAllInputValues = (nodeId: ID, count: number): boolean[] => {
      return Array.from({ length: count }, (_, idx) => getInputValue(nodeId, idx));
    };

    Object.values(nodes).forEach((node) => {
      if (node.type === 'COUNTER') {
        const clockInput = getInputValue(node.id, 0);
        const resetInput = getInputValue(node.id, 1);
        const enableInput = getInputValue(node.id, 2);
        const prevClock = state.nodes[node.id]?.value;
        if (resetInput) {
          node.counter = 0;
        } else if (enableInput && clockInput && !prevClock) {
          node.counter = ((node.counter || 0) + 1) % (node.maxCount || 16);
        }
      } else if (node.type === 'DFF') {
        const dInput = getInputValue(node.id, 0);
        const clockInput = getInputValue(node.id, 1);
        const prevClock = state.nodes[node.id]?.value;
        if (clockInput && !prevClock) {
          node.state = dInput;
        }
      } else if (node.type === 'TFF') {
        const tInput = getInputValue(node.id, 0);
        const clockInput = getInputValue(node.id, 1);
        const prevClock = state.nodes[node.id]?.value;
        if (clockInput && !prevClock && tInput) {
          node.state = !(node.state || false);
        }
      } else if (node.type === 'MUX') {
        const selectInput = getInputValue(node.id, 2);
        node.select = selectInput ? 1 : 0;
      } else if (node.type === 'DISPLAY') {
        const inputBits = getAllInputValues(node.id, 4);
        node.displayValue = binaryToDecimal(inputBits);
      } else if (node.type === 'SEVEN_SEGMENT') {
        const inputBits = getAllInputValues(node.id, 4);
        node.displayValue = binaryToDecimal(inputBits) % 10;
      } else if (node.type === 'SHIFT_REGISTER') {
        const dataInput = getInputValue(node.id, 0);
        const clockInput = getInputValue(node.id, 1);
        const resetInput = getInputValue(node.id, 2);
        const prevClock = state.nodes[node.id]?.value;
        if (resetInput) {
          node.values = Array(node.bits || 4).fill(false);
        } else if (clockInput && !prevClock) {
          const currentValues = node.values || Array(node.bits || 4).fill(false);
          node.values = [dataInput, ...currentValues.slice(0, -1)];
        }
      }
    });

    const MAX = 50;
    let it = 0;
    let changed = true;
    while (changed && it < MAX) {
      changed = false;
      it++;
      Object.values(nodes).forEach((node) => {
        const inputVals = node.inputs.map((_, idx) => getInputValue(node.id, idx));
        const newVal = evaluateNode(node, inputVals);
        if (node.value !== newVal) {
          node.value = newVal;
          changed = true;
        }
      });
    }

    Object.values(nodes).forEach((node) => {
      if (node.type === 'DFF' || node.type === 'TFF') {
        node.value = node.state;
      } else if (node.type === 'COUNTER') {
        node.value = !!node.counter;
      }
    });

    set(() => ({ nodes }));
  },

  exportCircuit: () => {
    const { nodes, wires } = get();
    return { nodes, wires };
  },

  importCircuit: (data) => {
    set(() => ({ nodes: data.nodes, wires: data.wires }));
  },

  clear: () => set(() => ({ nodes: {}, wires: {} })),
}));