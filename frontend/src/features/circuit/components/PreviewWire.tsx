import React from 'react';
import { ID, NodeDef, Wire } from '../types/circuit.types';

const wirePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const dx = Math.abs(to.x - from.x);
  const hx = Math.max(20, dx / 2);
  return `M ${from.x} ${from.y} C ${from.x + hx} ${from.y} ${to.x - hx} ${to.y} ${to.x} ${to.y}`;
};

interface PreviewWireProps {
  preview: { x: number; y: number } | null;
  connectionInProgress: { fromNodeId: ID; fromSlot: number } | null;
  nodes: Record<ID, NodeDef>;
  nodePositions: { [id: string]: { width: number; height: number; inputCount: number } };
}

export const PreviewWire: React.FC<PreviewWireProps> = ({
  preview,
  connectionInProgress,
  nodes,
  nodePositions,
}) => {
  if (!connectionInProgress || !preview) return null;
  const fromNode = nodes[connectionInProgress.fromNodeId];
  if (!fromNode) return null;

  const fromNodeInfo = nodePositions[connectionInProgress.fromNodeId];
  if (!fromNodeInfo) return null;

  const from = { x: fromNode.x + fromNodeInfo.width / 2, y: fromNode.y };
  return (
    <path
      d={wirePath(from, preview)}
      stroke="#9ca3af"
      strokeDasharray="6 6"
      strokeWidth={2}
      fill="none"
    />
  );
};