import React from 'react';
import { Wire, NodeDef, ID, MULTI_OUTPUT_TYPES, getOutputPortY, getOutputCount } from '../types/circuit.types';

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
  const toNode   = nodes[wire.to.nodeId];
  if (!fromNode || !toNode) return null;

  const fromInfo = nodePositions[wire.from.nodeId];
  const toInfo   = nodePositions[wire.to.nodeId];
  if (!fromInfo || !toInfo) return null;

  const inputPortY  = (slot: number, count: number) =>
    -toInfo.height / 2 + (slot + 1) * (toInfo.height / (count + 1));

  const outputCount = getOutputCount(fromNode.type);
  const fromY       = getOutputPortY(wire.from.slot, outputCount, fromInfo.height);

  const from = { x: fromNode.x + fromInfo.width / 2, y: fromNode.y + fromY };
  const to   = {
    x: toNode.x - toInfo.width / 2,
    y: toNode.y + inputPortY(wire.to.slot, toInfo.inputCount),
  };

  const activeValue = MULTI_OUTPUT_TYPES.includes(fromNode.type)
    ? (fromNode.outputValues?.[wire.from.slot] ?? false)
    : (fromNode.value ?? false);

  return (
    <path
      d={wirePath(from, to)}
      stroke={activeValue ? '#60a5fa' : '#4b5563'}
      strokeWidth={activeValue ? 3 : 2}
      fill="none"
      style={{ cursor: 'pointer' }}
      data-wire-id={wire.id}
      onPointerDown={(e) => { e.stopPropagation(); removeWire(wire.id); }}
    />
  );
};
