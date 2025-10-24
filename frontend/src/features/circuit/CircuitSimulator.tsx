'use client';

import React, { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';

// =========================
// Types
// =========================

type ID = string;

// Added new node types
type NodeType = 'INPUT' | 'OUTPUT' | 'AND' | 'OR' | 'NOT' | 'LED' | 'COUNTER' | 'CLOCK' | 'DISPLAY' | 'CUSTOM' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'DFF' | 'TFF' | 'MUX';

type NodeDef = {
  id: ID;
  type: NodeType;
  x: number;
  y: number;
  label?: string;
  inputs: Array<{ id: string | null }>;
  value?: boolean;
  counter?: number;
  clockSpeed?: number;
  clockActive?: boolean;
  // Added for flip-flops
  state?: boolean;
  // Added for MUX
  select?: number;
};

type Wire = {
  id: ID;
  from: { nodeId: ID; slot: number };
  to: { nodeId: ID; slot: number };
};

// =========================
// Utilities
// =========================

const uid = (p = '') => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}${p}`;

function evaluateNode(node: NodeDef, inputsValues: boolean[]): boolean {
  switch (node.type) {
    case 'INPUT':
      return !!node.value;
    case 'OUTPUT':
      return !!inputsValues[0];
    case 'LED':
      return !!inputsValues[0];
    case 'NOT':
      return !inputsValues[0];
    case 'AND':
      return inputsValues.every(Boolean);
    case 'OR':
      return inputsValues.some(Boolean);
    case 'NAND':
      return !inputsValues.every(Boolean); // NOT (A AND B)
    case 'NOR':
      return !inputsValues.some(Boolean); // NOT (A OR B)
    case 'XOR':
      return inputsValues.filter(Boolean).length === 1; // Exactly one true
    case 'XNOR':
      return inputsValues.filter(Boolean).length !== 1; // NOT (A XOR B)
    case 'COUNTER':
      // Counts rising edges on first input
      return !!inputsValues[0];
    case 'CLOCK':
      return !!node.clockActive;
    case 'DISPLAY':
      return !!inputsValues[0];
    case 'DFF':
      // D Flip-Flop: Q = D on clock rising edge
      // This is handled in the simulation loop
      return !!node.state;
    case 'TFF':
      // T Flip-Flop: Q toggles on clock rising edge
      // This is handled in the simulation loop
      return !!node.state;
    case 'MUX':
      // Multiplexer: output depends on select line
      const selectIndex = node.select || 0;
      return inputsValues[selectIndex] || false;
    case 'CUSTOM':
      return inputsValues.some(Boolean);
    default:
      return false;
  }
}

// =========================
// Zustand store
// =========================

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
  exportJSON: () => string;
  importJSON: (s: string) => void;
  clear: () => void;
};

const useStore = create<SimulatorState>((set, get) => ({
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
        defaultSlots = 4; // 4-bit display
        break;
      case 'DFF':
        // D input, Clock input
        defaultSlots = 2;
        initialValues = { state: false };
        break;
      case 'TFF':
        // T input, Clock input
        defaultSlots = 2;
        initialValues = { state: false };
        break;
      case 'MUX':
        // Data inputs (2 for 2:1 MUX), Select input
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
        // Count on rising edge
        if (currentInput && !prevInput) {
          node.counter = (node.counter || 0) + 1;
        }
      }
      // Handle D Flip-Flop
      else if (node.type === 'DFF') {
        const dInput = getInputValue(node.id, 0);
        const clockInput = getInputValue(node.id, 1);
        const prevClock = state.nodes[node.id]?.value; // Previous clock state
        // Update state on rising clock edge
        if (clockInput && !prevClock) {
          node.state = dInput;
        }
      }
      // Handle T Flip-Flop
      else if (node.type === 'TFF') {
        const tInput = getInputValue(node.id, 0);
        const clockInput = getInputValue(node.id, 1);
        const prevClock = state.nodes[node.id]?.value; // Previous clock state
        // Toggle state on rising clock edge if T is high
        if (clockInput && !prevClock && tInput) {
          node.state = !(node.state || false);
        }
      }
      // Handle MUX
      else if (node.type === 'MUX') {
        const selectInput = getInputValue(node.id, 2); // Third input is select
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

// =========================
// React Component: CircuitSimulator
// =========================

export default function CircuitSimulator() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const panRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({ 
    dragging: false, 
    lastX: 0, 
    lastY: 0 
  });

  const nodes = useStore((s) => s.nodes);
  const wires = useStore((s) => s.wires);
  const addNode = useStore((s) => s.addNode);
  const removeNode = useStore((s) => s.removeNode);
  const updateNodePos = useStore((s) => s.updateNodePos);
  const startConnection = useStore((s) => s.startConnection);
  const completeConnection = useStore((s) => s.completeConnection);
  const cancelConnection = useStore((s) => s.cancelConnection);
  const connectionInProgress = useStore((s) => s.connectionInProgress);
  const toggleInputValue = useStore((s) => s.toggleInputValue);
  const toggleClock = useStore((s) => s.toggleClock);
  const runSimulation = useStore((s) => s.runSimulation);
  const exportJSON = useStore((s) => s.exportJSON);
  const importJSON = useStore((s) => s.importJSON);
  const clear = useStore((s) => s.clear);
  const removeWire = useStore((s) => s.removeWire);

  const nodeDrag = useRef<{ 
    id: ID | null; 
    startX: number; 
    startY: number; 
    sx: number; 
    sy: number 
  }>({ 
    id: null, 
    startX: 0, 
    startY: 0, 
    sx: 0, 
    sy: 0 
  });

  // Clock simulation
  useEffect(() => {
    const clockNodes = Object.values(nodes).filter(node => node.type === 'CLOCK' && node.clockActive);
    if (clockNodes.length === 0) return;

    const interval = setInterval(() => {
      runSimulation();
    }, 500); // Fixed clock speed for simplicity

    return () => clearInterval(interval);
  }, [nodes, runSimulation]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = delta > 0 ? 1.1 : 0.9;
      setScale((s) => Math.max(0.2, Math.min(4, s * factor)));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  const screenToWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = (clientX - rect.left - offset.x) / scale;
    const y = (clientY - rect.top - offset.y) / scale;
    return { x, y };
  };

  const onPointerDownCanvas = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.node')) return;
    panRef.current.dragging = true;
    panRef.current.lastX = e.clientX;
    panRef.current.lastY = e.clientY;
  };

  const onPointerMoveCanvas = (e: React.PointerEvent) => {
    if (!panRef.current.dragging) return;
    const dx = e.clientX - panRef.current.lastX;
    const dy = e.clientY - panRef.current.lastY;
    panRef.current.lastX = e.clientX;
    panRef.current.lastY = e.clientY;
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  };

  const onPointerUpCanvas = () => {
    panRef.current.dragging = false;
  };

  const onNodePointerDown = (e: React.PointerEvent, id: ID) => {
    e.stopPropagation();
    const world = screenToWorld(e.clientX, e.clientY);
    const node = nodes[id];
    nodeDrag.current = { 
      id, 
      startX: world.x, 
      startY: world.y, 
      sx: node.x, 
      sy: node.y 
    };
  };

  const onPointerMoveRoot = (e: React.PointerEvent) => {
    if (nodeDrag.current.id) {
      const world = screenToWorld(e.clientX, e.clientY);
      const dx = world.x - nodeDrag.current.startX;
      const dy = world.y - nodeDrag.current.startY;
      updateNodePos(nodeDrag.current.id, nodeDrag.current.sx + dx, nodeDrag.current.sy + dy);
    }
  };

  const onRootPointerUp = () => {
    nodeDrag.current.id = null;
  };

  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    if (!connectionInProgress) setPreview(null);
  }, [connectionInProgress]);

  const onMouseMoveForPreview = (e: React.MouseEvent) => {
    if (!connectionInProgress) return;
    const world = screenToWorld(e.clientX, e.clientY);
    setPreview(world);
  };

  const handleExport = () => {
    const s = exportJSON();
    const blob = new Blob([s], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const txt = String(ev.target?.result ?? '');
      importJSON(txt);
    };
    reader.readAsText(file);
  };

  const Palette = () => {
    const add = (type: NodeType) => {
      addNode({ type, x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 });
    };

    // Updated node types list with new components
    const nodeTypes: { type: NodeType; label: string; color: string }[] = [
      { type: 'INPUT', label: 'Input', color: 'bg-blue-600' },
      { type: 'OUTPUT', label: 'Output', color: 'bg-green-600' },
      { type: 'AND', label: 'AND', color: 'bg-purple-600' },
      { type: 'OR', label: 'OR', color: 'bg-purple-600' },
      { type: 'NOT', label: 'NOT', color: 'bg-purple-600' },
      { type: 'NAND', label: 'NAND', color: 'bg-purple-600' },
      { type: 'NOR', label: 'NOR', color: 'bg-purple-600' },
      { type: 'XOR', label: 'XOR', color: 'bg-purple-600' },
      { type: 'XNOR', label: 'XNOR', color: 'bg-purple-600' },
      { type: 'LED', label: 'LED', color: 'bg-yellow-600' },
      { type: 'CLOCK', label: 'Clock', color: 'bg-orange-600' },
      { type: 'COUNTER', label: 'Counter', color: 'bg-cyan-600' },
      { type: 'DISPLAY', label: 'Display', color: 'bg-pink-600' },
      { type: 'DFF', label: 'D-FF', color: 'bg-indigo-600' },
      { type: 'TFF', label: 'T-FF', color: 'bg-indigo-600' },
      { type: 'MUX', label: 'MUX', color: 'bg-teal-600' },
    ];

    return (
      <div className="p-2 flex gap-2 flex-wrap">
        {nodeTypes.map(({ type, label, color }) => (
          <button 
            key={type} 
            className={`${color} text-white rounded px-3 py-2 text-sm hover:opacity-80 transition-opacity border border-gray-600`}
            onClick={() => add(type)}
          >
            {label}
          </button>
        ))}
        <button 
          className="bg-red-600 text-white rounded px-3 py-2 text-sm hover:opacity-80 transition-opacity border border-gray-600" 
          onClick={() => { clear(); }}
        >
          Clear All
        </button>
      </div>
    );
  };

  const NodeView: React.FC<{ node: NodeDef }> = ({ node }) => {
    const width = 120;
    const height = 60;
    // Adjust port positions based on node type
    const inputCount = node.inputs.length;
    let portY = (i: number) => -height / 2 + 15 + (i * 15);
    
    // For flip-flops and MUX, adjust port positions
    if (node.type === 'DFF' || node.type === 'TFF' || node.type === 'MUX') {
      portY = (i: number) => -height / 2 + 20 + (i * 20);
    }

    const getNodeColor = () => {
      switch (node.type) {
        case 'INPUT': return '#2563eb';
        case 'OUTPUT': return '#16a34a';
        case 'LED': return '#ca8a04';
        case 'CLOCK': return '#ea580c';
        case 'COUNTER': return '#0891b2';
        case 'DISPLAY': return '#db2777';
        case 'DFF': 
        case 'TFF': return '#4f46e5';
        case 'MUX': return '#0d9488';
        default: return '#7c3aed'; // For AND, OR, NOT, etc.
      }
    };

    const getActiveColor = () => {
      switch (node.type) {
        case 'INPUT': return '#3b82f6';
        case 'OUTPUT': return '#22c55e';
        case 'LED': return '#eab308';
        case 'CLOCK': return '#f97316';
        case 'COUNTER': return '#06b6d4';
        case 'DISPLAY': return '#ec4899';
        case 'DFF': 
        case 'TFF': return '#6366f1';
        case 'MUX': return '#14b8a6';
        default: return '#8b5cf6';
      }
    };

    const nodeColor = getNodeColor();
    const activeColor = getActiveColor();

    return (
      <g 
        transform={`translate(${node.x}, ${node.y})`} 
        className="node" 
        onPointerDown={(e) => onNodePointerDown(e, node.id)}
      >
        {/* Node body with glow effect when active */}
        <rect 
          x={-width/2} 
          y={-height/2} 
          width={width} 
          height={height} 
          rx={12} 
          ry={12} 
          fill="#1f2937" 
          stroke={node.value ? activeColor : nodeColor}
          strokeWidth={2}
          filter={node.value ? "url(#glow)" : "none"}
        />

        {/* Node label */}
        <text 
          x={0} 
          y={-height/2 + 16} 
          fontSize={11} 
          fontFamily="Inter, sans-serif"
          fill="#f3f4f6"
          textAnchor="middle"
          fontWeight="500"
        >
          {node.label ?? node.type}
        </text>

        {/* Input ports */}
        {Array.from({ length: inputCount }).map((_, idx) => {
          const py = portY(idx);
          return (
            <g key={idx}>
              <circle 
                cx={-width/2} 
                cy={py} 
                r={5} 
                fill="#374151" 
                stroke="#6b7280" 
                strokeWidth={1}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  completeConnection(node.id, idx); 
                }} 
              />
            </g>
          );
        })}

        {/* Output port */}
        <circle 
          cx={width/2} 
          cy={0} 
          r={7} 
          fill={node.value ? activeColor : '#374151'} 
          stroke={node.value ? activeColor : '#6b7280'}
          strokeWidth={1}
          onClick={(e) => { 
            e.stopPropagation(); 
            startConnection(node.id, 0); 
          }} 
        />

        {/* Special node controls and displays */}
        {node.type === 'INPUT' && (
          <g 
            onClick={(e) => { 
              e.stopPropagation(); 
              toggleInputValue(node.id); 
            }} 
            style={{ cursor: 'pointer' }}
          >
            <rect 
              x={-width/2 + 10} 
              y={-height/2 + 25} 
              width={40} 
              height={20} 
              rx={6} 
              fill={node.value ? activeColor : '#374151'} 
              stroke={node.value ? activeColor : '#6b7280'}
            />
            <text 
              x={-width/2 + 30} 
              y={-height/2 + 38} 
              fontSize={10} 
              textAnchor="middle"
              fill="#f3f4f6"
              fontWeight="bold"
            >
              {node.value ? 'ON' : 'OFF'}
            </text>
          </g>
        )}

        {node.type === 'LED' && (
          <g>
            <circle 
              cx={0} 
              cy={5} 
              r={12} 
              fill={node.value ? '#fef08a' : '#4b5563'} 
              stroke={node.value ? '#fef08a' : '#6b7280'}
              strokeWidth={2}
              filter={node.value ? "url(#ledGlow)" : "none"}
            />
          </g>
        )}

        {node.type === 'CLOCK' && (
          <g 
            onClick={(e) => { 
              e.stopPropagation(); 
              toggleClock(node.id); 
            }} 
            style={{ cursor: 'pointer' }}
          >
            <rect 
              x={-width/2 + 10} 
              y={-height/2 + 25} 
              width={40} 
              height={20} 
              rx={6} 
              fill={node.clockActive ? activeColor : '#374151'} 
              stroke={node.clockActive ? activeColor : '#6b7280'}
            />
            <text 
              x={-width/2 + 30} 
              y={-height/2 + 38} 
              fontSize={9} 
              textAnchor="middle"
              fill="#f3f4f6"
              fontWeight="bold"
            >
              {node.clockActive ? 'RUN' : 'STOP'}
            </text>
          </g>
        )}

        {node.type === 'COUNTER' && (
          <g>
            <rect 
              x={-width/2 + 10} 
              y={-height/2 + 25} 
              width={40} 
              height={20} 
              rx={6} 
              fill="#111827" 
              stroke="#6b7280"
            />
            <text 
              x={-width/2 + 30} 
              y={-height/2 + 38} 
              fontSize={10} 
              textAnchor="middle"
              fill="#f3f4f6"
              fontWeight="bold"
            >
              {node.counter || 0}
            </text>
          </g>
        )}

        {node.type === 'DISPLAY' && (
          <g>
            <rect 
              x={-width/2 + 10} 
              y={-height/2 + 25} 
              width={40} 
              height={20} 
              rx={4} 
              fill="#000" 
              stroke="#6b7280"
            />
            <text 
              x={-width/2 + 30} 
              y={-height/2 + 38} 
              fontSize={10} 
              textAnchor="middle"
              fill="#00ff00"
              fontWeight="bold"
            >
              {node.value ? '1' : '0'}
            </text>
          </g>
        )}

        {/* D Flip-Flop state display */}
        {node.type === 'DFF' && (
          <g>
            <rect 
              x={-width/2 + 10} 
              y={-height/2 + 25} 
              width={40} 
              height={20} 
              rx={6} 
              fill="#111827" 
              stroke="#6b7280"
            />
            <text 
              x={-width/2 + 30} 
              y={-height/2 + 38} 
              fontSize={10} 
              textAnchor="middle"
              fill="#f3f4f6"
              fontWeight="bold"
            >
              {node.state ? '1' : '0'}
            </text>
          </g>
        )}

        {/* T Flip-Flop state display */}
        {node.type === 'TFF' && (
          <g>
            <rect 
              x={-width/2 + 10} 
              y={-height/2 + 25} 
              width={40} 
              height={20} 
              rx={6} 
              fill="#111827" 
              stroke="#6b7280"
            />
            <text 
              x={-width/2 + 30} 
              y={-height/2 + 38} 
              fontSize={10} 
              textAnchor="middle"
              fill="#f3f4f6"
              fontWeight="bold"
            >
              {node.state ? '1' : '0'}
            </text>
          </g>
        )}

        {/* MUX select display */}
        {node.type === 'MUX' && (
          <g>
            <rect 
              x={-width/2 + 10} 
              y={-height/2 + 25} 
              width={40} 
              height={20} 
              rx={6} 
              fill="#111827" 
              stroke="#6b7280"
            />
            <text 
              x={-width/2 + 30} 
              y={-height/2 + 38} 
              fontSize={10} 
              textAnchor="middle"
              fill="#f3f4f6"
              fontWeight="bold"
            >
              S:{node.select || 0}
            </text>
          </g>
        )}

        {/* Delete button */}
        <g 
          transform={`translate(${width/2 - 15}, ${-height/2 + 15})`} 
          onClick={(e) => { 
            e.stopPropagation(); 
            removeNode(node.id); 
          }} 
          style={{ cursor: 'pointer' }}
        >
          <circle r={8} fill="#ef4444" stroke="#dc2626" />
          <text x={0} y={3} fontSize={10} textAnchor="middle" fill="#fef2f2" fontWeight="bold">×</text>
        </g>
      </g>
    );
  };

  function wirePath(from: { x: number; y: number }, to: { x: number; y: number }) {
    const dx = Math.abs(to.x - from.x);
    const hx = Math.max(20, dx / 2);
    return `M ${from.x} ${from.y} C ${from.x + hx} ${from.y} ${to.x - hx} ${to.y} ${to.x} ${to.y}`;
  }

  const WireView: React.FC<{ wire: Wire }> = ({ wire }) => {
    const fromNode = nodes[wire.from.nodeId];
    const toNode = nodes[wire.to.nodeId];
    if (!fromNode || !toNode) return null;
    // Adjust wire connections based on node type
    let fromX, fromY, toX, toY;
    
    if (fromNode.type === 'DFF' || fromNode.type === 'TFF' || fromNode.type === 'MUX') {
      fromX = fromNode.x + 60;
      fromY = fromNode.y + 0; // Output is at center
    } else {
      fromX = fromNode.x + 60;
      fromY = fromNode.y + 0;
    }
    
    if (toNode.type === 'DFF' || toNode.type === 'TFF' || toNode.type === 'MUX') {
      toX = toNode.x - 60;
      toY = toNode.y + (-25 + wire.to.slot * 20); // Adjust for port positions
    } else {
      toX = toNode.x - 60;
      toY = toNode.y + (-30 + wire.to.slot * 15);
    }
    
    return (
      <g>
        <path 
          d={wirePath({x: fromX, y: fromY}, {x: toX, y: toY})} 
          stroke={fromNode.value ? '#60a5fa' : '#4b5563'} 
          strokeWidth={fromNode.value ? 3 : 2}
          fill="none" 
          onClick={(e) => { 
            e.stopPropagation(); 
            removeWire(wire.id); 
          }} 
        />
      </g>
    );
  };

  const PreviewWire: React.FC = () => {
    if (!connectionInProgress || !preview) return null;
    const fromNode = nodes[connectionInProgress.fromNodeId];
    if (!fromNode) return null;
    const from = { x: fromNode.x + 60, y: fromNode.y + 0 };
    const to = { x: preview.x, y: preview.y };
    return (
      <path 
        d={wirePath(from, to)} 
        stroke="#9ca3af" 
        strokeDasharray="6 6" 
        strokeWidth={2} 
        fill="none" 
      />
    );
  };

  return (
    <div className="w-full h-[720px] border border-gray-700 rounded-lg overflow-hidden flex flex-col bg-gray-900">
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Palette />
          <button 
            className="bg-green-600 text-white rounded px-4 py-2 text-sm hover:bg-green-700 transition-colors border border-green-500" 
            onClick={() => runSimulation()}
          >
            ▶ Run Simulation
          </button>
          <button 
            className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700 transition-colors border border-blue-500" 
            onClick={() => { 
              const s = exportJSON(); 
              navigator.clipboard.writeText(s); 
            }}
          >
            📋 Copy JSON
          </button>
          <button 
            className="bg-purple-600 text-white rounded px-4 py-2 text-sm hover:bg-purple-700 transition-colors border border-purple-500" 
            onClick={handleExport}
          >
            💾 Download
          </button>
          <label className="bg-amber-600 text-white rounded px-4 py-2 text-sm hover:bg-amber-700 transition-colors border border-amber-500 cursor-pointer">
            📁 Upload
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => handleImport(e.target.files?.[0] ?? null)} 
            />
          </label>
        </div>
        <div className="text-sm text-gray-300 font-mono">
          Zoom: {scale.toFixed(2)} | Nodes: {Object.keys(nodes).length} | Wires: {Object.keys(wires).length}
        </div>
      </div>

      <div 
        className="flex-1 relative" 
        onPointerMove={onPointerMoveRoot} 
        onPointerUp={onRootPointerUp} 
        onPointerLeave={onRootPointerUp}
      >
        <svg 
          ref={svgRef} 
          className="w-full h-full bg-gray-900" 
          onPointerDown={onPointerDownCanvas} 
          onPointerMove={onPointerMoveCanvas} 
          onPointerUp={onPointerUpCanvas} 
          onMouseMove={onMouseMoveForPreview}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
            {/* Dark grid */}
            <g>
              {Array.from({ length: 40 }).map((_, i) => (
                <line 
                  key={`v_${i}`} 
                  x1={i*50} 
                  y1={0} 
                  x2={i*50} 
                  y2={4000} 
                  stroke="#374151" 
                  strokeWidth={1}
                />
              ))}
              {Array.from({ length: 40 }).map((_, i) => (
                <line 
                  key={`h_${i}`} 
                  x1={0} 
                  y1={i*50} 
                  x2={4000} 
                  y2={i*50} 
                  stroke="#374151" 
                  strokeWidth={1}
                />
              ))}
            </g>

            {/* wires */}
            <g>
              {Object.values(wires).map((w) => (
                <WireView key={w.id} wire={w as Wire} />
              ))}
            </g>

            {/* preview */}
            <g>
              <PreviewWire />
            </g>

            {/* nodes */}
            <g>
              {Object.values(nodes).map((n) => (
                <NodeView key={n.id} node={n as NodeDef} />
              ))}
            </g>
          </g>
        </svg>

        {/* Dark overlay controls */}
        <div className="absolute right-3 bottom-3 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <div className="flex flex-col gap-2 text-sm">
            <button 
              className="px-3 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors border border-gray-600" 
              onClick={() => { setScale((s) => Math.min(4, s * 1.2)); }}
            >
              Zoom +
            </button>
            <button 
              className="px-3 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors border border-gray-600" 
              onClick={() => { setScale((s) => Math.max(0.2, s / 1.2)); }}
            >
              Zoom -
            </button>
            <button 
              className="px-3 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors border border-gray-600" 
              onClick={() => { setOffset({ x: 0, y: 0 }); setScale(1); }}
            >
              Reset View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}