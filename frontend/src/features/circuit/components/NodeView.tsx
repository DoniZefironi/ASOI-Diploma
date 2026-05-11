import React from 'react';
import { NodeDef, ID, getOutputCount, getOutputPortY, getNodeSize } from '../types/circuit.types';
import { useCircuitStore } from '../store/circuit.store';
import { getNodeColor, getActiveColor } from './utils';

interface NodeViewProps {
  node: NodeDef;
  onPointerDown: (e: React.PointerEvent, id: ID) => void;
}

const NODE_LABELS: Record<string, string> = {
  AND: 'И', OR: 'ИЛИ', NOT: 'НЕ', NAND: 'И-НЕ', NOR: 'ИЛИ-НЕ',
  XOR: 'XOR', XNOR: 'XNOR', MUX: 'MUX', DFF: 'D-триггер', TFF: 'T-триггер',
  DECODER: '2-4 декод.', ENCODER: '4-2 кодир.', COMPARATOR: 'Компаратор',
  HALF_ADDER: 'Полусумм.', FULL_ADDER: 'Сумматор', HALF_SUBTRACTOR: 'Полувыч.', FULL_SUBTRACTOR: 'Вычитатель',
};

const OUTPUT_PORT_LABELS: Record<string, string[]> = {
  HALF_ADDER:      ['S', 'C'],
  FULL_ADDER:      ['S', 'Co'],
  HALF_SUBTRACTOR: ['D', 'B'],
  FULL_SUBTRACTOR: ['D', 'Bo'],
};

const INPUT_PORT_LABELS: Record<string, string[]> = {
  HALF_ADDER:      ['A', 'B'],
  FULL_ADDER:      ['A', 'B', 'Ci'],
  HALF_SUBTRACTOR: ['A', 'B'],
  FULL_SUBTRACTOR: ['A', 'B', 'Bi'],
  DFF:             ['D', 'CLK'],
  TFF:             ['T', 'CLK'],
  COUNTER:         ['CLK', 'RST', 'EN'],
  MUX:             ['D0', 'D1', 'S'],
  SHIFT_REGISTER:  ['D', 'CLK', 'RST'],
};

