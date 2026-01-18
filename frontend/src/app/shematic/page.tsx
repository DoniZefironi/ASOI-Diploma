// src/app/shematic/page.tsx
'use client';

import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useSchematicStore } from '@/features/Schematic/store/useSchematicStore';
import { ComponentPalette } from '@/features/Schematic/components/ComponentPalette';
import { Workspace } from '@/features/Schematic/components/Workspace';
import { CodeEditor } from '@/features/Schematic/components/CodeEditor';
import { ControlPanel } from '@/features/Schematic/components/ControlPanel';

export default function SimulatorPage() {
  const addComponent = useSchematicStore((state) => state.addComponent);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id === 'workspace') {
      const type = active.data.current?.type;
      if (typeof type === 'string' && type !== 'arduino-un') {
        addComponent(type as any, 400, 300);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <div className="flex flex-1 overflow-hidden">
          <ComponentPalette />
          <Workspace />
        </div>
        <CodeEditor />
        <ControlPanel />
      </div>
    </DndContext>
  );
}