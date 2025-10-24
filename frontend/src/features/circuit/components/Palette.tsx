'use client';

import React from 'react';
import { useCircuitStore } from '../hooks/useCircuitStore';
import { NodeDef, NodeType } from '../types'

interface NodeTypeInfo {
  type: NodeType;
  label: string;
  color: string;
}

const Palette: React.FC = () => {
  const addNode = useCircuitStore((s) => s.addNode);

  const nodeTypes: NodeTypeInfo[] = [
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

  const handleAdd = (type: NodeType) => {
    addNode({ type, x: 200 + Math.random() * 200, y: 100 + Math.random() * 200 });
  };

  const handleClear = () => {
    useCircuitStore.getState().clear();
  };

  return (
    <div className="p-2 flex gap-2 flex-wrap">
      {nodeTypes.map(({ type, label, color }) => (
        <button 
          key={type} 
          className={`${color} text-white rounded px-3 py-2 text-sm hover:opacity-80 transition-opacity border border-gray-600`}
          onClick={() => handleAdd(type)}
        >
          {label}
        </button>
      ))}
      <button 
        className="bg-red-600 text-white rounded px-3 py-2 text-sm hover:opacity-80 transition-opacity border border-gray-600" 
        onClick={handleClear}
      >
        Clear All
      </button>
    </div>
  );
};

export default Palette;