export const NodeView: React.FC<NodeViewProps> = ({ node, onPointerDown }) => {
  const { width, height } = getNodeSize(node.type);
  const inputCount = node.inputs.length;
  const outputCount = getOutputCount(node.type);

  const inputPortY = (i: number) => -height / 2 + (i + 1) * (height / (inputCount + 1));
  const outputPortY = (slot: number) => getOutputPortY(slot, outputCount, height);

  const nodeColor  = getNodeColor(node.type);
  const activeColor = getActiveColor(node.type);

  const toggleInputValue = useCircuitStore((s) => s.toggleInputValue);
  const toggleClock      = useCircuitStore((s) => s.toggleClock);
  const removeNode       = useCircuitStore((s) => s.removeNode);
  const startConnection  = useCircuitStore((s) => s.startConnection);
  const completeConnection = useCircuitStore((s) => s.completeConnection);
  const resetCounter     = useCircuitStore((s) => s.resetCounter);

  const isActive = node.value || (node.outputValues?.some(Boolean));

  // ── Специальные рендеры ──────────────────────────────────────────
  const renderSevenSegment = () => {
    const segs = [
      { a:1,b:1,c:1,d:1,e:1,f:1,g:0 }, { a:0,b:1,c:1,d:0,e:0,f:0,g:0 },
      { a:1,b:1,c:0,d:1,e:1,f:0,g:1 }, { a:1,b:1,c:1,d:1,e:0,f:0,g:1 },
      { a:0,b:1,c:1,d:0,e:0,f:1,g:1 }, { a:1,b:0,c:1,d:1,e:0,f:1,g:1 },
      { a:1,b:0,c:1,d:1,e:1,f:1,g:1 }, { a:1,b:1,c:1,d:0,e:0,f:0,g:0 },
      { a:1,b:1,c:1,d:1,e:1,f:1,g:1 }, { a:1,b:1,c:1,d:1,e:0,f:1,g:1 },
    ];
    const s = segs[node.displayValue || 0] || segs[0];
    const on = '#fbbf24'; const off = '#374151';
    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect x={-width/2+15} y={-height/2+20} width={width-30} height={45} rx={6} fill="#1e293b" stroke="#475569" />
        <rect x={-width/2+30} y={-height/2+25} width={30} height={5}  rx={2} fill={s.a ? on : off} />
        <rect x={-width/2+60} y={-height/2+30} width={5}  height={15} rx={2} fill={s.b ? on : off} />
        <rect x={-width/2+60} y={-height/2+50} width={5}  height={15} rx={2} fill={s.c ? on : off} />
        <rect x={-width/2+30} y={-height/2+65} width={30} height={5}  rx={2} fill={s.d ? on : off} />
        <rect x={-width/2+25} y={-height/2+50} width={5}  height={15} rx={2} fill={s.e ? on : off} />
        <rect x={-width/2+25} y={-height/2+30} width={5}  height={15} rx={2} fill={s.f ? on : off} />
        <rect x={-width/2+30} y={-height/2+45} width={30} height={5}  rx={2} fill={s.g ? on : off} />
      </g>
    );
  };

  const renderDisplay = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={-width/2+10} y={-height/2+20} width={width-20} height={45} rx={8} fill="#1e293b" stroke="#475569" strokeWidth={2} />
      <text x={0} y={-height/2+45} fontSize={18} textAnchor="middle" fill="#fbbf24" fontWeight="bold" fontFamily="monospace">
        {node.displayValue || 0}
      </text>
      <text x={0} y={-height/2+60} fontSize={10} textAnchor="middle" fill="#94a3b8">
        BIN: {(node.displayValue || 0).toString(2).padStart(4, '0')}
      </text>
    </g>
  );

  const renderCounter = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={-width/2+10} y={-height/2+20} width={width-20} height={35} rx={6} fill="#111827" stroke="#6b7280" />
      <text x={0} y={-height/2+35} fontSize={12} textAnchor="middle" fill="#f3f4f6" fontWeight="bold" fontFamily="monospace">
        Счёт: {node.counter || 0}
      </text>
      <text x={0} y={-height/2+50} fontSize={10} textAnchor="middle" fill="#9ca3af">
        Макс: {node.maxCount || 15}
      </text>
      <g onPointerDown={(e) => { e.stopPropagation(); resetCounter(node.id); }} style={{ cursor: 'pointer' }}>
        <rect x={-20} y={-height/2+55} width={40} height={16} rx={4} fill="#ef4444" stroke="#dc2626" />
        <text x={0} y={-height/2+66} fontSize={9} textAnchor="middle" fill="#fef2f2" fontWeight="bold" style={{ pointerEvents: 'none' }}>СБРОС</text>
      </g>
    </g>
  );

  const renderShiftRegister = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect x={-width/2+10} y={-height/2+20} width={width-20} height={35} rx={6} fill="#111827" stroke="#6b7280" />
      <text x={0} y={-height/2+35} fontSize={10} textAnchor="middle" fill="#f3f4f6" fontWeight="bold">Сдвиг. регистр</text>
      <text x={0} y={-height/2+48} fontSize={9} textAnchor="middle" fill="#9ca3af" fontFamily="monospace">
        {node.values?.map(v => v ? '1' : '0').join('') || '0000'}
      </text>
    </g>
  );

  const renderAdder = () => {
    const labels = OUTPUT_PORT_LABELS[node.type] || ['S', 'C'];
    const vals = node.outputValues || [false, false];
    return (
      <g style={{ pointerEvents: 'none' }}>
        {labels.map((lbl, i) => {
          const y = outputPortY(i);
          return (
            <text key={i} x={width/2 - 18} y={y + 4} fontSize={9} textAnchor="middle" fill={vals[i] ? '#fbbf24' : '#9ca3af'} fontWeight="bold">
              {lbl}
            </text>
          );
        })}
      </g>
    );
  };

  return (
    <g transform={`translate(${node.x}, ${node.y})`} className="node" onPointerDown={(e) => onPointerDown(e, node.id)}>
      {/* Main box */}
      <rect
        x={-width/2} y={-height/2} width={width} height={height} rx={8}
        fill="#1f2937"
        stroke={isActive ? activeColor : nodeColor}
        strokeWidth={2}
        filter={isActive ? 'url(#glow)' : 'none'}
        style={{ cursor: 'move' }}
        data-node-id={node.id}
      />

      {/* Type label */}
      <text
        x={0} y={-height/2 + 14}
        fontSize={node.type === 'DISPLAY' ? 10 : 11}
        fontFamily="monospace" fill="#f3f4f6"
        textAnchor="middle" fontWeight="bold"
        style={{ pointerEvents: 'none' }}
      >
        {NODE_LABELS[node.type] ?? (node.label ?? node.type)}
      </text>

      {/* Input ports */}
      {Array.from({ length: inputCount }).map((_, idx) => {
        const portLabels = INPUT_PORT_LABELS[node.type];
        return (
          <g key={idx}>
            <circle
              cx={-width/2} cy={inputPortY(idx)} r={6}
              fill="#374151" stroke="#6b7280" strokeWidth={1}
              style={{ cursor: 'crosshair' }}
              onPointerDown={(e) => { e.stopPropagation(); completeConnection(node.id, idx); }}
            />
            {portLabels?.[idx] && (
              <text
                x={-width/2 + 12} y={inputPortY(idx) + 4}
                fontSize={8} fill="#6b7280" style={{ pointerEvents: 'none' }}
              >
                {portLabels[idx]}
              </text>
            )}
          </g>
        );
      })}

      {/* Output ports */}
      {Array.from({ length: outputCount }).map((_, slot) => {
        const y = outputPortY(slot);
        const val = outputCount > 1 ? (node.outputValues?.[slot] ?? false) : (node.value ?? false);
        const portLabels = OUTPUT_PORT_LABELS[node.type];
        return (
          <g key={slot}>
            <circle
              cx={width/2} cy={y} r={7}
              fill={val ? activeColor : '#374151'}
              stroke={val ? activeColor : '#6b7280'}
              strokeWidth={1}
              style={{ cursor: 'crosshair' }}
              onPointerDown={(e) => { e.stopPropagation(); startConnection(node.id, slot); }}
            />
            {portLabels?.[slot] && outputCount > 1 && (
              <text
                x={width/2 - 12} y={y + 4}
                fontSize={8} fill="#6b7280"
                textAnchor="end"
                style={{ pointerEvents: 'none' }}
              >
                {portLabels[slot]}
              </text>
            )}
          </g>
        );
      })}

      {/* Inner content */}
      {node.type === 'INPUT' && (
        <g onPointerDown={(e) => { e.stopPropagation(); toggleInputValue(node.id); }} style={{ cursor: 'pointer' }}>
          <rect x={-width/2+10} y={-height/2+25} width={50} height={20} rx={6} fill={node.value ? activeColor : '#374151'} stroke={node.value ? activeColor : '#6b7280'} />
          <text x={-width/2+35} y={-height/2+38} fontSize={10} textAnchor="middle" fill="#f3f4f6" fontWeight="bold" style={{ pointerEvents: 'none' }}>
            {node.value ? '1 (ВКЛ)' : '0 (ВЫКЛ)'}
          </text>
        </g>
      )}
      {node.type === 'CLOCK' && (
        <g onPointerDown={(e) => { e.stopPropagation(); toggleClock(node.id); }} style={{ cursor: 'pointer' }}>
          <rect x={-width/2+10} y={-height/2+25} width={50} height={20} rx={6} fill={node.clockActive ? activeColor : '#374151'} stroke={node.clockActive ? activeColor : '#6b7280'} />
          <text x={-width/2+35} y={-height/2+38} fontSize={9} textAnchor="middle" fill="#f3f4f6" fontWeight="bold" style={{ pointerEvents: 'none' }}>
            {node.clockActive ? '▶ ВКЛ' : '⏸ ВЫКЛ'}
          </text>
        </g>
      )}
      {node.type === 'LED' && (
        <circle cx={0} cy={5} r={12}
          fill={node.value ? '#fef08a' : '#4b5563'}
          stroke={node.value ? '#fef08a' : '#6b7280'}
          strokeWidth={2}
          filter={node.value ? 'url(#ledGlow)' : 'none'}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {node.type === 'OUTPUT' && (
        <g style={{ pointerEvents: 'none' }}>
          <rect x={-width/2+10} y={-height/2+25} width={40} height={20} rx={6} fill={node.value ? activeColor : '#374151'} stroke={node.value ? activeColor : '#6b7280'} />
          <text x={-width/2+30} y={-height/2+38} fontSize={10} textAnchor="middle" fill="#f3f4f6" fontWeight="bold">
            {node.value ? 'ВКЛ' : 'ВЫКЛ'}
          </text>
        </g>
      )}
      {node.type === 'COUNTER' && renderCounter()}
      {node.type === 'DISPLAY' && renderDisplay()}
      {node.type === 'SEVEN_SEGMENT' && renderSevenSegment()}
      {node.type === 'SHIFT_REGISTER' && renderShiftRegister()}
      {['HALF_ADDER', 'FULL_ADDER', 'HALF_SUBTRACTOR', 'FULL_SUBTRACTOR'].includes(node.type) && renderAdder()}
      {(node.type === 'DECODER' || node.type === 'ENCODER' || node.type === 'COMPARATOR') && (
        <g style={{ pointerEvents: 'none' }}>
          <rect x={-width/2+10} y={-height/2+25} width={40} height={20} rx={6} fill="#111827" stroke="#6b7280" />
          <text x={-width/2+30} y={-height/2+38} fontSize={10} textAnchor="middle" fill="#f3f4f6" fontWeight="bold">
            {node.value ? '1' : '0'}
          </text>
        </g>
      )}
      {['DFF', 'TFF', 'MUX'].includes(node.type) && (
        <g style={{ pointerEvents: 'none' }}>
          <rect x={-width/2+10} y={-height/2+25} width={40} height={20} rx={6} fill="#111827" stroke="#6b7280" />
          <text x={-width/2+30} y={-height/2+38} fontSize={10} textAnchor="middle" fill="#f3f4f6" fontWeight="bold">
            {node.type === 'MUX' ? `S:${node.select || 0}` : (node.state ? '1' : '0')}
          </text>
        </g>
      )}

      {/* Delete button */}
      <g
        transform={`translate(${width/2 - 12}, ${-height/2 + 12})`}
        onPointerDown={(e) => { e.stopPropagation(); removeNode(node.id); }}
        style={{ cursor: 'pointer' }}
      >
        <circle r={8} fill="#ef4444" stroke="#dc2626" />
        <text x={0} y={3} fontSize={10} textAnchor="middle" fill="#fef2f2" fontWeight="bold" style={{ pointerEvents: 'none' }}>×</text>
      </g>
    </g>
  );
};
