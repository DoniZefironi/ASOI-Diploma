import React from 'react';
import { NodeDef, ID } from '../types/circuit.types';
import { useCircuitStore } from '../store/circuit.store';
import { getNodeColor, getActiveColor } from './utils';

interface NodeViewProps {
  node: NodeDef;
  onPointerDown: (e: React.PointerEvent, id: ID) => void;
}

export const NodeView: React.FC<NodeViewProps> = ({ node, onPointerDown }) => {
  const width = (node.type === 'DISPLAY' || node.type === 'SEVEN_SEGMENT') ? 160 : 120;
  const height = (node.type === 'DISPLAY' || node.type === 'SEVEN_SEGMENT') ? 80 : 60;
  const inputCount = node.inputs.length;
  const inputPortY = (i: number) => -height / 2 + (i + 1) * (height / (inputCount + 1));
  const outputPortY = 0;

  const nodeColor = getNodeColor(node.type);
  const activeColor = getActiveColor(node.type);

  const toggleInputValue = useCircuitStore((s) => s.toggleInputValue);
  const toggleClock = useCircuitStore((s) => s.toggleClock);
  const removeNode = useCircuitStore((s) => s.removeNode);
  const startConnection = useCircuitStore((s) => s.startConnection);
  const completeConnection = useCircuitStore((s) => s.completeConnection);
  const resetCounter = useCircuitStore((s) => s.resetCounter);

  const renderSevenSegment = () => {
    const segments = [
      { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 }, 
      { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 }, 
      { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 }, 
      { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 }, 
      { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 }, 
      { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 }, 
      { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 }, 
      { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 }, 
      { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 }, 
      { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 }, 
    ];
    const activeSegments = segments[node.displayValue || 0] || segments[0];
    return (
      <g style={{ pointerEvents: 'none' }}>
        <rect
          x={-width / 2 + 15}
          y={-height / 2 + 20}
          width={width - 30}
          height={45}
          rx={6}
          fill="#1e293b"
          stroke="#475569"
        />
        <rect x={-width / 2 + 30} y={-height / 2 + 25} width={30} height={5} rx={2} fill={activeSegments.a ? '#fbbf24' : '#374151'} />
        <rect x={-width / 2 + 60} y={-height / 2 + 30} width={5} height={15} rx={2} fill={activeSegments.b ? '#fbbf24' : '#374151'} />
        <rect x={-width / 2 + 60} y={-height / 2 + 50} width={5} height={15} rx={2} fill={activeSegments.c ? '#fbbf24' : '#374151'} />
        <rect x={-width / 2 + 30} y={-height / 2 + 65} width={30} height={5} rx={2} fill={activeSegments.d ? '#fbbf24' : '#374151'} />
        <rect x={-width / 2 + 25} y={-height / 2 + 50} width={5} height={15} rx={2} fill={activeSegments.e ? '#fbbf24' : '#374151'} />
        <rect x={-width / 2 + 25} y={-height / 2 + 30} width={5} height={15} rx={2} fill={activeSegments.f ? '#fbbf24' : '#374151'} />
        <rect x={-width / 2 + 30} y={-height / 2 + 45} width={30} height={5} rx={2} fill={activeSegments.g ? '#fbbf24' : '#374151'} />
      </g>
    );
  };

  const renderDisplay = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 20}
        width={width - 20}
        height={45}
        rx={8}
        fill="#1e293b"
        stroke="#475569"
        strokeWidth={2}
      />
      <text
        x={0}
        y={-height / 2 + 45}
        fontSize={18}
        textAnchor="middle"
        fill="#fbbf24"
        fontWeight="bold"
        fontFamily="monospace"
      >
        {node.displayValue || 0}
      </text>
      <text
        x={0}
        y={-height / 2 + 60}
        fontSize={10}
        textAnchor="middle"
        fill="#94a3b8"
      >
        BIN: {(node.displayValue || 0).toString(2).padStart(4, '0')}
      </text>
    </g>
  );

  const renderCounter = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 20}
        width={width - 20}
        height={35}
        rx={6}
        fill="#111827"
        stroke="#6b7280"
      />
      <text
        x={0}
        y={-height / 2 + 35}
        fontSize={12}
        textAnchor="middle"
        fill="#f3f4f6"
        fontWeight="bold"
        fontFamily="monospace"
      >
        Счёт: {node.counter || 0}
      </text>
      <text
        x={0}
        y={-height / 2 + 50}
        fontSize={10}
        textAnchor="middle"
        fill="#9ca3af"
      >
        Макс: {node.maxCount || 15}
      </text>
      <g
        onPointerDown={(e) => {
          e.stopPropagation();
          resetCounter(node.id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={-20}
          y={-height / 2 + 55}
          width={40}
          height={16}
          rx={4}
          fill="#ef4444"
          stroke="#dc2626"
        />
        <text
          x={0}
          y={-height / 2 + 66}
          fontSize={9}
          textAnchor="middle"
          fill="#fef2f2"
          fontWeight="bold"
        >
          СБРОС
        </text>
      </g>
    </g>
  );

  const renderShiftRegister = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 20}
        width={width - 20}
        height={35}
        rx={6}
        fill="#111827"
        stroke="#6b7280"
      />
      <text
        x={0}
        y={-height / 2 + 35}
        fontSize={10}
        textAnchor="middle"
        fill="#f3f4f6"
        fontWeight="bold"
      >
        Сдвиг. регистр
      </text>
      <text
        x={0}
        y={-height / 2 + 48}
        fontSize={9}
        textAnchor="middle"
        fill="#9ca3af"
        fontFamily="monospace"
      >
        {node.values?.map(v => v ? '1' : '0').join('') || '0000'}
      </text>
    </g>
  );

  const renderOutput = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 25}
        width={40}
        height={20}
        rx={6}
        fill={node.value ? activeColor : '#374151'}
        stroke={node.value ? activeColor : '#6b7280'}
      />
      <text
        x={-width / 2 + 30}
        y={-height / 2 + 38}
        fontSize={10}
        textAnchor="middle"
        fill="#f3f4f6"
        fontWeight="bold"
      >
        {node.value ? 'ВКЛ' : 'ВЫКЛ'}
      </text>
    </g>
  );

  const renderGenericValueElement = () => (
    <g style={{ pointerEvents: 'none' }}>
      <rect
        x={-width / 2 + 10}
        y={-height / 2 + 25}
        width={40}
        height={20}
        rx={6}
        fill="#111827"
        stroke="#6b7280"
      />
      <text
        x={-width / 2 + 30}
        y={-height / 2 + 38}
        fontSize={10}
        textAnchor="middle"
        fill="#f3f4f6"
        fontWeight="bold"
      >
        {node.value ? '1' : '0'}
      </text>
    </g>
  );

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      className="node"
      onPointerDown={(e) => onPointerDown(e, node.id)}
    >
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={8}
        fill="#1f2937"
        stroke={node.value ? activeColor : nodeColor}
        strokeWidth={2}
        filter={node.value ? 'url(#glow)' : 'none'}
        style={{ cursor: 'move' }}
      />

      <text
        x={0}
        y={-height / 2 + 14}
        fontSize={node.type === 'DISPLAY' ? 10 : 12}
        fontFamily="monospace"
        fill="#f3f4f6"
        textAnchor="middle"
        fontWeight="bold"
        style={{ pointerEvents: 'none' }}
      >
        {node.type === 'AND' && 'И'}
        {node.type === 'OR' && 'ИЛИ'}
        {node.type === 'NOT' && 'НЕ'}
        {node.type === 'NAND' && 'И-НЕ'}
        {node.type === 'NOR' && 'ИЛИ-НЕ'}
        {node.type === 'XOR' && 'искл. ИЛИ'}
        {node.type === 'XNOR' && 'искл. ИЛИ-НЕ'}
        {node.type === 'MUX' && 'MUX'}
        {node.type === 'DFF' && 'D триггер'}
        {node.type === 'TFF' && 'T триггер'}
        {node.type === 'DECODER' && '2-4 декод.'}
        {node.type === 'ENCODER' && '4-2 кодир.'}
        {node.type === 'COMPARATOR' && 'компаратор'}
        {!['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'MUX', 'DFF', 'TFF', 'DECODER', 'ENCODER', 'COMPARATOR'].includes(node.type) && (node.label ?? node.type)}
      </text>

      {Array.from({ length: inputCount }).map((_, idx) => (
        <circle
          key={idx}
          cx={-width / 2}
          cy={inputPortY(idx)}
          r={6}
          fill="#374151"
          stroke="#6b7280"
          strokeWidth={1}
          style={{ cursor: 'crosshair' }}
          onPointerDown={(e) => {
            e.stopPropagation();
            completeConnection(node.id, idx);
          }}
        />
      ))}

      <circle
        cx={width / 2}
        cy={outputPortY}
        r={7}
        fill={node.value ? activeColor : '#374151'}
        stroke={node.value ? activeColor : '#6b7280'}
        strokeWidth={1}
        style={{ cursor: 'crosshair' }}
        onPointerDown={(e) => {
          e.stopPropagation();
          startConnection(node.id, 0);
        }}
      />

      {node.type === 'INPUT' && (
        <g
          onPointerDown={(e) => {
            e.stopPropagation();
            toggleInputValue(node.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x={-width / 2 + 10}
            y={-height / 2 + 25}
            width={40}
            height={20}
            rx={6}
            fill={node.value ? activeColor : '#374151'}
            stroke={node.value ? activeColor : '#6b7280'}
          />
          <text
            x={-width / 2 + 30}
            y={-height / 2 + 38}
            fontSize={10}
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {node.value ? 'ВКЛ' : 'ВЫКЛ'}
          </text>
        </g>
      )}
      {node.type === 'CLOCK' && (
        <g
          onPointerDown={(e) => {
            e.stopPropagation();
            toggleClock(node.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          <rect
            x={-width / 2 + 10}
            y={-height / 2 + 25}
            width={40}
            height={20}
            rx={6}
            fill={node.clockActive ? activeColor : '#374151'}
            stroke={node.clockActive ? activeColor : '#6b7280'}
          />
          <text
            x={-width / 2 + 30}
            y={-height / 2 + 38}
            fontSize={9}
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {node.clockActive ? 'ЗАПУСК' : 'СТОП'}
          </text>
        </g>
      )}
      {node.type === 'LED' && (
        <circle
          cx={0}
          cy={5}
          r={12}
          fill={node.value ? '#fef08a' : '#4b5563'}
          stroke={node.value ? '#fef08a' : '#6b7280'}
          strokeWidth={2}
          filter={node.value ? 'url(#ledGlow)' : 'none'}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {node.type === 'COUNTER' && renderCounter()}
      {node.type === 'DISPLAY' && renderDisplay()}
      {node.type === 'SEVEN_SEGMENT' && renderSevenSegment()}
      {node.type === 'SHIFT_REGISTER' && renderShiftRegister()}
      {node.type === 'OUTPUT' && renderOutput()}
      {(node.type === 'DECODER' || node.type === 'ENCODER' || node.type === 'COMPARATOR') && renderGenericValueElement()}
      {['DFF', 'TFF', 'MUX'].includes(node.type) && (
        <g style={{ pointerEvents: 'none' }}>
          <rect
            x={-width / 2 + 10}
            y={-height / 2 + 25}
            width={40}
            height={20}
            rx={6}
            fill="#111827"
            stroke="#6b7280"
          />
          <text
            x={-width / 2 + 30}
            y={-height / 2 + 38}
            fontSize={10}
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            {node.type === 'MUX' ? `S:${node.select || 0}` : (node.state ? '1' : '0')}
          </text>
        </g>
      )}

      <g
        transform={`translate(${width / 2 - 15}, ${-height / 2 + 15})`}
        onPointerDown={(e) => {
          e.stopPropagation();
          removeNode(node.id);
        }}
        style={{ cursor: 'pointer' }}
      >
        <circle r={8} fill="#ef4444" stroke="#dc2626" />
        <text 
          x={0} 
          y={3} 
          fontSize={10} 
          textAnchor="middle" 
          fill="#fef2f2" 
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          ×
        </text>
      </g>
    </g>
  );
};