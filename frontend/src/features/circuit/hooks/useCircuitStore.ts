import { create } from 'zustand';
import { NodeDef, Wire, ID, NodeType } from '../types';
import { uid, evaluateNode } from '../utils';

type SimulatorState = {
  nodes: Record<ID, NodeDef>;
  wires: Record<ID, Wire>;
  connectionInProgress: null | { fromNodeId: ID; fromSlot: number };

  addNode: (node: Partial<NodeDef> & { type: NodeType }) => ID;
  removeNode: (id: ID) => void;
  updateNodePos: (id: ID, x: number, y: number) => void;
  toggleInputValue: (id: ID) => void;
  toggleClock: (id: ID) => void;
  startConnection: (fromNodeId: ID, fromSlot: number) => void;
  completeConnection: (toNodeId: ID, toSlot: number) => void;
  cancelConnection: () => void;
  connectWire: (w: Wire) => void;
  removeWire: (id: ID) => void;
  runSimulation: () => void;
  exportJSON: () => string;
  importJSON: (s: string) => void;
  clear: () => void;
};

export const useCircuitStore = create<SimulatorState>((set, get) => ({
  nodes: {},
  wires: {},
  connectionInProgress: null,

  addNode: (node) => {
    const id = uid(node.type);
    let defaultSlots = 1;
    let initialValues: Partial<NodeDef> = {};

    switch (node.type) {
      case 'INPUT':
        defaultSlots = 0;
        initialValues = { value: false };
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
        defaultSlots = 1;
        initialValues = { counter: 0 };
        break;
      case 'CLOCK':
        defaultSlots = 0;
        initialValues = { clockSpeed: 1000, clockActive: false };
        break;
      case 'DISPLAY':
        defaultSlots = 4;
        break;
      case 'DFF':
        defaultSlots = 2;
        initialValues = { state: false };
        break;
      case 'TFF':
        defaultSlots = 2;
        initialValues = { state: false };
        break;
      case 'MUX':
        defaultSlots = 3;
        initialValues = { select: 0 };
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
        Object.entries(state.wires).filter(([, w]) => 
          (w as Wire).from.nodeId !== id && (w as Wire).to.nodeId !== id
        )
      );
      return { nodes: newNodes, wires: newWires };
    });
  },

  updateNodePos: (id, x, y) => set((state) => ({ 
    nodes: { ...state.nodes, [id]: { ...state.nodes[id], x, y } } 
  })),

  toggleInputValue: (id) => set((state) => {
    const n = state.nodes[id];
    if (!n || n.type !== 'INPUT') return state;
    const newNode = { ...n, value: !n.value };
    return { nodes: { ...state.nodes, [id]: newNode } };
  }),

  toggleClock: (id) => set((state) => {
    const n = state.nodes[id];
    if (!n || n.type !== 'CLOCK') return state;
    const newNode = { ...n, clockActive: !n.clockActive };
    return { nodes: { ...state.nodes, [id]: newNode } };
  }),

  startConnection: (fromNodeId, fromSlot) => set(() => ({ 
    connectionInProgress: { fromNodeId, fromSlot } 
  })),

  completeConnection: (toNodeId, toSlot) => {
    const prog = get().connectionInProgress;
    if (!prog) return;
    const newWire: Wire = { 
      id: uid('w'), 
      from: { nodeId: prog.fromNodeId, slot: prog.fromSlot }, 
      to: { nodeId: toNodeId, slot: toSlot } 
    };
    set((state) => ({ 
      wires: { ...state.wires, [newWire.id]: newWire }, 
      connectionInProgress: null 
    }));
  },

  cancelConnection: () => set(() => ({ connectionInProgress: null })),

  connectWire: (w) => set((state) => ({ 
    wires: { ...state.wires, [w.id]: w } 
  })),

  removeWire: (id) => set((state) => ({ 
    wires: Object.fromEntries(
      Object.entries(state.wires).filter(([, w]) => (w as Wire).id !== id)
    ) 
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

    // Handle counters and special nodes
    Object.values(nodes).forEach((node) => {
      if (node.type === 'COUNTER') {
        const currentInput = getInputValue(node.id, 0);
        const prevInput = state.nodes[node.id]?.value;
        if (currentInput && !prevInput) {
          node.counter = (node.counter || 0) + 1;
        }
      }
      else if (node.type === 'DFF') {
        const dInput = getInputValue(node.id, 0);
        const clockInput = getInputValue(node.id, 1);
        const prevClock = state.nodes[node.id]?.value;
        if (clockInput && !prevClock) {
          node.state = dInput;
        }
      }
      else if (node.type === 'TFF') {
        const tInput = getInputValue(node.id, 0);
        const clockInput = getInputValue(node.id, 1);
        const prevClock = state.nodes[node.id]?.value;
        if (clockInput && !prevClock && tInput) {
          node.state = !(node.state || false);
        }
      }
      else if (node.type === 'MUX') {
        const selectInput = getInputValue(node.id, 2);
        node.select = selectInput ? 1 : 0;
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

    // Update flip-flop values based on their state
    Object.values(nodes).forEach((node) => {
      if (node.type === 'DFF' || node.type === 'TFF') {
        node.value = node.state;
      }
    });

    set(() => ({ nodes }));
  },

  exportJSON: () => {
    const { nodes, wires } = get();
    return JSON.stringify({ nodes, wires }, null, 2);
  },

  importJSON: (s: string) => {
    try {
      const parsed = JSON.parse(s) as { nodes: Record<ID, NodeDef>; wires: Record<ID, Wire> };
      const nodes = parsed.nodes ?? {};
      const wires = parsed.wires ?? {};
      set(() => ({ nodes, wires }));
    } catch (e) {
      console.error('Import JSON failed', e);
    }
  },

  clear: () => set(() => ({ nodes: {}, wires: {} })),
}));