'use client';
import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { ComponentPalette } from './ComponentPalette';
import { Workspace } from './Workspace';
import { CodeEditor } from './CodeEditor';
import { ControlPanel } from './ControlPanel';
import { SerialMonitor } from './SerialMonitor';
import { SensorPanel } from './SensorPanel';
import { useSchematicStore } from '../store/useSchematicStore';
import { ComponentType } from '../types';
import { getComponentDef } from '../engine/componentDefs';

export function SimulatorClientWrapper() {
  const { addComponent, selectedBoard, setSelectedBoard, components } = useSchematicStore();
  const [rightTab, setRightTab] = useState<'serial' | 'sensors'>('serial');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id !== 'workspace') return;
    const type = active.data.current?.type as ComponentType | undefined;
    if (!type) return;

    // Place boards at a fixed position; others get random offset
    const isBoard = type === 'esp32' || type === 'arduino-uno';
    if (isBoard) {
      // Replace existing board
      const existing = components.find(c => c.type === 'esp32' || c.type === 'arduino-uno');
      if (existing) {
        useSchematicStore.getState().removeComponent(existing.id);
      }
      addComponent(type, 300, 80);
    } else {
      addComponent(type, 120 + Math.random() * 200, 100 + Math.random() * 150);
    }
  };

  const boardComp = components.find(c => c.type === 'esp32' || c.type === 'arduino-uno');
  const boardType = (boardComp?.type ?? 'esp32') as 'esp32' | 'arduino-uno';

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-4 px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
          <span className="text-sm font-bold text-blue-400">⚡ IoT Simulator</span>

          {/* Board selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Плата:</span>
            <select
              value={boardType}
              onChange={e => setSelectedBoard(e.target.value as 'esp32' | 'arduino-uno')}
              className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-blue-500"
            >
              <option value="esp32">ESP32</option>
              <option value="arduino-uno">Arduino Uno</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            GPIO
            <span className="w-2 h-2 rounded-full bg-purple-500 ml-2" />
            ADC
            <span className="w-2 h-2 rounded-full bg-red-500 ml-2" />
            VCC
            <span className="w-2 h-2 rounded-full bg-gray-600 ml-2" />
            GND
            <span className="w-2 h-2 rounded-full bg-green-500 ml-2" />
            SIG
          </div>

          <div className="ml-auto text-xs text-gray-600">
            Drag компоненты · Клик на пин — начать провод · ПКМ — удалить
          </div>
        </div>

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Component palette */}
          <ComponentPalette />

          {/* Center: Canvas */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <Workspace />
            <CodeEditor />
            <ControlPanel />
          </div>

          {/* Right: Serial + Sensors */}
          <div className="w-56 bg-gray-950 border-l border-gray-800 flex flex-col">
            {/* Tab switcher */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setRightTab('serial')}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  rightTab === 'serial'
                    ? 'text-green-400 border-b-2 border-green-500'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Serial
              </button>
              <button
                onClick={() => setRightTab('sensors')}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${
                  rightTab === 'sensors'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Датчики
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {rightTab === 'serial' ? <SerialMonitor /> : <SensorPanel />}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
