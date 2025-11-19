'use client';

import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { useSchematicStore } from '@/features/Schematic/store/useSchematicStore';
import { ComponentPalette } from '@/features/Schematic/components/ComponentPalette';
import { Workspace } from '@/features/Schematic/components/Workspace';
import { CodeEditor } from '@/features/Schematic/components/CodeEditor';
import { ControlPanel } from '@/features/Schematic/components/ControlPanel';

export default function SimulatorPage() {
  const { addComponent, updateComponentPosition } = useSchematicStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('DRAG END:', { 
      active: active.id, 
      over: over?.id,
      data: active.data.current 
    });

    // Добавление из палитры
    if (active.id.toString().startsWith('palette-') && over?.id === 'workspace') {
      const type = active.data.current?.type;
      console.log('Adding component:', type);
      
      if (type && type !== 'arduino-un') {
        addComponent(type, over.rect.left, over.rect.top);
      }
    }

    // Перемещение существующего компонента
    if (active.id.toString().startsWith('component-') && over?.id === 'workspace') {
      const componentId = active.data.current?.componentId;
      console.log('Moving component:', componentId);
      
      if (componentId) {
        const newX = active.rect.current.translated?.left || 0;
        const newY = active.rect.current.translated?.top || 0;
        updateComponentPosition(componentId, newX, newY);
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