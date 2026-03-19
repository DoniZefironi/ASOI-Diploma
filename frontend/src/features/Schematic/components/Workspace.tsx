'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSchematicStore } from '../store/useSchematicStore';
import { PlacedComponent, PinDef, Wire } from '../types';
import { getComponentDef } from '../engine/componentDefs';

// ─── Pin colour by role ────────────────────────────────────────────────────────
function pinColor(role: PinDef['role']) {
  const map: Partial<Record<PinDef['role'], string>> = {
    'gpio': '#3b82f6',
    'adc': '#8b5cf6',
    'power-3v3': '#ef4444',
    'power-5v': '#f97316',
    'vin': '#f97316',
    'gnd': '#374151',
    'vcc': '#ef4444',
    'data': '#10b981',
    'signal': '#10b981',
    'out': '#10b981',
    'in': '#3b82f6',
    'trig': '#eab308',
    'echo': '#22d3ee',
    'anode': '#ef4444',
    'cathode': '#374151',
    'sda': '#a78bfa',
    'scl': '#818cf8',
    'pwm': '#34d399',
    'com': '#6b7280',
    'no': '#4ade80',
    'nc': '#ef4444',
  };
  return map[role] ?? '#6b7280';
}

// ─── Component visual renderer ────────────────────────────────────────────────
function ComponentBody({ comp, isSelected, simState }: {
  comp: PlacedComponent;
  isSelected: boolean;
  simState: any;
}) {
  const def = getComponentDef(comp.type);
  const { type } = comp;

  const ledOn = simState.ledStates?.[comp.id] ?? false;
  const relayOn = simState.relayStates?.[comp.id] ?? false;
  const servoAngle = simState.servoAngles?.[comp.id] ?? 90;
  const lcdText = simState.lcdText ?? ['', ''];

  const base = `absolute rounded select-none transition-shadow ${isSelected ? 'shadow-lg shadow-blue-500/30' : ''}`;

  // ESP32
  if (type === 'esp32') {
    return (
      <div className={`${base} flex flex-col items-center justify-center bg-gray-900 border-2 border-gray-600`}
        style={{ width: def.width, height: def.height }}>
        <div className="w-full flex flex-col items-center gap-1 px-2">
          <div className="w-16 h-10 bg-gray-700 rounded border border-gray-500 flex items-center justify-center">
            <span className="text-gray-300 text-xs font-mono">ESP32</span>
          </div>
          <div className="w-8 h-5 bg-gray-600 rounded-sm" />
          <div className="w-6 h-3 bg-blue-900 rounded-sm" />
        </div>
        <span className="text-xs text-green-400 font-bold mt-1">ESP32</span>
      </div>
    );
  }

  // Arduino Uno
  if (type === 'arduino-uno') {
    return (
      <div className={`${base} flex flex-col items-center justify-center bg-blue-950 border-2 border-blue-700`}
        style={{ width: def.width, height: def.height }}>
        <div className="w-14 h-10 bg-blue-800 rounded border border-blue-600 flex items-center justify-center">
          <span className="text-blue-200 text-xs font-mono">ATmega</span>
        </div>
        <span className="text-xs text-blue-300 font-bold mt-2">Arduino Uno</span>
      </div>
    );
  }

  // DHT22
  if (type === 'dht22') {
    return (
      <div className={`${base} bg-gray-200 border-2 border-gray-400 flex flex-col items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <span className="text-2xl">🌡️</span>
        <span className="text-xs text-gray-700 font-bold">DHT22</span>
      </div>
    );
  }

  // MQ-2
  if (type === 'mq2') {
    return (
      <div className={`${base} bg-gray-800 border-2 border-orange-600 flex flex-col items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <span className="text-xl">💨</span>
        <span className="text-xs text-orange-300 font-bold">MQ-2</span>
      </div>
    );
  }

  // LDR
  if (type === 'ldr') {
    return (
      <div className={`${base} bg-yellow-900/60 border-2 border-yellow-600 rounded-full flex items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <span className="text-xl">☀️</span>
      </div>
    );
  }

  // HC-SR04
  if (type === 'hcsr04') {
    return (
      <div className={`${base} bg-gray-700 border-2 border-cyan-600 flex flex-col items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-cyan-900 border-2 border-cyan-500" />
          <div className="w-6 h-6 rounded-full bg-cyan-900 border-2 border-cyan-500" />
        </div>
        <span className="text-xs text-cyan-300 font-bold">HC-SR04</span>
      </div>
    );
  }

  // LEDs
  if (type.startsWith('led-')) {
    const colors: Record<string, { bg: string; glow: string; off: string }> = {
      'led-red':    { bg: 'bg-red-500',    glow: 'shadow-red-500/80',    off: 'bg-red-900' },
      'led-green':  { bg: 'bg-green-500',  glow: 'shadow-green-500/80',  off: 'bg-green-900' },
      'led-blue':   { bg: 'bg-blue-500',   glow: 'shadow-blue-500/80',   off: 'bg-blue-900' },
      'led-yellow': { bg: 'bg-yellow-400', glow: 'shadow-yellow-400/80', off: 'bg-yellow-900' },
    };
    const c = colors[type] ?? colors['led-red'];
    return (
      <div className="absolute flex flex-col items-center" style={{ width: def.width, height: def.height }}>
        <div className={`w-6 h-6 rounded-full border-2 border-gray-600 transition-all ${
          ledOn ? `${c.bg} shadow-lg ${c.glow}` : c.off
        }`} />
        <div className="w-1 h-4 bg-gray-500 mx-auto" />
      </div>
    );
  }

  // Buzzer
  if (type === 'buzzer') {
    return (
      <div className={`${base} rounded-full bg-gray-800 border-2 ${simState.buzzerOn ? 'border-yellow-500 shadow-yellow-500/50 shadow-lg' : 'border-gray-600'} flex items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <span className={`text-xl ${simState.buzzerOn ? 'animate-pulse' : ''}`}>🔔</span>
      </div>
    );
  }

  // Relay
  if (type === 'relay') {
    return (
      <div className={`${base} bg-gray-800 border-2 ${relayOn ? 'border-green-500' : 'border-gray-600'} flex flex-col items-center justify-center gap-1`}
        style={{ width: def.width, height: def.height }}>
        <div className={`w-8 h-4 rounded border ${relayOn ? 'bg-green-700 border-green-500' : 'bg-gray-700 border-gray-500'}`} />
        <span className="text-xs text-gray-300 font-bold">RELAY</span>
        <span className={`text-xs ${relayOn ? 'text-green-400' : 'text-gray-600'}`}>{relayOn ? 'ON' : 'OFF'}</span>
      </div>
    );
  }

  // Servo
  if (type === 'servo') {
    const rad = (servoAngle - 90) * Math.PI / 180;
    const x2 = 20 + 18 * Math.sin(rad);
    const y2 = 30 - 18 * Math.cos(rad);
    return (
      <div className={`${base} bg-gray-700 border-2 border-gray-500 flex flex-col items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="15" fill="#374151" stroke="#6b7280" strokeWidth="2" />
          <circle cx="20" cy="20" r="5" fill="#9ca3af" />
          <line x1="20" y1="20" x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="text-xs text-gray-300">{servoAngle}°</span>
      </div>
    );
  }

  // LCD 16x2
  if (type === 'lcd-16x2') {
    return (
      <div className={`${base} bg-green-950 border-2 border-green-700 flex flex-col items-center justify-center p-1`}
        style={{ width: def.width, height: def.height }}>
        <div className="font-mono text-green-300 text-xs leading-4 bg-green-900/50 px-1 rounded min-w-0 w-full text-center">
          <div className="overflow-hidden whitespace-nowrap">{(lcdText[0] || '').padEnd(16)}</div>
          <div className="overflow-hidden whitespace-nowrap">{(lcdText[1] || '').padEnd(16)}</div>
        </div>
        <span className="text-xs text-green-600 mt-0.5">LCD 16×2</span>
      </div>
    );
  }

  // Button
  if (type === 'button') {
    const pressed = (simState.sensorValues?.[comp.id]?.pressed ?? 0) === 1;
    return (
      <div className={`${base} rounded border-2 ${pressed ? 'bg-yellow-500 border-yellow-400' : 'bg-gray-700 border-gray-500'} flex items-center justify-center transition-colors`}
        style={{ width: def.width, height: def.height }}>
        <div className={`w-5 h-5 rounded-full border-2 ${pressed ? 'bg-yellow-300 border-yellow-200' : 'bg-gray-600 border-gray-400'}`} />
      </div>
    );
  }

  // Potentiometer
  if (type === 'potentiometer') {
    const val = simState.sensorValues?.[comp.id]?.value ?? 512;
    const angle = (val / 1023) * 270 - 135;
    const rad = angle * Math.PI / 180;
    const x2 = 25 + 12 * Math.sin(rad);
    const y2 = 28 - 12 * Math.cos(rad);
    return (
      <div className={`${base} bg-gray-700 border-2 border-gray-500 flex flex-col items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <svg width="36" height="36" viewBox="0 0 50 50">
          <circle cx="25" cy="28" r="18" fill="#374151" stroke="#6b7280" strokeWidth="2" />
          <circle cx="25" cy="28" r="6" fill="#9ca3af" />
          <line x1="25" y1="28" x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Resistor
  if (type === 'resistor') {
    return (
      <div className={`${base} bg-amber-800 border-2 border-amber-600 flex items-center justify-center`}
        style={{ width: def.width, height: def.height }}>
        <span className="text-xs text-amber-200 font-mono">Ω</span>
      </div>
    );
  }

  return (
    <div className={`${base} bg-gray-700 border-2 border-gray-500 flex items-center justify-center`}
      style={{ width: def.width, height: def.height }}>
      <span className="text-xs text-gray-300">{def.label}</span>
    </div>
  );
}

// ─── Pin dot ──────────────────────────────────────────────────────────────────
function PinDot({ pin, compId, isHovered, isWiring }: {
  pin: PinDef;
  compId: string;
  isHovered: boolean;
  isWiring: boolean;
}) {
  const { startWireFrom, completeWireTo, setHoveredPin, draggingWireFrom } = useSchematicStore.getState();

  return (
    <div
      className="absolute"
      style={{
        left: pin.x - 5,
        top: pin.y - 5,
        width: 10,
        height: 10,
        zIndex: 20,
      }}
      onClick={e => {
        e.stopPropagation();
        if (draggingWireFrom) {
          completeWireTo(compId, pin.id);
        } else {
          startWireFrom(compId, pin.id);
        }
      }}
      onMouseEnter={() => setHoveredPin({ compId, pinId: pin.id })}
      onMouseLeave={() => setHoveredPin(null)}
      title={`${pin.label} (${pin.role})`}
    >
      <div
        className={`w-full h-full rounded-full border transition-all cursor-crosshair ${
          isHovered || isWiring
            ? 'border-white scale-150 z-30'
            : 'border-gray-900/50'
        }`}
        style={{ backgroundColor: pinColor(pin.role) }}
      />
      {isHovered && (
        <div className="absolute left-3 -top-4 text-xs text-white bg-gray-900 px-1 rounded whitespace-nowrap pointer-events-none z-50">
          {pin.label}
        </div>
      )}
    </div>
  );
}

// ─── Wire ─────────────────────────────────────────────────────────────────────
function WireColors(fromRole: PinDef['role'], toRole: PinDef['role']): string {
  if (fromRole === 'gnd' || toRole === 'gnd') return '#374151';
  if (fromRole === 'power-3v3' || fromRole === 'vcc' || toRole === 'power-3v3' || toRole === 'vcc') return '#ef4444';
  if (fromRole === 'power-5v' || fromRole === 'vin' || toRole === 'power-5v') return '#f97316';
  return '#22c55e';
}

// ─── Main workspace ───────────────────────────────────────────────────────────
export function Workspace() {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: 'workspace' });
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    components, wires, draggingWireFrom, hoveredPin,
    completeWireTo, cancelWire, removeComponent, moveComponent,
    simState,
  } = useSchematicStore();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ compId: string; offX: number; offY: number } | null>(null);
  const [selectedComp, setSelectedComp] = useState<string | null>(null);

  const getCanvasPos = useCallback((e: React.MouseEvent | MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const pos = getCanvasPos(e);
    setMousePos(pos);
    if (dragging) {
      moveComponent(dragging.compId, pos.x - dragging.offX, pos.y - dragging.offY);
    }
  }, [dragging, getCanvasPos, moveComponent]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleCanvasClick = () => {
    if (draggingWireFrom) { cancelWire(); }
    setSelectedComp(null);
  };

  // Compute absolute pin position for a given comp+pin
  function pinAbsPos(compId: string, pinId: string) {
    const comp = components.find(c => c.id === compId);
    if (!comp) return null;
    const def = getComponentDef(comp.type);
    const pin = def.pins.find(p => p.id === pinId);
    if (!pin) return null;
    return { x: comp.x + pin.x, y: comp.y + pin.y, role: pin.role };
  }

  const draggingFrom = draggingWireFrom ? pinAbsPos(draggingWireFrom.compId, draggingWireFrom.pinId) : null;

  return (
    <div
      ref={node => { setDropRef(node); (canvasRef as any).current = node; }}
      className={`flex-1 relative overflow-hidden bg-gray-950 ${isOver ? 'bg-gray-900' : ''}`}
      style={{
        backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
      onClick={handleCanvasClick}
      onContextMenu={e => e.preventDefault()}
    >
      {/* SVG wire layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {wires.map(wire => {
          const from = pinAbsPos(wire.fromCompId, wire.fromPinId);
          const to = pinAbsPos(wire.toCompId, wire.toPinId);
          if (!from || !to) return null;
          const color = WireColors(from.role, to.role);
          const mx = (from.x + to.x) / 2;
          return (
            <g key={wire.id}>
              <path
                d={`M ${from.x} ${from.y} C ${mx} ${from.y}, ${mx} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          );
        })}
        {/* Wire being drawn */}
        {draggingFrom && (
          <path
            d={`M ${draggingFrom.x} ${draggingFrom.y} L ${mousePos.x} ${mousePos.y}`}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="6 3"
            strokeLinecap="round"
            opacity="0.8"
          />
        )}
      </svg>

      {/* Components */}
      {components.map(comp => {
        const def = getComponentDef(comp.type);
        const isSelected = selectedComp === comp.id;

        return (
          <div
            key={comp.id}
            className="absolute"
            style={{ left: comp.x, top: comp.y, zIndex: isSelected ? 10 : 8 }}
            onMouseDown={e => {
              e.stopPropagation();
              if (draggingWireFrom) return;
              setSelectedComp(comp.id);
              const def2 = getComponentDef(comp.type);
              setDragging({ compId: comp.id, offX: e.nativeEvent.offsetX, offY: e.nativeEvent.offsetY });
            }}
            onContextMenu={e => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm(`Удалить «${def.label}»?`)) removeComponent(comp.id);
            }}
          >
            {/* Visual body */}
            <div style={{ width: def.width, height: def.height, position: 'relative' }}>
              <ComponentBody comp={comp} isSelected={isSelected} simState={simState} />

              {/* Pins */}
              {def.pins.map(pin => (
                <PinDot
                  key={pin.id}
                  pin={pin}
                  compId={comp.id}
                  isHovered={hoveredPin?.compId === comp.id && hoveredPin?.pinId === pin.id}
                  isWiring={draggingWireFrom?.compId === comp.id && draggingWireFrom?.pinId === pin.id}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Hints */}
      {draggingWireFrom && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800/90 border border-green-600 rounded-full text-xs text-green-400 pointer-events-none z-50">
          Кликните на другой пин для соединения · Esc для отмены
        </div>
      )}
      {components.length === 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800/70 border border-gray-700 rounded-full text-xs text-gray-400 pointer-events-none">
          Перетащите компоненты из панели слева
        </div>
      )}
    </div>
  );
}
