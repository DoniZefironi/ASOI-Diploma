import React from 'react';
import { Wire, NodeDef, ID } from '../types/circuit.types';
import { useCircuitStore } from '../store/circuit.store';

const wirePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const dx = Math.abs(to.x - from.x);
  const hx = Math.max(20, dx / 2);
  return `M ${from.x} ${from.y} C ${from.x + hx} ${from.y} ${to.x - hx} ${to.y} ${to.x} ${to.y}`;
};

interface WireViewProps {
  wire: Wire;
  nodes: Record<ID, NodeDef>;
  removeWire: (id: ID) => void;
  nodePositions: { [id: string]: { width: number; height: number; inputCount: number } };
}

export const WireView: React.FC<WireViewProps> = ({ wire, nodes, removeWire, nodePositions }) => {
  const fromNode = nodes[wire.from.nodeId];
  const toNode = nodes[wire.to.nodeId];
  if (!fromNode || !toNode) return null;

  const fromNodeInfo = nodePositions[wire.from.nodeId];
  const toNodeInfo = nodePositions[wire.to.nodeId];
  if (!fromNodeInfo || !toNodeInfo) return null;

  const inputPortY = (slot: number, count: number) => -toNodeInfo.height / 2 + (slot + 1) * (toNodeInfo.height / (count + 1));

  const from = { x: fromNode.x + fromNodeInfo.width / 2, y: fromNode.y };
  const to = {
    x: toNode.x - toNodeInfo.width / 2,
    y: toNode.y + inputPortY(wire.to.slot, toNodeInfo.inputCount),
  };

  return (
    <path
      d={wirePath(from, to)}
      stroke={fromNode.value ? '#60a5fa' : '#4b5563'}
      strokeWidth={fromNode.value ? 3 : 2}
      fill="none"
      style={{ cursor: 'pointer' }}
      onPointerDown={(e) => {
        e.stopPropagation();
        removeWire(wire.id);
      }}
    />
  );
};