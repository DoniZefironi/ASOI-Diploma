'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useCircuitStore } from './store/circuit.store';
import { NodeDef, Wire, NodeType, ID, getNodeSize, getOutputCount } from './types/circuit.types';
import { NodeView } from './components/NodeView';
import { WireView } from './components/WireView';
import { PreviewWire } from './components/PreviewWire';
import { AiAssistant } from './components/AiAssistant';

interface CircuitSandboxProps {
  starterCircuit?: { nodes: Record<string, NodeDef>; wires: Record<string, Wire> };
  onCircuitSubmit?: (circuit: { nodes: Record<string, NodeDef>; wires: Record<string, Wire> }) => void;
  submitting?: boolean;
}

// ── Palette data ──────────────────────────────────────────────────
const PALETTE: { category: string; icon: string; items: { type: NodeType; label: string; hint: string }[] }[] = [
  {
    category: 'Ввод/Вывод', icon: '🔌',
    items: [
      { type: 'INPUT',        label: 'Вход',      hint: 'Источник логического сигнала' },
      { type: 'OUTPUT',       label: 'Выход',     hint: 'Отображает выходной сигнал' },
      { type: 'LED',          label: 'Светодиод', hint: 'Визуальный индикатор' },
      { type: 'CLOCK',        label: 'Тактовый',  hint: 'Генератор тактового сигнала' },
      { type: 'DISPLAY',      label: 'Дисплей',   hint: '4-битное число (0–15)' },
      { type: 'SEVEN_SEGMENT',label: '7-сегмент', hint: 'Семисегментный индикатор' },
    ],
  },
  {
    category: 'Логические', icon: '⚡',
    items: [
      { type: 'AND',  label: 'И',       hint: 'Конъюнкция: выход 1 если все входы 1' },
      { type: 'OR',   label: 'ИЛИ',     hint: 'Дизъюнкция: выход 1 если хоть один вход 1' },
      { type: 'NOT',  label: 'НЕ',      hint: 'Инвертор: выход = NOT вход' },
      { type: 'NAND', label: 'И-НЕ',    hint: 'NOT AND' },
      { type: 'NOR',  label: 'ИЛИ-НЕ',  hint: 'NOT OR' },
      { type: 'XOR',  label: 'XOR',     hint: 'Исключающее ИЛИ' },
      { type: 'XNOR', label: 'XNOR',    hint: 'Исключающее ИЛИ-НЕ' },
    ],
  },
  {
    category: 'Арифметика', icon: '➕',
    items: [
      { type: 'HALF_ADDER',      label: 'Полусумм.',    hint: 'A,B → SUM(XOR), CARRY(AND)' },
      { type: 'FULL_ADDER',      label: 'Сумматор',     hint: 'A,B,Cin → SUM, Cout' },
      { type: 'HALF_SUBTRACTOR', label: 'Полувыч.',     hint: 'A,B → DIFF(XOR), BORROW' },
      { type: 'FULL_SUBTRACTOR', label: 'Вычитатель',   hint: 'A,B,Bin → DIFF, BOUT' },
    ],
  },
  {
    category: 'Последов.', icon: '🔁',
    items: [
      { type: 'DFF',            label: 'D-триггер',      hint: 'Запоминает D на фронте CLK' },
      { type: 'TFF',            label: 'T-триггер',      hint: 'Переключается при T=1, CLK↑' },
      { type: 'COUNTER',        label: 'Счётчик',        hint: 'CLK, RST, EN → счёт' },
      { type: 'SHIFT_REGISTER', label: 'Сдвиг. рег.',   hint: 'Регистр сдвига 4-бит' },
    ],
  },
  {
    category: 'MSI', icon: '🔧',
    items: [
      { type: 'MUX',        label: 'MUX',       hint: 'Мультиплексор 2→1' },
      { type: 'DECODER',    label: 'Декодер',   hint: '2→4 декодер' },
      { type: 'ENCODER',    label: 'Кодер',     hint: '4→2 кодер' },
      { type: 'COMPARATOR', label: 'Компаратор',hint: 'Сравнивает 2-битные числа' },
    ],
  },
];

