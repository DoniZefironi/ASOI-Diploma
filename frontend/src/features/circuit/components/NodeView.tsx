'use client';

import React from 'react';
import { NodeDef, ID, NodeType } from '../types';
import { useCircuitStore } from '../hooks/useCircuitStore';

interface NodeViewProps {
  node: NodeDef;
  onPointerDown: (e: React.PointerEvent, id: string) => void; // Принимаем обработчик
}

const NodeView: React.FC<NodeViewProps> = ({ node, onPointerDown }) => { // Принимаем props
  const width = 120;
  const height = 60;
  
  // Adjust port positions based on node type
  const inputCount = node.inputs.length;
  let portY = (i: number) => -height / 2 + 15 + (i * 15);
  
  if (node.type === 'DFF' || node.type === 'TFF' || node.type === 'MUX') {
    portY = (i: number) => -height / 2 + 20 + (i * 20);
  }

  const getNodeColor = () => {
    switch (node.type) {
      case 'INPUT': return '#2563eb';
      case 'OUTPUT': return '#16a34a';
      case 'LED': return '#ca8a04';
      case 'CLOCK': return '#ea580c';
      case 'COUNTER': return '#0891b2';
      case 'DISPLAY': return '#db2777';
      case 'DFF': 
      case 'TFF': return '#4f46e5';
      case 'MUX': return '#0d9488';
      default: return '#7c3aed'; // For AND, OR, NOT, etc.
    }
  };

  const getActiveColor = () => {
    switch (node.type) {
      case 'INPUT': return '#3b82f6';
      case 'OUTPUT': return '#22c55e';
      case 'LED': return '#eab308';
      case 'CLOCK': return '#f97316';
      case 'COUNTER': return '#06b6d4';
      case 'DISPLAY': return '#ec4899';
      case 'DFF': 
      case 'TFF': return '#6366f1';
      case 'MUX': return '#14b8a6';
      default: return '#8b5cf6';
    }
  };

  const nodeColor = getNodeColor();
  const activeColor = getActiveColor();

  const startConnection = useCircuitStore((s) => s.startConnection);
  const completeConnection = useCircuitStore((s) => s.completeConnection);
  const removeNode = useCircuitStore((s) => s.removeNode);
  const toggleInputValue = useCircuitStore((s) => s.toggleInputValue);
  const toggleClock = useCircuitStore((s) => s.toggleClock);

  return (
    <g 
      transform={`translate(${node.x}, ${node.y})`} 
      className="node" 
      onPointerDown={(e) => onPointerDown(e, node.id)} // Вызываем переданный обработчик
    >
      {/* Node body with glow effect when active */}
      <rect 
        x={-width/2} 
        y={-height/2} 
        width={width} 
        height={height} 
        rx={12} 
        ry={12} 
        fill="#1f2937" 
        stroke={node.value ? activeColor : nodeColor}
        strokeWidth={2}
        filter={node.value ? "url(#glow)" : "none"}
      />

      {/* Node label */}
      <text 
        x={0} 
        y={-height/2 + 16} 
        fontSize={11} 
        fontFamily="Inter, sans-serif"
        fill="#f3f4f6"
        textAnchor="middle"
        fontWeight="500"
      >
        {node.label ?? node.type}
      </text>

      {/* Input ports */}
      {Array.from({ length: inputCount }).map((_, idx) => {
        const py = portY(idx);
        return (
          <g key={idx}>
            <circle 
              cx={-width/2} 
              cy={py} 
              r={5} 
              fill="#374151" 
              stroke="#6b7280" 
              strokeWidth={1}
              onClick={(e) => { 
                e.stopPropagation(); 
                completeConnection(node.id, idx); 
              }} 
            />
          </g>
        );
      })}

      {/* Output port */}
      <circle 
        cx={width/2} 
        cy={0} 
        r={7} 
        fill={node.value ? activeColor : '#374151'} 
        stroke={node.value ? activeColor : '#6b7280'}
        strokeWidth={1}
        onClick={(e) => { 
          e.stopPropagation(); 
          startConnection(node.id, 0); 
        }} 
      />

      {/* Special node controls and displays */}
      {node.type === 'INPUT' && (
        <g 
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleInputValue(node.id); 
          }} 
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x={-width/2 + 10} 
            y={-height/2 + 25} 
            width={40} 
            height={20} 
            rx={6} 
            fill={node.value ? activeColor : '#374151'} 
            stroke={node.value ? activeColor : '#6b7280'}
          />
          <text 
            x={-width/2 + 30} 
            y={-height/2 + 38} 
            fontSize={10} 
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            {node.value ? 'ON' : 'OFF'}
          </text>
        </g>
      )}

      {node.type === 'LED' && (
        <g>
          <circle 
            cx={0} 
            cy={5} 
            r={12} 
            fill={node.value ? '#fef08a' : '#4b5563'} 
            stroke={node.value ? '#fef08a' : '#6b7280'}
            strokeWidth={2}
            filter={node.value ? "url(#ledGlow)" : "none"}
          />
        </g>
      )}

      {node.type === 'CLOCK' && (
        <g 
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleClock(node.id); 
          }} 
          style={{ cursor: 'pointer' }}
        >
          <rect 
            x={-width/2 + 10} 
            y={-height/2 + 25} 
            width={40} 
            height={20} 
            rx={6} 
            fill={node.clockActive ? activeColor : '#374151'} 
            stroke={node.clockActive ? activeColor : '#6b7280'}
          />
          <text 
            x={-width/2 + 30} 
            y={-height/2 + 38} 
            fontSize={9} 
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            {node.clockActive ? 'RUN' : 'STOP'}
          </text>
        </g>
      )}

      {node.type === 'COUNTER' && (
        <g>
          <rect 
            x={-width/2 + 10} 
            y={-height/2 + 25} 
            width={40} 
            height={20} 
            rx={6} 
            fill="#111827" 
            stroke="#6b7280"
          />
          <text 
            x={-width/2 + 30} 
            y={-height/2 + 38} 
            fontSize={10} 
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            {node.counter || 0}
          </text>
        </g>
      )}

      {node.type === 'DISPLAY' && (
        <g>
          <rect 
            x={-width/2 + 10} 
            y={-height/2 + 25} 
            width={40} 
            height={20} 
            rx={4} 
            fill="#000" 
            stroke="#6b7280"
          />
          <text 
            x={-width/2 + 30} 
            y={-height/2 + 38} 
            fontSize={10} 
            textAnchor="middle"
            fill="#00ff00"
            fontWeight="bold"
          >
            {node.value ? '1' : '0'}
          </text>
        </g>
      )}

      {/* D Flip-Flop state display */}
      {node.type === 'DFF' && (
        <g>
          <rect 
            x={-width/2 + 10} 
            y={-height/2 + 25} 
            width={40} 
            height={20} 
            rx={6} 
            fill="#111827" 
            stroke="#6b7280"
          />
          <text 
            x={-width/2 + 30} 
            y={-height/2 + 38} 
            fontSize={10} 
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            {node.state ? '1' : '0'}
          </text>
        </g>
      )}

      {/* T Flip-Flop state display */}
      {node.type === 'TFF' && (
        <g>
          <rect 
            x={-width/2 + 10} 
            y={-height/2 + 25} 
            width={40} 
            height={20} 
            rx={6} 
            fill="#111827" 
            stroke="#6b7280"
          />
          <text 
            x={-width/2 + 30} 
            y={-height/2 + 38} 
            fontSize={10} 
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            {node.state ? '1' : '0'}
          </text>
        </g>
      )}

      {/* MUX select display */}
      {node.type === 'MUX' && (
        <g>
          <rect 
            x={-width/2 + 10} 
            y={-height/2 + 25} 
            width={40} 
            height={20} 
            rx={6} 
            fill="#111827" 
            stroke="#6b7280"
          />
          <text 
            x={-width/2 + 30} 
            y={-height/2 + 38} 
            fontSize={10} 
            textAnchor="middle"
            fill="#f3f4f6"
            fontWeight="bold"
          >
            S:{node.select || 0}
          </text>
        </g>
      )}

      {/* Delete button */}
      <g 
        transform={`translate(${width/2 - 15}, ${-height/2 + 15})`} 
        onClick={(e) => { 
          e.stopPropagation(); 
          removeNode(node.id); 
        }} 
        style={{ cursor: 'pointer' }}
      >
        <circle r={8} fill="#ef4444" stroke="#dc2626" />
        <text x={0} y={3} fontSize={10} textAnchor="middle" fill="#fef2f2" fontWeight="bold">×</text>
      </g>
    </g>
  );
};

export default NodeView;