'use client';

import React, { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';

// =============== ТИПЫ ===============
type ID = string;

export type NodeType =
  | 'INPUT'
  | 'OUTPUT'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'LED'
  | 'COUNTER'
  | 'CLOCK'
  | 'DISPLAY'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  | 'DFF'
  | 'TFF'
  | 'MUX'
  | 'SEVEN_SEGMENT'
  | 'DECODER'
  | 'ENCODER'
  | 'SHIFT_REGISTER'
  | 'COMPARATOR';

export interface NodeDef {
  id: ID;
  type: NodeType;
  x: number;
  y: number;
  label?: string;
  inputs: Array<{ id: string | null }>;
  value?: boolean;
  values?: boolean[]; // Для многобитных элементов
  counter?: number;
  clockSpeed?: number;
  clockActive?: boolean;
  state?: boolean;
  select?: number;
  bits?: number; // Разрядность для счетчиков и регистров
  maxCount?: number; // Максимальное значение для счетчиков
  displayValue?: number; // Числовое значение для дисплеев
}

export interface Wire {
  id: ID;
  from: { nodeId: ID; slot: number };
  to: { nodeId: ID; slot: number };
}

// =============== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===============
const uid = (p = '') =>
  `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}${p}`;

function evaluateNode(node: NodeDef, inputsValues: boolean[]): boolean {
  switch (node.type) {
    case 'INPUT':
      return !!node.value;
    case 'OUTPUT':
    case 'LED':
      return !!inputsValues[0];
    case 'NOT':
      return !inputsValues[0];
    case 'AND':
      return inputsValues.every(Boolean);
    case 'OR':
      return inputsValues.some(Boolean);
    case 'NAND':
      return !inputsValues.every(Boolean);
    case 'NOR':
      return !inputsValues.some(Boolean);
    case 'XOR':
      return inputsValues.filter(Boolean).length === 1;
    case 'XNOR':
      return inputsValues.filter(Boolean).length !== 1;
    case 'COUNTER':
      return !!inputsValues[0];
    case 'CLOCK':
      return !!node.clockActive;
    case 'DFF':
      return !!node.state;
    case 'TFF':
      return !!node.state;
    case 'MUX':
      const selectIndex = node.select || 0;
      return inputsValues[selectIndex] || false;
    case 'DECODER':
      // 2-4 декодер: 2 входа, 4 выхода
      if (inputsValues.length >= 2) {
        const index = (inputsValues[0] ? 1 : 0) + (inputsValues[1] ? 2 : 0);
        return index === 0; // Активный низкий
      }
      return false;
    case 'ENCODER':
      // 4-2 энкодер
      const activeInput = inputsValues.findIndex(val => val);
      return activeInput >= 0;
    case 'COMPARATOR':
      // 2-битный компаратор
      if (inputsValues.length >= 4) {
        const A = (inputsValues[0] ? 1 : 0) + (inputsValues[1] ? 2 : 0);
        const B = (inputsValues[2] ? 1 : 0) + (inputsValues[3] ? 2 : 0);
        return A === B;
      }
      return false;
    default:
      return false;
  }
}

// Функция для преобразования двоичного числа в десятичное
function binaryToDecimal(bits: boolean[]): number {
  return bits.reduce((acc, bit, index) => acc + (bit ? Math.pow(2, bits.length - 1 - index) : 0), 0);
}

// =============== СОСТОЯНИЕ ===============
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
        defaultSlots = 3; // Clock, Reset, Enable
        initialValues = { 
          counter: 0, 
          bits: 4,
          maxCount: 15 
        };
        break;
      case 'CLOCK':
        defaultSlots = 0;
        initialValues = { clockSpeed: 1000, clockActive: false };
        break;
      case 'DISPLAY':
        defaultSlots = 4; // 4-битный вход
        initialValues = { displayValue: 0 };
        break;
      case 'SEVEN_SEGMENT':
        defaultSlots = 7; // a, b, c, d, e, f, g
        initialValues = { displayValue: 0 };
        break;
      case 'DFF':
      case 'TFF':
        defaultSlots = 2; // Data/Trigger, Clock
        initialValues = { state: false };
        break;
      case 'MUX':
        defaultSlots = 3; // 2 входа + 1 выбор
        initialValues = { select: 0 };
        break;
      case 'DECODER':
        defaultSlots = 2; // 2 входа для 2-4 декодера
        break;
      case 'ENCODER':
        defaultSlots = 4; // 4 входа для 4-2 энкодера
        break;
      case 'SHIFT_REGISTER':
        defaultSlots = 3; // Data, Clock, Reset
        initialValues = { bits: 4, values: Array(4).fill(false) };
        break;
      case 'COMPARATOR':
        defaultSlots = 4; // A1, A0, B1, B0 (2-битный компаратор)
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

    // Обработка специальных элементов
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
        node.displayValue = binaryToDecimal(inputBits) % 10; // Только цифры 0-9
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

    // Основная логика
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

    // Пост-обработка
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

// =============== КОМПОНЕНТЫ РЕНДЕРА ===============
const getNodeColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    INPUT: '#2563eb',
    OUTPUT: '#16a34a',
    AND: '#7c3aed',
    OR: '#7c3aed',
    NOT: '#7c3aed',
    NAND: '#7c3aed',
    NOR: '#7c3aed',
    XOR: '#7c3aed',
    XNOR: '#7c3aed',
    LED: '#ca8a04',
    CLOCK: '#ea580c',
    COUNTER: '#0891b2',
    DISPLAY: '#db2777',
    SEVEN_SEGMENT: '#dc2626',
    DFF: '#4f46e5',
    TFF: '#4f46e5',
    MUX: '#0d9488',
    DECODER: '#059669',
    ENCODER: '#65a30d',
    SHIFT_REGISTER: '#7c3aed',
    COMPARATOR: '#ea580c',
  };
  return colors[type] || '#6b7280';
};

const getActiveColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    INPUT: '#3b82f6',
    OUTPUT: '#22c55e',
    AND: '#8b5cf6',
    OR: '#8b5cf6',
    NOT: '#8b5cf6',
    NAND: '#8b5cf6',
    NOR: '#8b5cf6',
    XOR: '#8b5cf6',
    XNOR: '#8b5cf6',
    LED: '#eab308',
    CLOCK: '#f97316',
    COUNTER: '#06b6d4',
    DISPLAY: '#ec4899',
    SEVEN_SEGMENT: '#ef4444',
    DFF: '#6366f1',
    TFF: '#6366f1',
    MUX: '#14b8a6',
    DECODER: '#10b981',
    ENCODER: '#84cc16',
    SHIFT_REGISTER: '#8b5cf6',
    COMPARATOR: '#f97316',
  };
  return colors[type] || '#8b5cf6';
};

interface NodeViewProps {
  node: NodeDef;
  onPointerDown: (e: React.PointerEvent, id: ID) => void;
}

const NodeView: React.FC<NodeViewProps> = ({ node, onPointerDown }) => {
  const width = node.type === 'DISPLAY' || node.type === 'SEVEN_SEGMENT' ? 160 : 120;
  const height = node.type === 'DISPLAY' || node.type === 'SEVEN_SEGMENT' ? 80 : 60;
  const inputCount = node.inputs.length;
  const portY = (i: number) => -height / 2 + 15 + i * 15;

  const nodeColor = getNodeColor(node.type);
  const activeColor = getActiveColor(node.type);

  const toggleInputValue = useStore((s) => s.toggleInputValue);
  const toggleClock = useStore((s) => s.toggleClock);
  const removeNode = useStore((s) => s.removeNode);
  const startConnection = useStore((s) => s.startConnection);
  const completeConnection = useStore((s) => s.completeConnection);
  const resetCounter = useStore((s) => s.resetCounter);

  const renderCounter = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 20}
        width={width - 20}
        height={35}
        rx={6}
        fill="#111827"
        stroke="#6b7280"
      />
      <text
        x={0}
        y={-height / 2 + 35}
        fontSize={12}
        textAnchor="middle"
        fill="#f3f4f6"
        fontWeight="bold"
        fontFamily="monospace"
      >
        Count: {node.counter || 0}
      </text>
      <text
        x={0}
        y={-height / 2 + 50}
        fontSize={10}
        textAnchor="middle"
        fill="#9ca3af"
      >
        Max: {node.maxCount || 15}
      </text>
      <g
        onPointerDown={(e) => {
          e.stopPropagation();
          resetCounter(node.id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={-20}
          y={-height / 2 + 55}
          width={40}
          height={16}
          rx={4}
          fill="#ef4444"
          stroke="#dc2626"
        />
        <text
          x={0}
          y={-height / 2 + 66}
          fontSize={9}
          textAnchor="middle"
          fill="#fef2f2"
          fontWeight="bold"
        >
          RESET
        </text>
      </g>
    </g>
  );

  const renderDisplay = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 20}
        width={width - 20}
        height={45}
        rx={8}
        fill="#1e293b"
        stroke="#475569"
        strokeWidth={2}
      />
      <text
        x={0}
        y={-height / 2 + 45}
        fontSize={18}
        textAnchor="middle"
        fill="#fbbf24"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {node.displayValue || 0}
      </text>
      <text
        x={0}
        y={-height / 2 + 60}
        fontSize={10}
        textAnchor="middle"
        fill="#94a3b8"
      >
        BIN: {(node.displayValue || 0).toString(2).padStart(4, '0')}
      </text>
    </g>
  );

  const renderSevenSegment = () => {
    const segments = [
      { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 }, // 0
      { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 }, // 1
      { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 }, // 2
      { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 }, // 3
      { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 }, // 4
      { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 }, // 5
      { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 }, // 6
      { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 }, // 7
      { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 }, // 8
      { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 }, // 9
    ];

    const activeSegments = segments[node.displayValue || 0] || segments[0];

    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect
          x={-width / 2 + 15}
          y={-height / 2 + 20}
          width={width - 30}
          height={45}
          rx={6}
          fill="#1e293b"
          stroke="#475569"
        />
        {/* Сегменты 7-сегментного индикатора */}
        {/* Сегмент A (верхний) */}
        <rect
          x={-width / 2 + 30}
          y={-height / 2 + 25}
          width={30}
          height={5}
          rx={2}
          fill={activeSegments.a ? '#fbbf24' : '#374151'}
        />
        {/* Сегмент B (правый верхний) */}
        <rect
          x={-width / 2 + 60}
          y={-height / 2 + 30}
          width={5}
          height={15}
          rx={2}
          fill={activeSegments.b ? '#fbbf24' : '#374151'}
        />
        {/* Сегмент C (правый нижний) */}
        <rect
          x={-width / 2 + 60}
          y={-height / 2 + 50}
          width={5}
          height={15}
          rx={2}
          fill={activeSegments.c ? '#fbbf24' : '#374151'}
        />
        {/* Сегмент D (нижний) */}
        <rect
          x={-width / 2 + 30}
          y={-height / 2 + 65}
          width={30}
          height={5}
          rx={2}
          fill={activeSegments.d ? '#fbbf24' : '#374151'}
        />
        {/* Сегмент E (левый нижний) */}
        <rect
          x={-width / 2 + 25}
          y={-height / 2 + 50}
          width={5}
          height={15}
          rx={2}
          fill={activeSegments.e ? '#fbbf24' : '#374151'}
        />
        {/* Сегмент F (левый верхний) */}
        <rect
          x={-width / 2 + 25}
          y={-height / 2 + 30}
          width={5}
          height={15}
          rx={2}
          fill={activeSegments.f ? '#fbbf24' : '#374151'}
        />
        {/* Сегмент G (средний) */}
        <rect
          x={-width / 2 + 30}
          y={-height / 2 + 45}
          width={30}
          height={5}
          rx={2}
          fill={activeSegments.g ? '#fbbf24' : '#374151'}
        />
      </g>
    );
  };

  const renderShiftRegister = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 20}
        width={width - 20}
        height={35}
        rx={6}
        fill="#111827"
        stroke="#6b7280"
      />
      <text
        x={0}
        y={-height / 2 + 35}
        fontSize={10}
        textAnchor="middle"
        fill="#f3f4f6"
        fontWeight="bold"
      >
        Shift Reg
      </text>
      <text
        x={0}
        y={-height / 2 + 48}
        fontSize={9}
        textAnchor="middle"
        fill="#9ca3af"
        fontFamily="monospace"
      >
        {node.values?.map(v => v ? '1' : '0').join('') || '0000'}
      </text>
    </g>
  );

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      className="node"
      onPointerDown={(e) => onPointerDown(e, node.id)}
    >
      {/* Основной прямоугольник узла */}
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={12}
        ry={12}
        fill="#1f2937"
        stroke={node.value ? activeColor : nodeColor}
        strokeWidth={2}
        filter={node.value ? 'url(#glow)' : 'none'}
        style={{ cursor: 'move' }}
      />
      
      <text
        x={0}
        y={-height / 2 + 14}
        fontSize={node.type === 'DISPLAY' ? 10 : 11}
        fontFamily="Inter, sans-serif"
        fill="#f3f4f6"
        textAnchor="middle"
        fontWeight="500"
        style={{ pointerEvents: 'none' }}
      >
        {node.label ?? node.type}
      </text>

      {/* Входные порты */}
      {Array.from({ length: inputCount }).map((_, idx) => (
        <circle
          key={idx}
          cx={-width / 2}
          cy={portY(idx)}
          r={5}
          fill="#374151"
          stroke="#6b7280"
          strokeWidth={1}
          style={{ cursor: 'crosshair' }}
          onPointerDown={(e) => {
            e.stopPropagation();
            completeConnection(node.id, idx);
          }}
        />
      ))}

      {/* Выходной порт */}
      <circle
        cx={width / 2}
        cy={0}
        r={7}
        fill={node.value ? activeColor : '#374151'}
        stroke={node.value ? activeColor : '#6b7280'}
        strokeWidth={1}
        style={{ cursor: 'crosshair' }}
        onPointerDown={(e) => {
          e.stopPropagation();
          startConnection(node.id, 0);
        }}
      />

      {/* Специальные элементы */}
      {node.type === 'INPUT' && (
        <g
          onPointerDown={(e) => {
            e.stopPropagation();
            toggleInputValue(node.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x={-width / 2 + 10}
            y={-height / 2 + 25}
            width={40}
            height={20}
            rx={6}
            fill={node.value ? activeColor : '#374151'}
            stroke={node.value ? activeColor : '#6b7280'}
          />
          <text
            x={-width / 2 + 30}
            y={-height / 2 + 38}
            fontSize={10}
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {node.value ? 'ON' : 'OFF'}
          </text>
        </g>
      )}

      {node.type === 'CLOCK' && (
        <g
          onPointerDown={(e) => {
            e.stopPropagation();
            toggleClock(node.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x={-width / 2 + 10}
            y={-height / 2 + 25}
            width={40}
            height={20}
            rx={6}
            fill={node.clockActive ? activeColor : '#374151'}
            stroke={node.clockActive ? activeColor : '#6b7280'}
          />
          <text
            x={-width / 2 + 30}
            y={-height / 2 + 38}
            fontSize={9}
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {node.clockActive ? 'RUN' : 'STOP'}
          </text>
        </g>
      )}

      {node.type === 'LED' && (
        <circle
          cx={0}
          cy={5}
          r={12}
          fill={node.value ? '#fef08a' : '#4b5563'}
          stroke={node.value ? '#fef08a' : '#6b7280'}
          strokeWidth={2}
          filter={node.value ? 'url(#ledGlow)' : 'none'}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {node.type === 'COUNTER' && renderCounter()}
      {node.type === 'DISPLAY' && renderDisplay()}
      {node.type === 'SEVEN_SEGMENT' && renderSevenSegment()}
      {node.type === 'SHIFT_REGISTER' && renderShiftRegister()}

      {/* Отображение для простых элементов */}
      {['DFF', 'TFF', 'MUX'].includes(node.type) && (
        <g style={{ pointerEvents: 'none' }}>
          <rect
            x={-width / 2 + 10}
            y={-height / 2 + 25}
            width={40}
            height={20}
            rx={6}
            fill="#111827"
            stroke="#6b7280"
          />
          <text
            x={-width / 2 + 30}
            y={-height / 2 + 38}
            fontSize={10}
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            {node.type === 'MUX' ? `S:${node.select || 0}` : node.state ? '1' : '0'}
          </text>
        </g>
      )}

      {/* Кнопка удаления */}
      <g
        transform={`translate(${width / 2 - 15}, ${-height / 2 + 15})`}
        onPointerDown={(e) => {
          e.stopPropagation();
          removeNode(node.id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <circle r={8} fill="#ef4444" stroke="#dc2626" />
        <text 
          x={0} 
          y={3} 
          fontSize={10} 
          textAnchor="middle" 
          fill="#fef2f2" 
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          ×
        </text>
      </g>
    </g>
  );
};

const wirePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const dx = Math.abs(to.x - from.x);
  const hx = Math.max(20, dx / 2);
  return `M ${from.x} ${from.y} C ${from.x + hx} ${from.y} ${to.x - hx} ${to.y} ${to.x} ${to.y}`;
};

interface WireViewProps {
  wire: Wire;
  nodes: Record<ID, NodeDef>;
  removeWire: (id: ID) => void;
}

const WireView: React.FC<WireViewProps> = ({ wire, nodes, removeWire }) => {
  const fromNode = nodes[wire.from.nodeId];
  const toNode = nodes[wire.to.nodeId];
  if (!fromNode || !toNode) return null;

  const from = { x: fromNode.x + 60, y: fromNode.y };
  const to = {
    x: toNode.x - 60,
    y: toNode.y + (-30 + wire.to.slot * 15),
  };

  return (
    <path
      d={wirePath(from, to)}
      stroke={fromNode.value ? '#60a5fa' : '#4b5563'}
      strokeWidth={fromNode.value ? 3 : 2}
      fill="none"
      style={{ cursor: 'pointer' }}
      onPointerDown={(e) => {
        e.stopPropagation();
        removeWire(wire.id);
      }}
    />
  );
};

interface PreviewWireProps {
  preview: { x: number; y: number } | null;
  connectionInProgress: { fromNodeId: ID; fromSlot: number } | null;
  nodes: Record<ID, NodeDef>;
}

const PreviewWire: React.FC<PreviewWireProps> = ({
  preview,
  connectionInProgress,
  nodes,
}) => {
  if (!connectionInProgress || !preview) return null;
  const fromNode = nodes[connectionInProgress.fromNodeId];
  if (!fromNode) return null;
  const from = { x: fromNode.x + 60, y: fromNode.y };
  return (
    <path
      d={wirePath(from, preview)}
      stroke="#9ca3af"
      strokeDasharray="6 6"
      strokeWidth={2}
      fill="none"
    />
  );
};

const Palette: React.FC<{ addNode: (type: NodeType) => void }> = ({ addNode }) => {
  const nodeTypes: { type: NodeType; label: string; category: string }[] = [
    { type: 'INPUT', label: 'Input', category: 'Basic' },
    { type: 'OUTPUT', label: 'Output', category: 'Basic' },
    { type: 'LED', label: 'LED', category: 'Basic' },
    { type: 'CLOCK', label: 'Clock', category: 'Basic' },
    
    { type: 'AND', label: 'AND', category: 'Gates' },
    { type: 'OR', label: 'OR', category: 'Gates' },
    { type: 'NOT', label: 'NOT', category: 'Gates' },
    { type: 'NAND', label: 'NAND', category: 'Gates' },
    { type: 'NOR', label: 'NOR', category: 'Gates' },
    { type: 'XOR', label: 'XOR', category: 'Gates' },
    { type: 'XNOR', label: 'XNOR', category: 'Gates' },
    
    { type: 'DFF', label: 'D-FF', category: 'Sequential' },
    { type: 'TFF', label: 'T-FF', category: 'Sequential' },
    { type: 'COUNTER', label: 'Counter', category: 'Sequential' },
    { type: 'SHIFT_REGISTER', label: 'Shift Reg', category: 'Sequential' },
    
    { type: 'MUX', label: 'MUX', category: 'MSI' },
    { type: 'DECODER', label: 'Decoder', category: 'MSI' },
    { type: 'ENCODER', label: 'Encoder', category: 'MSI' },
    { type: 'COMPARATOR', label: 'Comparator', category: 'MSI' },
    
    { type: 'DISPLAY', label: 'Display', category: 'Output' },
    { type: 'SEVEN_SEGMENT', label: '7-Segment', category: 'Output' },
  ];

  const categories = Array.from(new Set(nodeTypes.map(n => n.category)));

  return (
    <div className="flex flex-col gap-2">
      {categories.map(category => (
        <div key={category} className="flex flex-wrap gap-1">
          <div className="w-full text-xs text-gray-400 mb-1">{category}:</div>
          {nodeTypes
            .filter(n => n.category === category)
            .map(({ type, label }) => (
              <button
                key={type}
                className="bg-gray-700 text-white rounded px-2 py-1 text-xs hover:bg-gray-600 transition-colors border border-gray-600"
                onClick={() => addNode(type)}
              >
                {label}
              </button>
            ))}
        </div>
      ))}
    </div>
  );
};

// =============== ОСНОВНОЙ КОМПОНЕНТ ===============
interface CircuitSandboxProps {
  starterCircuit?: { nodes: Record<string, NodeDef>; wires: Record<string, Wire> };
  onCircuitSubmit?: (circuit: { nodes: Record<string, NodeDef>; wires: Record<string, Wire> }) => void;
  submitting?: boolean;
}

export default function CircuitSandbox({
  starterCircuit,
  onCircuitSubmit,
  submitting = false,
}: CircuitSandboxProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const nodes = useStore((s) => s.nodes);
  const wires = useStore((s) => s.wires);
  const addNode = useStore((s) => s.addNode);
  const updateNodePos = useStore((s) => s.updateNodePos);
  const startConnection = useStore((s) => s.startConnection);
  const completeConnection = useStore((s) => s.completeConnection);
  const cancelConnection = useStore((s) => s.cancelConnection);
  const connectionInProgress = useStore((s) => s.connectionInProgress);
  const runSimulation = useStore((s) => s.runSimulation);
  const exportCircuit = useStore((s) => s.exportCircuit);
  const importCircuit = useStore((s) => s.importCircuit);
  const clear = useStore((s) => s.clear);
  const removeWire = useStore((s) => s.removeWire);

  const nodeDragRef = useRef<{
    id: ID | null;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  }>({ id: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  const panRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });

  // Загрузка начальной схемы
  useEffect(() => {
    if (starterCircuit) {
      importCircuit(starterCircuit);
    } else {
      clear();
    }
  }, [starterCircuit, importCircuit, clear]);

  // Автосимуляция для CLOCK
  useEffect(() => {
    const clockNodes = Object.values(nodes).filter(
      (node) => node.type === 'CLOCK' && node.clockActive
    );
    if (clockNodes.length === 0) return;
    const interval = setInterval(() => runSimulation(), 500);
    return () => clearInterval(interval);
  }, [nodes, runSimulation]);

  const screenToWorld = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as SVGElement;
    
    // Если клик на узел (основной прямоугольник), начинаем перетаскивание
    if (target.closest('.node') && target.tagName === 'rect') {
      const nodeElement = target.closest('.node') as SVGGElement;
      const transform = nodeElement.getAttribute('transform');
      if (!transform) return;
      
      const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (!match) return;
      
      const nodeId = Array.from(nodeElement.children)
        .find(child => child.getAttribute('data-node-id'))
        ?.getAttribute('data-node-id');
      
      if (!nodeId || !nodes[nodeId]) return;

      const world = screenToWorld(e.clientX, e.clientY);
      nodeDragRef.current = {
        id: nodeId,
        startX: world.x,
        startY: world.y,
        offsetX: nodes[nodeId].x,
        offsetY: nodes[nodeId].y,
      };
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    // Если клик на провод
    if (target.tagName === 'path' && target.getAttribute('stroke') !== null) {
      const wireId = target.getAttribute('data-wire-id');
      if (wireId) {
        e.stopPropagation();
        removeWire(wireId);
      }
      return;
    }

    // Иначе начинаем панорамирование
    panRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (nodeDragRef.current.id && isDragging) {
      // Перетаскивание узла
      const world = screenToWorld(e.clientX, e.clientY);
      const dx = world.x - nodeDragRef.current.startX;
      const dy = world.y - nodeDragRef.current.startY;
      
      updateNodePos(
        nodeDragRef.current.id,
        nodeDragRef.current.offsetX + dx,
        nodeDragRef.current.offsetY + dy
      );
    } else if (panRef.current.dragging) {
      // Панорамирование
      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;
      panRef.current.lastX = e.clientX;
      panRef.current.lastY = e.clientY;
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    }

    // Превью соединения
    if (connectionInProgress) {
      const world = screenToWorld(e.clientX, e.clientY);
      setPreview(world);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    panRef.current.dragging = false;
    nodeDragRef.current.id = null;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    setScale((s) => Math.max(0.2, Math.min(4, s * factor)));
  };

  const handleNodePointerDown = (e: React.PointerEvent, nodeId: ID) => {
    e.stopPropagation();
    const world = screenToWorld(e.clientX, e.clientY);
    const node = nodes[nodeId];
    nodeDragRef.current = {
      id: nodeId,
      startX: world.x,
      startY: world.y,
      offsetX: node.x,
      offsetY: node.y,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleExport = () => {
    const circuit = exportCircuit();
    const blob = new Blob([JSON.stringify(circuit, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (onCircuitSubmit) {
      onCircuitSubmit(exportCircuit());
    }
  };

  return (
    <div className="w-full h-[720px] border border-gray-700 rounded-lg overflow-hidden flex flex-col bg-gray-900">
      {/* Панель инструментов */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Palette 
            addNode={(type) => {
              const world = screenToWorld(200, 150);
              addNode({ type, x: world.x, y: world.y });
            }} 
          />
          <button
            className="bg-green-600 text-white rounded px-4 py-2 text-sm hover:bg-green-700 transition-colors border border-green-500"
            onClick={runSimulation}
          >
            ▶ Run Simulation
          </button>
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700 transition-colors border border-blue-500"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(exportCircuit(), null, 2));
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
          {onCircuitSubmit && (
            <button
              className={`${
                submitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white rounded px-4 py-2 text-sm transition-colors border border-indigo-500`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Отправка...' : 'Проверить решение'}
            </button>
          )}
        </div>
        <div className="text-sm text-gray-300 font-mono">
          Zoom: {scale.toFixed(2)} | Nodes: {Object.keys(nodes).length} | Wires: {Object.keys(wires).length}
        </div>
      </div>

      {/* Холст */}
      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          className="w-full h-full bg-gray-900 cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="glow"
              />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
                result="glow"
              />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
            {/* Сетка */}
            <g>
              {Array.from({ length: 40 }).map((_, i) => (
                <React.Fragment key={`v_${i}`}>
                  <line
                    x1={i * 50}
                    y1={0}
                    x2={i * 50}
                    y2={4000}
                    stroke="#374151"
                    strokeWidth={1}
                  />
                  <line
                    x1={0}
                    y1={i * 50}
                    x2={4000}
                    y2={i * 50}
                    stroke="#374151"
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}
            </g>

            {/* Провода */}
            <g>
              {Object.values(wires).map((w) => (
                <WireView
                  key={w.id}
                  wire={w}
                  nodes={nodes}
                  removeWire={removeWire}
                />
              ))}
            </g>

            {/* Временный провод */}
            <g>
              <PreviewWire
                preview={preview}
                connectionInProgress={connectionInProgress}
                nodes={nodes}
              />
            </g>

            {/* Узлы */}
            <g>
              {Object.values(nodes).map((n) => (
                <NodeView 
                  key={n.id} 
                  node={n} 
                  onPointerDown={handleNodePointerDown}
                />
              ))}
            </g>
          </g>
        </svg>

        {/* Контролы масштаба */}
        <div className="absolute right-3 bottom-3 bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-xl">
          <div className="flex flex-col gap-1 text-xs">
            <button
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              onClick={() => setScale((s) => Math.min(4, s * 1.2))}
            >
              Zoom +
            </button>
            <button
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              onClick={() => setScale((s) => Math.max(0.2, s / 1.2))}
            >
              Zoom -
            </button>
            <button
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              onClick={() => {
                setOffset({ x: 0, y: 0 });
                setScale(1);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}