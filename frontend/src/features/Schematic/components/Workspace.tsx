'use client';

import { useDroppable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { useSchematicStore } from '../store/useSchematicStore';
import { Component, Pin, Wire } from '../types';
import { DraggableComponent } from './DraggableComponent';

export function Workspace() {
  const droppable = useDroppable({
    id: 'workspace',
    data: { type: 'workspace' }
  });
  const { setNodeRef, isOver } = droppable;

  const {
    components,
    wires,
    draggingWireFrom,
    hoveredPin,
    startWireFrom,
    completeWireTo,
    setHoveredPin,
    simulationRunning,
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
    console.log('Pin click:', compId, pin.id);
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

    console.log('Rendering wire:', { x1, y1, x2, y2 });

    return (
      <line
        key={wire.id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#3B82F6"
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  };

  const renderDraggingWire = () => {
    if (!draggingWireFrom || !hoveredPin) return null;

    const fromComp = components.find(c => c.id === draggingWireFrom.compId);
    const toComp = components.find(c => c.id === hoveredPin.compId);
    const fromPin = fromComp?.pins.find(p => p.id === draggingWireFrom.pinId);
    const toPin = toComp?.pins.find(p => p.id === hoveredPin.pinId);

    if (!fromComp || !toComp || !fromPin || !toPin) return null;

    const x1 = fromComp.x + fromPin.x;
    const y1 = fromComp.y + fromPin.y;
    const x2 = toComp.x + toPin.x;
    const y2 = toComp.y + toPin.y;

    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#10B981"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    );
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-gray-800 relative overflow-hidden ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ minHeight: '600px' }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {wires.map(renderWire)}
        {renderDraggingWire()}
      </svg>

      {components.map((comp) => (
        <DraggableComponent key={comp.id} component={comp}>
          <div 
            className="flex flex-col items-center p-3 bg-white rounded-lg shadow-md border-2 border-gray-300"
            style={{ 
              position: 'absolute',
              left: comp.x,
              top: comp.y,
              transform: 'none' // ✅ Убираем лишние трансформы
            }}
          >
            {comp.type === 'arduino-un' && (
              <div className="p-3 bg-blue-100 border border-blue-300 rounded text-sm font-medium text-black">
                Arduino Uno
              </div>
            )}
            {comp.type === 'led' && (
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 ${
                    ledOn ? 'bg-red-500 border-red-700' : 'bg-gray-300 border-gray-500'
                  }`}
                />
                <span className="text-xs mt-1 text-black">LED</span>
              </div>
            )}
            {comp.type === 'button' && (
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded border-2 flex items-center justify-center ${
                    buttonPressed ? 'bg-green-400 border-green-600' : 'bg-gray-200 border-gray-400'
                  }`}
                >
                  <span className="text-lg">⦿</span>
                </div>
                <span className="text-xs mt-1 text-black">Button</span>
              </div>
            )}
            {comp.type === 'resistor' && (
              <div className="flex flex-col items-center">
                <div className="px-3 py-2 bg-orange-100 border border-orange-300 rounded text-xs font-medium text-black">
                  Resistor
                </div>
                <span className="text-xs mt-1 text-black">220Ω</span>
              </div>
            )}

            <div className="mt-2 flex gap-2">
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
        </DraggableComponent>
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
    <button
      onClick={() => onClick(compId, pin)}
      onMouseEnter={() => useSchematicStore.getState().setHoveredPin({ compId, pinId: pin.id })}
      onMouseLeave={() => useSchematicStore.getState().setHoveredPin(null)}
      className={`w-4 h-4 rounded-full border-2 ${
        pin.type === 'ground' ? 'bg-black border-gray-800' :
        pin.type === 'output' ? 'bg-green-500 border-green-700' :
        pin.type === 'input' ? 'bg-blue-500 border-blue-700' : 'bg-purple-500 border-purple-700'
      } ${isHovered ? 'ring-2 ring-yellow-400 scale-125' : ''} transition-all duration-200`}
      title={`${pin.id} (${pin.type})`}
    />
  );
}