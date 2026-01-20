'use client';

import { useDroppable } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react'; 
import { useSchematicStore } from '../store/useSchematicStore';
import { Component, Pin, Wire } from '../types';

export function Workspace() {
  const droppable = useDroppable({ id: 'workspace' });
  const { setNodeRef: setDndRef, isOver } = droppable;

  const workspaceRef = useRef<HTMLDivElement>(null);

  const {
    components,
    wires,
    draggingWireFrom,
    hoveredPin,
    startWireFrom,
    completeWireTo,
    setHoveredPin,
    simulationRunning,
    addComponent,
  } = useSchematicStore();

  const [ledOn, setLedOn] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  useEffect(() => {
    if (!simulationRunning) return;
    const id = setInterval(() => {
      const pressed = Math.random() > 0.7;
      setButtonPressed(pressed);
      setLedOn(pressed);
    }, 500);
    return () => clearInterval(id);
  }, [simulationRunning]);

  const handlePinClick = (compId: string, pin: Pin) => {
    if (draggingWireFrom) {
      completeWireTo(compId, pin.id);
    } else {
      startWireFrom(compId, pin.id);
    }
  };

  const renderWire = (wire: Wire) => {
    const fromComp = components.find(c => c.id === wire.from.compId);
    const toComp = components.find(c => c.id === wire.to.compId);
    const fromPin = fromComp?.pins.find(p => p.id === wire.from.pinId);
    const toPin = toComp?.pins.find(p => p.id === wire.to.pinId);

    if (!fromComp || !toComp || !fromPin || !toPin) return null;

    const x1 = fromComp.x + fromPin.x;
    const y1 = fromComp.y + fromPin.y;
    const x2 = toComp.x + toPin.x;
    const y2 = toComp.y + toPin.y;

    return (
      <line
        key={wire.id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#4B5563"
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  };

  return (
    <div
      ref={(node) => {
        setDndRef(node);
        workspaceRef.current = node;
      }}
      className={`flex-1 bg-gray-950 relative overflow-hidden ${isOver ? 'bg-gray-900' : ''}`}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {wires.map(renderWire)}
        {draggingWireFrom && hoveredPin && (
          <line
            x1={components.find(c => c.id === draggingWireFrom.compId)!.x + 
                components.find(c => c.id === draggingWireFrom.compId)!.pins.find(p => p.id === draggingWireFrom.pinId)!.x}
            y1={components.find(c => c.id === draggingWireFrom.compId)!.y + 
                components.find(c => c.id === draggingWireFrom.compId)!.pins.find(p => p.id === draggingWireFrom.pinId)!.y}
            x2={components.find(c => c.id === hoveredPin.compId)!.x + 
                components.find(c => c.id === hoveredPin.compId)!.pins.find(p => p.id === hoveredPin.pinId)!.x}
            y2={components.find(c => c.id === hoveredPin.compId)!.y + 
                components.find(c => c.id === hoveredPin.compId)!.pins.find(p => p.id === hoveredPin.pinId)!.y}
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        )}
      </svg>

      {components.map((comp) => (
        <div
          key={comp.id}
          className="absolute flex flex-col items-center"
          style={{ left: comp.x, top: comp.y }}
        >
          {comp.type === 'arduino-un' && (
            <div className="p-3 bg-blue-100 border rounded">
              Arduino Uno
            </div>
          )}
          {comp.type === 'led' && (
            <div
              className={`w-6 h-6 rounded-full border-2 ${
                ledOn ? 'bg-red-500 border-red-700' : 'bg-gray-300 border-gray-500'
              }`}
            />
          )}
          {comp.type === 'button' && (
            <div
              className={`w-8 h-8 rounded border flex items-center justify-center ${
                buttonPressed ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
            >
              ⬇
            </div>
          )}
          {comp.type === 'resistor' && (
            <div className="px-2 py-1 bg-white border rounded text-xs">Resistor</div>
          )}

          <div className="mt-2 space-y-1">
            {comp.pins.map((pin) => (
              <PinElement
                key={pin.id}
                compId={comp.id}
                pin={pin}
                onClick={handlePinClick}
                isHovered={hoveredPin?.compId === comp.id && hoveredPin?.pinId === pin.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PinElement({
  compId,
  pin,
  onClick,
  isHovered,
}: {
  compId: string;
  pin: Pin;
  onClick: (compId: string, pin: Pin) => void;
  isHovered: boolean;
}) {
  return (
    <div
      onClick={() => onClick(compId, pin)}
      onMouseEnter={() => useSchematicStore.getState().setHoveredPin({ compId, pinId: pin.id })}
      onMouseLeave={() => useSchematicStore.getState().setHoveredPin(null)}
      className={`w-3 h-3 rounded-full cursor-pointer ${
        pin.type === 'ground' ? 'bg-gray-700' :
        pin.type === 'output' ? 'bg-green-500' :
        pin.type === 'input' ? 'bg-blue-500' : 'bg-purple-500'
      } ${isHovered ? 'ring-2 ring-offset-1 ring-blue-400' : ''}`}
      title={pin.id}
    />
  );
}