import React from 'react';
import { NodeType } from '../types/circuit.types';
import { useCircuitStore } from '../store/circuit.store';

interface PaletteProps {
  addNode: (type: NodeType) => void;
}

export const Palette: React.FC<PaletteProps> = ({ addNode }) => {
  const nodeTypes: { type: NodeType; label: string; category: string }[] = [
    { type: 'INPUT', label: 'Вход', category: 'Базовые' },
    { type: 'OUTPUT', label: 'Выход', category: 'Базовые' },
    { type: 'LED', label: 'Светодиод', category: 'Базовые' },
    { type: 'CLOCK', label: 'Тактовый', category: 'Базовые' },
    { type: 'AND', label: 'И', category: 'Логические' },
    { type: 'OR', label: 'ИЛИ', category: 'Логические' },
    { type: 'NOT', label: 'НЕ', category: 'Логические' },
    { type: 'NAND', label: 'И-НЕ', category: 'Логические' },
    { type: 'NOR', label: 'ИЛИ-НЕ', category: 'Логические' },
    { type: 'XOR', label: 'XOR', category: 'Логические' },
    { type: 'XNOR', label: 'XNOR', category: 'Логические' },
    { type: 'DFF', label: 'D-триггер', category: 'Последов.' },
    { type: 'TFF', label: 'T-триггер', category: 'Последов.' },
    { type: 'COUNTER', label: 'Счётчик', category: 'Последов.' },
    { type: 'SHIFT_REGISTER', label: 'Сдвиг. регистр', category: 'Последов.' },
    { type: 'MUX', label: 'MUX', category: 'MSI' },
    { type: 'DECODER', label: 'Декодер', category: 'MSI' },
    { type: 'ENCODER', label: 'Кодер', category: 'MSI' },
    { type: 'COMPARATOR', label: 'Компаратор', category: 'MSI' },
    { type: 'DISPLAY', label: 'Дисплей', category: 'Выходные' },
    { type: 'SEVEN_SEGMENT', label: '7-сегмент', category: 'Выходные' },
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