export default function CircuitSimulator({ starterCircuit, onCircuitSubmit, submitting = false }: CircuitSandboxProps) {
  const svgRef    = useRef<SVGSVGElement>(null);
  const [scale, setScale]   = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAi, setShowAi] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const nodes = useCircuitStore((s) => s.nodes);
  const wires = useCircuitStore((s) => s.wires);
  const addNode            = useCircuitStore((s) => s.addNode);
  const updateNodePos      = useCircuitStore((s) => s.updateNodePos);
  const startConnection    = useCircuitStore((s) => s.startConnection);
  const completeConnection = useCircuitStore((s) => s.completeConnection);
  const cancelConnection   = useCircuitStore((s) => s.cancelConnection);
  const connectionInProgress = useCircuitStore((s) => s.connectionInProgress);
  const runSimulation      = useCircuitStore((s) => s.runSimulation);
  const exportCircuit      = useCircuitStore((s) => s.exportCircuit);
  const importCircuit      = useCircuitStore((s) => s.importCircuit);
  const clear              = useCircuitStore((s) => s.clear);
  const removeWire         = useCircuitStore((s) => s.removeWire);

  const nodeDragRef = useRef<{ id: ID | null; startX: number; startY: number; offsetX: number; offsetY: number }>(
    { id: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 }
  );
  const panRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>(
    { dragging: false, lastX: 0, lastY: 0 }
  );

  const nodePositions = React.useMemo(() => {
    const positions: { [id: string]: { width: number; height: number; inputCount: number } } = {};
    Object.values(nodes).forEach(n => {
      const { width, height } = getNodeSize(n.type);
      positions[n.id] = { width, height, inputCount: n.inputs.length };
    });
    return positions;
  }, [nodes]);

  useEffect(() => {
    if (starterCircuit) { importCircuit(starterCircuit); } else { clear(); }
  }, [starterCircuit, importCircuit, clear]);

  useEffect(() => {
    const hasActiveClock = Object.values(nodes).some(n => n.type === 'CLOCK' && n.clockActive);
    if (!hasActiveClock) return;
    const interval = setInterval(() => runSimulation(), 500);
    return () => clearInterval(interval);
  }, [nodes, runSimulation]);

  const screenToWorld = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return { x: (clientX - rect.left - offset.x) / scale, y: (clientY - rect.top - offset.y) / scale };
  };

  const handleAddNode = (type: NodeType) => {
    const world = screenToWorld(300, 250);
    addNode({ type, x: world.x, y: world.y });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as SVGElement;
    if (target.tagName === 'path') {
      const wireId = target.getAttribute('data-wire-id');
      if (wireId) { e.stopPropagation(); removeWire(wireId); return; }
    }
    if (connectionInProgress) { cancelConnection(); return; }
    panRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (nodeDragRef.current.id && isDragging) {
      const world = screenToWorld(e.clientX, e.clientY);
      updateNodePos(
        nodeDragRef.current.id,
        nodeDragRef.current.offsetX + world.x - nodeDragRef.current.startX,
        nodeDragRef.current.offsetY + world.y - nodeDragRef.current.startY
      );
    } else if (panRef.current.dragging) {
      const dx = e.clientX - panRef.current.lastX;
      const dy = e.clientY - panRef.current.lastY;
      panRef.current.lastX = e.clientX;
      panRef.current.lastY = e.clientY;
      setOffset(o => ({ x: Math.max(-2000, Math.min(2000, o.x + dx)), y: Math.max(-2000, Math.min(2000, o.y + dy)) }));
    }
    if (connectionInProgress) {
      setPreview(screenToWorld(e.clientX, e.clientY));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) svgRef.current?.releasePointerCapture(e.pointerId);
    panRef.current.dragging = false;
    nodeDragRef.current.id = null;
    setIsDragging(false);
  };

  const handleNodePointerDown = (e: React.PointerEvent, nodeId: ID) => {
    e.stopPropagation();
    const world = screenToWorld(e.clientX, e.clientY);
    const node = nodes[nodeId];
    nodeDragRef.current = { id: nodeId, startX: world.x, startY: world.y, offsetX: node.x, offsetY: node.y };
    setIsDragging(true);
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.max(0.2, Math.min(4, s * (e.deltaY < 0 ? 1.1 : 0.9))));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportCircuit(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'circuit.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const nodeCount = Object.keys(nodes).length;
  const wireCount = Object.keys(wires).length;

  return (
    <div className="w-full h-[calc(100vh-80px)] min-h-[600px] flex flex-col bg-gray-950 border border-gray-700 rounded-xl overflow-hidden">

      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={runSimulation}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            ▶ Симуляция
          </button>
          <button
            onClick={clear}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            🗑 Очистить
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            💾 Скачать
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(exportCircuit(), null, 2))}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg px-3 py-1.5 text-sm transition-colors"
          >
            📋 JSON
          </button>
          {onCircuitSubmit && (
            <button
              onClick={() => onCircuitSubmit(exportCircuit())}
              disabled={submitting}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                submitting ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {submitting ? 'Отправка...' : '✓ Проверить'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">
            {nodeCount} узлов · {wireCount} связей · {scale.toFixed(1)}×
          </span>
          {connectionInProgress && (
            <span className="text-xs bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded px-2 py-0.5">
              Соединение... (клик на вход)
            </span>
          )}
          <button
            onClick={() => setShowAi(s => !s)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              showAi ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            }`}
          >
            🤖 ИИ
          </button>
        </div>
      </div>

      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left palette ──────────────────────────────────────────── */}
        <div className="w-48 bg-gray-900 border-r border-gray-700 overflow-y-auto shrink-0 py-2">
          {PALETTE.map(({ category, icon, items }) => (
            <div key={category} className="mb-3">
              <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {icon} {category}
              </div>
              <div className="space-y-0.5 px-2">
                {items.map(({ type, label, hint }) => (
                  <button
                    key={type}
                    onClick={() => handleAddNode(type)}
                    onMouseEnter={() => setTooltip(hint)}
                    onMouseLeave={() => setTooltip(null)}
                    className="w-full text-left px-2 py-1.5 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 rounded-full bg-current opacity-40 group-hover:opacity-100 shrink-0" style={{ backgroundColor: getCategoryColor(category) }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {tooltip && (
            <div className="mx-2 p-2 bg-gray-700 rounded text-xs text-gray-300 border border-gray-600 mt-2">
              {tooltip}
            </div>
          )}
        </div>

        {/* ── Canvas ────────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full h-full bg-gray-950 cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
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
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1f2937" strokeWidth="1" />
              </pattern>
            </defs>
            <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
              <rect x={-2000} y={-2000} width={8000} height={8000} fill="url(#grid)" />
              <g>
                {Object.values(wires).map(w => (
                  <WireView key={w.id} wire={w} nodes={nodes} removeWire={removeWire} nodePositions={nodePositions} />
                ))}
              </g>
              <g>
                {connectionInProgress && (
                  <PreviewWire preview={preview} connectionInProgress={connectionInProgress} nodes={nodes} nodePositions={nodePositions} />
                )}
              </g>
              <g>
                {Object.values(nodes).map(n => (
                  <NodeView key={n.id} node={n} onPointerDown={handleNodePointerDown} />
                ))}
              </g>
            </g>
          </svg>

          {/* Zoom controls */}
          <div className="absolute right-3 bottom-3 flex flex-col gap-1">
            {[
              { label: '+', action: () => setScale(s => Math.min(4, s * 1.2)) },
              { label: '−', action: () => setScale(s => Math.max(0.2, s / 1.2)) },
              { label: '↻', action: () => { setOffset({ x: 0, y: 0 }); setScale(1); } },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 rounded-lg text-sm flex items-center justify-center transition-colors shadow-lg"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Empty state hint */}
          {nodeCount === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-600">
                <div className="text-4xl mb-3">⚡</div>
                <p className="text-sm">Выбери элемент из панели слева</p>
                <p className="text-xs mt-1">Соединяй выходы (правый порт) со входами (левый порт)</p>
              </div>
            </div>
          )}
        </div>

        {/* ── AI panel ──────────────────────────────────────────────── */}
        {showAi && (
          <div className="w-72 shrink-0">
            <AiAssistant onClose={() => setShowAi(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    'Ввод/Вывод': '#3b82f6',
    'Логические': '#8b5cf6',
    'Арифметика': '#f59e0b',
    'Последов.':  '#6366f1',
    'MSI':        '#10b981',
  };
  return map[category] || '#6b7280';
}
