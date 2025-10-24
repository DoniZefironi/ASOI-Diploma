// src/features/circuit/components/PreviewWire.tsx
'use client';

import React from 'react';
import { useCircuitStore } from '../hooks/useCircuitStore';

interface PreviewWireProps {
  preview: { x: number; y: number } | null;
}

const PreviewWire: React.FC<PreviewWireProps> = ({ preview }) => {
  const connectionInProgress = useCircuitStore((s) => s.connectionInProgress);
  const nodes = useCircuitStore((s) => s.nodes);

  if (!connectionInProgress || !preview) return null;
  const fromNode = nodes[connectionInProgress.fromNodeId];
  if (!fromNode) return null;

  const wirePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = Math.abs(to.x - from.x);
    const hx = Math.max(20, dx / 2);
    return `M ${from.x} ${from.y} C ${from.x + hx} ${from.y} ${to.x - hx} ${to.y} ${to.x} ${to.y}`;
  };

  const from = { x: fromNode.x + 60, y: fromNode.y + 0 };
  const to = { x: preview.x, y: preview.y };

  // Возвращаем <path> напрямую. Если этот компонент используется в списке, ему нужен ключ.
  // Но в CircuitCanvas он рендерится как одиночный элемент внутри <g>, ключ не нужен.
  return (
    <path 
      d={wirePath(from, to)} 
      stroke="#9ca3af" 
      strokeDasharray="6 6" 
      strokeWidth={2} 
      fill="none" 
    />
  );
};

export default PreviewWire;