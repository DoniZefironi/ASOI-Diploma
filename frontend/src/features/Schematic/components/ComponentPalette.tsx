'use client';
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ComponentType } from '../types';
import { PALETTE_CATEGORIES, getComponentDef } from '../engine/componentDefs';
import { useSchematicStore } from '../store/useSchematicStore';

function DraggableItem({ type }: { type: ComponentType }) {
  const def = getComponentDef(type);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  const ICONS: Partial<Record<ComponentType, string>> = {
    'esp32': '🔷', 'arduino-uno': '🟦',
    'dht22': '🌡️', 'mq2': '💨', 'ldr': '☀️', 'hcsr04': '📡',
    'led-red': '🔴', 'led-green': '🟢', 'led-blue': '🔵', 'led-yellow': '🟡',
    'buzzer': '🔔', 'relay': '⚡', 'servo': '⚙️',
    'lcd-16x2': '📺',
    'button': '🔲', 'potentiometer': '🎛️', 'resistor': '〰️',
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 cursor-grab active:cursor-grabbing transition-colors select-none"
      title={def.description}
    >
      <span className="text-base shrink-0">{ICONS[type] ?? '📦'}</span>
      <span className="text-xs text-gray-200 leading-tight">{def.label}</span>
    </div>
  );
}

export function ComponentPalette() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const loadTemplate = useSchematicStore(s => s.loadTemplate);

  const toggle = (label: string) =>
    setCollapsed(c => ({ ...c, [label]: !c[label] }));

  return (
    <div className="w-52 bg-gray-950 border-r border-gray-800 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-sm font-bold text-white">Компоненты</h2>
        <p className="text-xs text-gray-500 mt-0.5">Перетащите на схему</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {PALETTE_CATEGORIES.map(cat => (
          <div key={cat.label}>
            <button
              onClick={() => toggle(cat.label)}
              className="w-full flex items-center gap-1.5 px-1 py-1 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors uppercase tracking-wide"
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="ml-auto">{collapsed[cat.label] ? '›' : '⌄'}</span>
            </button>
            {!collapsed[cat.label] && (
              <div className="space-y-1 mt-1">
                {cat.types.map(type => (
                  <div key={type} className="group relative">
                    <DraggableItem type={type} />
                    {getComponentDef(type).defaultCode && (
                      <button
                        onClick={() => loadTemplate(type)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-xs text-blue-400 hover:text-blue-300 px-1 transition-opacity"
                        title="Загрузить пример кода"
                      >
                        {'</>'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
