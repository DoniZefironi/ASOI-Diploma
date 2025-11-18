'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ComponentType } from '../types';

const ITEMS: { type: ComponentType; label: string }[] = [
  { type: 'led', label: 'LED' },
  { type: 'button', label: 'Button' },
  { type: 'resistor', label: 'Resistor' },
];

export function ComponentPalette() {
  return (
    <div className="w-48 p-4 bg-gray-950 border-r">
      <h3 className="font-bold mb-3 text-white">Components</h3>
      <div className="space-y-2">
        {ITEMS.map((item) => (
          <DraggableItem key={item.type} type={item.type} label={item.label} />
        ))}
      </div>
    </div>
  );
}

function DraggableItem({ type, label }: { type: ComponentType; label: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `comp-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className="p-2 bg-gray-800 border border-gray-700 rounded cursor-move text-white"
    >
      {label}
    </div>
  );
}