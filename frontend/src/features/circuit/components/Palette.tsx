import React from 'react';
import { NodeType } from '../types/circuit.types';
import { useCircuitStore } from '../store/circuit.store';

interface PaletteProps {
  addNode: (type: NodeType) => void;
}

export const Palette: React.FC<PaletteProps> = ({ addNode }) => {
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
    <div className="flex flex-row gap-2">
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