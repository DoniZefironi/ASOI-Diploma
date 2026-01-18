'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useCircuitStore } from './store/circuit.store';
import { NodeDef, Wire, NodeType, ID } from './types/circuit.types';
import { NodeView } from './components/NodeView';
import { WireView } from './components/WireView';
import { PreviewWire } from './components/PreviewWire';
import { Palette } from './components/Palette';

interface CircuitSandboxProps {
  starterCircuit?: { nodes: Record<string, NodeDef>; wires: Record<string, Wire> };
  onCircuitSubmit?: (circuit: { nodes: Record<string, NodeDef>; wires: Record<string, Wire> }) => void;
  submitting?: boolean;
}

export default function CircuitSimulator({
  starterCircuit,
  onCircuitSubmit,
  submitting = false,
}: CircuitSandboxProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const nodes = useCircuitStore((s) => s.nodes);
  const wires = useCircuitStore((s) => s.wires);
  const addNode = useCircuitStore((s) => s.addNode);
  const updateNodePos = useCircuitStore((s) => s.updateNodePos);
  const startConnection = useCircuitStore((s) => s.startConnection);
  const completeConnection = useCircuitStore((s) => s.completeConnection);
  const cancelConnection = useCircuitStore((s) => s.cancelConnection);
  const connectionInProgress = useCircuitStore((s) => s.connectionInProgress);
  const runSimulation = useCircuitStore((s) => s.runSimulation);
  const exportCircuit = useCircuitStore((s) => s.exportCircuit);
  const importCircuit = useCircuitStore((s) => s.importCircuit);
  const clear = useCircuitStore((s) => s.clear);
  const removeWire = useCircuitStore((s) => s.removeWire);

  const nodeDragRef = useRef<{
    id: ID | null;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  }>({ id: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  const panRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });
  const nodePositions = React.useMemo(() => {
  const positions: { [id: string]: { width: number; height: number; inputCount: number } } = {};
  Object.values(nodes).forEach(n => {
    const width = n.type === 'DISPLAY' || n.type === 'SEVEN_SEGMENT' ? 160 : 120;
    const height = n.type === 'DISPLAY' || n.type === 'SEVEN_SEGMENT' ? 80 : 60;
    positions[n.id] = { width, height, inputCount: n.inputs.length };
  });
  return positions;
}, [nodes]);

  useEffect(() => {
    if (starterCircuit) {
      importCircuit(starterCircuit);
    } else {
      clear();
    }
  }, [starterCircuit, importCircuit, clear]);

  useEffect(() => {
    const clockNodes = Object.values(nodes).filter(
      (node) => node.type === 'CLOCK' && node.clockActive
    );
    if (clockNodes.length === 0) return;
    const interval = setInterval(() => runSimulation(), 500);
    return () => clearInterval(interval);
  }, [nodes, runSimulation]);

  const screenToWorld = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale,
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as SVGElement;
    if (target.closest('.node') && target.tagName === 'rect') {
      const nodeElement = target.closest('.node') as SVGGElement;
      const transform = nodeElement.getAttribute('transform');
      if (!transform) return;
      const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (!match) return;
      const nodeId = Array.from(nodeElement.children)
        .find(child => child.getAttribute('data-node-id'))
        ?.getAttribute('data-node-id');
      if (!nodeId || !nodes[nodeId]) return;
      const world = screenToWorld(e.clientX, e.clientY);
      nodeDragRef.current = {
        id: nodeId,
        startX: world.x,
        startY: world.y,
        offsetX: nodes[nodeId].x,
        offsetY: nodes[nodeId].y,
      };
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    if (target.tagName === 'path' && target.getAttribute('stroke') !== null) {
      const wireId = target.getAttribute('data-wire-id');
      if (wireId) {
        e.stopPropagation();
        removeWire(wireId);
      }
      return;
    }
    panRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (nodeDragRef.current.id && isDragging) {
      const world = screenToWorld(e.clientX, e.clientY);
      const dx = world.x - nodeDragRef.current.startX;
      const dy = world.y - nodeDragRef.current.startY;
      updateNodePos(
        nodeDragRef.current.id,
        nodeDragRef.current.offsetX + dx,
        nodeDragRef.current.offsetY + dy
      );
    } else if (panRef.current.dragging) {
      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;
      panRef.current.lastX = e.clientX;
      panRef.current.lastY = e.clientY;

      // Ограничиваем смещение, чтобы не уйти слишком далеко
      setOffset((o) => ({
        x: Math.max(-2000, Math.min(2000, o.x + dx)),
        y: Math.max(-2000, Math.min(2000, o.y + dy)),
      }));
    }
    if (connectionInProgress) {
      const world = screenToWorld(e.clientX, e.clientY);
      setPreview(world);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    panRef.current.dragging = false;
    nodeDragRef.current.id = null;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    setScale((s) => Math.max(0.2, Math.min(4, s * factor)));
  };

  const handleNodePointerDown = (e: React.PointerEvent, nodeId: ID) => {
    e.stopPropagation();
    const world = screenToWorld(e.clientX, e.clientY);
    const node = nodes[nodeId];
    nodeDragRef.current = {
      id: nodeId,
      startX: world.x,
      startY: world.y,
      offsetX: node.x,
      offsetY: node.y,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleExport = () => {
    const circuit = exportCircuit();
    const blob = new Blob([JSON.stringify(circuit, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (onCircuitSubmit) {
      onCircuitSubmit(exportCircuit());
    }
  };

  return (
    <div className="w-full h-[1080px] border border-gray-700 rounded-lg overflow-hidden flex flex-col bg-gray-900">
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Palette 
            addNode={(type) => {
              const world = screenToWorld(200, 150);
              addNode({ type, x: world.x, y: world.y });
            }} 
          />
          <button
            className="bg-green-600 text-white rounded px-4 py-2 text-sm hover:bg-green-700 transition-colors border border-green-500"
            onClick={runSimulation}
          >
            ▶ Запустить симуляцию
          </button>
          <button
            className="bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-700 transition-colors border border-blue-500"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(exportCircuit(), null, 2));
            }}
          >
            📋 Копировать JSON
          </button>
          <button
            className="bg-purple-600 text-white rounded px-4 py-2 text-sm hover:bg-purple-700 transition-colors border border-purple-500"
            onClick={handleExport}
          >
            💾 Скачать
          </button>
          {onCircuitSubmit && (
            <button
              className={`${
                submitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white rounded px-4 py-2 text-sm transition-colors border border-indigo-500`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Отправка...' : 'Проверить решение'}
            </button>
          )}
        </div>
        <div className="text-sm text-gray-300 font-mono">
          Масштаб: {scale.toFixed(2)} | Узлы: {Object.keys(nodes).length} | Связи: {Object.keys(wires).length}
        </div>
      </div>
      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          className="w-full h-full bg-gray-900 cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="glow"
              />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
            <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
                result="glow"
              />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>
          <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
            <g>
              {Array.from({ length: 50 }).map((_, i) => (
                <React.Fragment key={`v_${i}`}>
                  <line
                    x1={(i - 5) * 50 + (offset.x % 50)}
                    y1={0}
                    x2={(i - 5) * 50 + (offset.x % 50)}
                    y2={4000}
                    stroke="#374151"
                    strokeWidth={1}
                  />
                  <line
                    x1={0}
                    y1={(i - 5) * 50 + (offset.y % 50)}
                    x2={4000}
                    y2={(i - 5) * 50 + (offset.y % 50)}
                    stroke="#374151"
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}
            </g>
            <g>
              {Object.values(wires).map((w) => (
                <WireView
                  key={w.id}
                  wire={w}
                  nodes={nodes}
                  removeWire={removeWire}
                  nodePositions={nodePositions}
                />
              ))}
            </g>
            <g>
              {connectionInProgress && (
                <PreviewWire
                  preview={preview}
                  connectionInProgress={connectionInProgress}
                  nodes={nodes}
                  nodePositions={nodePositions}
                />
              )}
            </g>
            <g>
              {Object.values(nodes).map((n) => (
                <NodeView 
                  key={n.id} 
                  node={n} 
                  onPointerDown={handleNodePointerDown}
                />
              ))}
            </g>
          </g>
        </svg>
        <div className="absolute right-3 bottom-3 bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-xl">
          <div className="flex flex-col gap-1 text-xs">
            <button
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              onClick={() => setScale((s) => Math.min(4, s * 1.2))}
            >
              Приблизить +
            </button>
            <button
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              onClick={() => setScale((s) => Math.max(0.2, s / 1.2))}
            >
              Отдалить -
            </button>
            <button
              className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              onClick={() => {
                setOffset({ x: 0, y: 0 });
                setScale(1);
              }}
            >
              Сброс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}