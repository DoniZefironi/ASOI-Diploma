// src/features/circuit/components/CircuitCanvas.tsx
// ... остальные импорты ...
import React, { useEffect, useRef, useState } from 'react';
import { useCircuitStore } from '../hooks/useCircuitStore';
import NodeView from './NodeView';
import WireView from './WireView';
import PreviewWire from './PreviewWire';

interface CircuitCanvasProps {
  scale: number;
  offset: { x: number; y: number };
  setScale: React.Dispatch<React.SetStateAction<number>>;
  setOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ scale, offset, setScale, setOffset }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const panRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({ 
    dragging: false, 
    lastX: 0, 
    lastY: 0 
  });

  const nodes = useCircuitStore((s) => s.nodes);
  const wires = useCircuitStore((s) => s.wires);
  const connectionInProgress = useCircuitStore((s) => s.connectionInProgress);
  const startConnection = useCircuitStore((s) => s.startConnection);
  const completeConnection = useCircuitStore((s) => s.completeConnection);
  const cancelConnection = useCircuitStore((s) => s.cancelConnection);
  const updateNodePos = useCircuitStore((s) => s.updateNodePos);
  const runSimulation = useCircuitStore((s) => s.runSimulation);

  // --- ЛОГИКА ПЕРЕТАСКИВАНИЯ УЗЛОВ ---
  const nodeDrag = useRef<{ 
    id: string | null; 
    startX: number; 
    startY: number; 
    sx: number; 
    sy: number 
  }>({ 
    id: null, 
    startX: 0, 
    startY: 0, 
    sx: 0, 
    sy: 0 
  });

  const screenToWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = (clientX - rect.left - offset.x) / scale;
    const y = (clientY - rect.top - offset.y) / scale;
    return { x, y };
  };

  const handleNodePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const world = screenToWorld(e.clientX, e.clientY);
    const node = nodes[id];
    if (!node) return;

    nodeDrag.current = { 
      id, 
      startX: world.x, 
      startY: world.y, 
      sx: node.x, 
      sy: node.y 
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (nodeDrag.current.id) {
      const world = screenToWorld(e.clientX, e.clientY);
      const dx = world.x - nodeDrag.current.startX;
      const dy = world.y - nodeDrag.current.startY;
      updateNodePos(nodeDrag.current.id, nodeDrag.current.sx + dx, nodeDrag.current.sy + dy);
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (nodeDrag.current.id) {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && (element as HTMLElement).setPointerCapture) {
        (element as HTMLElement).releasePointerCapture(e.pointerId);
      }
      nodeDrag.current.id = null;
    }
  };

  useEffect(() => {
    if (nodeDrag.current.id) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [nodeDrag.current.id]);
  // ---

  // Clock simulation
  useEffect(() => {
    const clockNodes = Object.values(nodes).filter(node => node.type === 'CLOCK' && node.clockActive);
    if (clockNodes.length === 0) return;

    const interval = setInterval(() => {
      runSimulation();
    }, 500);

    return () => clearInterval(interval);
  }, [nodes, runSimulation]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = delta > 0 ? 1.1 : 0.9;
      setScale((s) => Math.max(0.2, Math.min(4, s * factor)));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [setScale]);

  const onPointerDownCanvas = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.node')) return;
    panRef.current.dragging = true;
    panRef.current.lastX = e.clientX;
    panRef.current.lastY = e.clientY;
  };

  const onPointerMoveCanvas = (e: React.PointerEvent) => {
    if (!panRef.current.dragging) return;
    const dx = e.clientX - panRef.current.lastX;
    const dy = e.clientY - panRef.current.lastY;
    panRef.current.lastX = e.clientX;
    panRef.current.lastY = e.clientY;
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  };

  const onPointerUpCanvas = () => {
    panRef.current.dragging = false;
  };

  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    if (!connectionInProgress) setPreview(null);
  }, [connectionInProgress]);

  const onMouseMoveForPreview = (e: React.MouseEvent) => {
    if (!connectionInProgress) return;
    const world = screenToWorld(e.clientX, e.clientY);
    setPreview(world);
  };

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-full bg-gray-900" 
      onPointerDown={onPointerDownCanvas} 
      onPointerMove={onPointerMoveCanvas} 
      onPointerUp={onPointerUpCanvas} 
      onMouseMove={onMouseMoveForPreview}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
        {/* Dark grid */}
        <g>
          {Array.from({ length: 40 }).map((_, i) => (
            <line 
              key={`v_${i}`} // Уникальный ключ для линий сетки
              x1={i*50} 
              y1={0} 
              x2={i*50} 
              y2={4000} 
              stroke="#374151" 
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <line 
              key={`h_${i}`} // Уникальный ключ для линий сетки
              x1={0} 
              y1={i*50} 
              x2={4000} 
              y2={i*50} 
              stroke="#374151" 
              strokeWidth={1}
            />
          ))}
        </g>

        {/* wires */}
        <g>
          {Object.values(wires).map((w) => (
            <WireView key={w.id} wire={w} /> // Ключ передается в WireView
          ))}
        </g>

        {/* preview */}
        <g>
          <PreviewWire preview={preview} /> {/* Одиночный элемент, ключ не нужен */}
        </g>

        {/* nodes */}
        <g>
          {Object.values(nodes).map((n) => (
            <NodeView 
              key={n.id} // Ключ передается в NodeView
              node={n} 
              onPointerDown={handleNodePointerDown}
            />
          ))}
        </g>
      </g>
    </svg>
  );
};

export default CircuitCanvas;