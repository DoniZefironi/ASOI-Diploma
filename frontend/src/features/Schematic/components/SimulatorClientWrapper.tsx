'use client';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { ComponentPalette } from './ComponentPalette';
import { Workspace } from './Workspace';
import { CodeEditor } from './CodeEditor';
import { ControlPanel } from './ControlPanel';
import { useSchematicStore } from '../store/useSchematicStore';
import { ComponentType } from '../types';

export function SimulatorClientWrapper() {
  const addComponent = useSchematicStore((state) => state.addComponent);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id === 'workspace' && active.data.current?.type) {
      const type = active.data.current.type as ComponentType;
      if (type !== 'arduino-un') {
        addComponent(type, 400, 300);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gray-950">
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