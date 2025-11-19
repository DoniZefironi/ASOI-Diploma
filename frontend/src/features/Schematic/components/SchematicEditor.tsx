'use client';

import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { ComponentPalette } from './ComponentPalette';
import { Workspace } from './Workspace';
import { useSchematicStore } from '../store/useSchematicStore';

export function SchematicEditor() {
  const { addComponent, updateComponentPosition } = useSchematicStore();

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Если перетаскиваем из палитры
    if (active.id.toString().startsWith('palette-') && over?.id === 'workspace') {
      const itemType = active.data.current?.itemType;
      if (itemType) {
        const rect = over.rect;
        addComponent(itemType, rect.left, rect.top);
      }
    }

    // Если перетаскиваем существующий компонент
    if (active.id.toString().startsWith('component-') && over?.id === 'workspace') {
      const componentId = active.id.toString().replace('component-', '');
      const newX = active.rect.current.translated?.left || 0;
      const newY = active.rect.current.translated?.top || 0;
      updateComponentPosition(componentId, newX, newY);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <ComponentPalette />
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Workspace />
      </DndContext>
    </div>
  );
}