'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSchematicStore } from '../store/useSchematicStore';
import { Component } from '../types';

interface DraggableComponentProps {
  component: Component;
  children: React.ReactNode;
}

export function DraggableComponent({ component, children }: DraggableComponentProps) {
  // Arduino Uno нельзя двигать
  const isDraggable = component.type !== 'arduino-un';

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `component-${component.id}`,
    data: { type: 'component', id: component.id }, // ✅ Исправлено
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: 'none', // улучшает поведение на тач-устройствах
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDraggable ? { ...listeners, ...attributes } : {})}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  );
}