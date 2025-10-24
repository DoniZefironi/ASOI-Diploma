// src/features/circuit/components/WireView.tsx
'use client';

import React from 'react';
import { Wire, NodeDef, ID } from '../types';
import { useCircuitStore } from '../hooks/useCircuitStore';

interface WireViewProps {
  wire: Wire;
}

const WireView: React.FC<WireViewProps> = ({ wire }) => {
  const nodes = useCircuitStore((s) => s.nodes);
  const removeWire = useCircuitStore((s) => s.removeWire);

  const fromNode = nodes[wire.from.nodeId];
  const toNode = nodes[wire.to.nodeId];
  if (!fromNode || !toNode) return null; // Важно: возвращаем null, а не undefined

  // Adjust wire connections based on node type
  let fromX, fromY, toX, toY;
  
  if (fromNode.type === 'DFF' || fromNode.type === 'TFF' || fromNode.type === 'MUX') {
    fromX = fromNode.x + 60;
    fromY = fromNode.y + 0;
  } else {
    fromX = fromNode.x + 60;
    fromY = fromNode.y + 0;
  }
  
  if (toNode.type === 'DFF' || toNode.type === 'TFF' || toNode.type === 'MUX') {
    toX = toNode.x - 60;
    toY = toNode.y + (-25 + wire.to.slot * 20);
  } else {
    toX = toNode.x - 60;
    toY = toNode.y + (-30 + wire.to.slot * 15);
  }

  const wirePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = Math.abs(to.x - from.x);
    const hx = Math.max(20, dx / 2);
    return `M ${from.x} ${from.y} C ${from.x + hx} ${from.y} ${to.x - hx} ${to.y} ${to.x} ${to.y}`;
  };

  // Возвращаем <g> с <path> внутри. Ключ должен быть у <g>, что и есть.
  return (
    <g>
      <path 
        d={wirePath({x: fromX, y: fromY}, {x: toX, y: toY})} 
        stroke={fromNode.value ? '#60a5fa' : '#4b5563'} 
        strokeWidth={fromNode.value ? 3 : 2}
        fill="none" 
        onClick={(e) => { 
          e.stopPropagation(); 
          removeWire(wire.id); 
        }} 
      />
    </g>
  );
};

export default WireView;