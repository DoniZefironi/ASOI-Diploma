'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Component } from '../types';

interface DraggableComponentProps {
  component: Component;
  children: React.ReactNode;
}

export function DraggableComponent({ component, children }: DraggableComponentProps) {
  const isDraggable = component.type !== 'arduino-un';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${component.id}`,
    data: { 
      type: 'component',
      componentId: component.id // ✅ Добавляем ID компонента
    },
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1000 : 1, // ✅ Только z-index при перетаскивании
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? { ...listeners, ...attributes } : {})}
      className={`${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${
        isDragging ? 'shadow-2xl' : ''
      }`}
    >
      {children}
    </div>
  );
}