'use client';
import { useEffect, useRef } from 'react';
import { useSchematicStore } from '../store/useSchematicStore';
import { getComponentDef } from '../engine/componentDefs';

export function SensorPanel() {
  const components = useSchematicStore(s => s.components);
  const sensorValues = useSchematicStore(s => s.simState.sensorValues);
  const setSensorValue = useSchematicStore(s => s.setSensorValue);
  const simState = useSchematicStore(s => s.simState);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (simState.buzzerOn) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      // Stop previous oscillator if any
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(simState.buzzerFreq ?? 1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;
      gainRef.current = gain;
    } else {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      oscillatorRef.current = null;
    }
  }, [simState.buzzerOn, simState.buzzerFreq]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      oscillatorRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  const sensorComps = components.filter(c => {
    const def = getComponentDef(c.type);
    return def.sensorKeys && def.sensorKeys.length > 0;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-3 py-2 border-b border-gray-800">
        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Датчики</span>
      </div>

      <div className="p-2 space-y-3 flex-1 overflow-y-auto">
        {sensorComps.length === 0 ? (
          <p className="text-xs text-gray-600 italic p-2">Добавьте датчики на схему</p>
        ) : (
          sensorComps.map(comp => {
            const def = getComponentDef(comp.type);
            if (!def.sensorKeys) return null;
            return (
              <div key={comp.id} className="bg-gray-800/60 rounded-lg p-2 space-y-2">
                <p className="text-xs font-semibold text-gray-300">{def.label}</p>
                {def.sensorKeys.map(key => {
                  const [min, max] = def.sensorRanges?.[key] ?? [0, 100];
                  const label = def.sensorLabels?.[key] ?? key;
                  const value = sensorValues[comp.id]?.[key] ?? def.sensorDefaults?.[key] ?? 0;

                  if (key === 'pressed') {
                    // Button — toggle
                    return (
                      <div key={key} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-400">{label}</span>
                        <button
                          onMouseDown={() => setSensorValue(comp.id, key, 1)}
                          onMouseUp={() => setSensorValue(comp.id, key, 0)}
                          onMouseLeave={() => setSensorValue(comp.id, key, 0)}
                          onTouchStart={() => setSensorValue(comp.id, key, 1)}
                          onTouchEnd={() => setSensorValue(comp.id, key, 0)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            value === 1
                              ? 'bg-yellow-500 text-black'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {value === 1 ? 'Нажата' : 'Отпущена'}
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">{label}</span>
                        <span className="text-xs font-mono text-blue-300">{Number(value).toFixed(key === 'temperature' ? 1 : 0)}</span>
                      </div>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        step={key === 'temperature' ? 0.5 : 1}
                        value={value}
                        onChange={e => setSensorValue(comp.id, key, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-0.5">
                        <span>{min}</span>
                        <span>{max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })
        )}

        {/* LED states */}
        {Object.keys(simState.ledStates).length > 0 && (
          <div className="bg-gray-800/60 rounded-lg p-2">
            <p className="text-xs font-semibold text-gray-300 mb-2">LED состояния</p>
            <div className="space-y-1">
              {Object.entries(simState.ledStates).map(([compId, on]) => {
                const comp = components.find(c => c.id === compId);
                if (!comp) return null;
                const def = getComponentDef(comp.type);
                const color = comp.type === 'led-red' ? 'bg-red-500' :
                              comp.type === 'led-green' ? 'bg-green-500' :
                              comp.type === 'led-blue' ? 'bg-blue-500' : 'bg-yellow-400';
                return (
                  <div key={compId} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${on ? color : 'bg-gray-700'} ${on ? 'shadow-lg' : ''}`} />
                    <span className="text-xs text-gray-400">{def.label}</span>
                    <span className={`text-xs ${on ? 'text-green-400' : 'text-gray-600'}`}>{on ? 'ON' : 'OFF'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Servo */}
        {Object.keys(simState.servoAngles).length > 0 && (
          <div className="bg-gray-800/60 rounded-lg p-2">
            <p className="text-xs font-semibold text-gray-300 mb-1">Сервоприводы</p>
            {Object.entries(simState.servoAngles).map(([compId, angle]) => (
              <div key={compId} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Угол</span>
                <span className="text-xs font-mono text-blue-300">{angle}°</span>
              </div>
            ))}
          </div>
        )}

        {/* LCD */}
        {simState.lcdText && (simState.lcdText[0] || simState.lcdText[1]) && (
          <div className="bg-gray-800/60 rounded-lg p-2">
            <p className="text-xs font-semibold text-gray-300 mb-2">LCD 16×2</p>
            <div className="bg-green-950 border border-green-800 rounded p-2 font-mono text-xs text-green-300">
              <div className="h-4 overflow-hidden">{(simState.lcdText[0] || '').padEnd(16, ' ')}</div>
              <div className="h-4 overflow-hidden">{(simState.lcdText[1] || '').padEnd(16, ' ')}</div>
            </div>
          </div>
        )}

        {/* Buzzer */}
        {simState.buzzerOn && (
          <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-2">
            <p className="text-xs text-yellow-400 animate-pulse">🔔 Buzzer активен</p>
          </div>
        )}

        {/* Relay states */}
        {Object.keys(simState.relayStates).length > 0 && (
          <div className="bg-gray-800/60 rounded-lg p-2">
            <p className="text-xs font-semibold text-gray-300 mb-1">Реле</p>
            {Object.entries(simState.relayStates).map(([compId, on]) => (
              <div key={compId} className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Реле</span>
                <span className={`text-xs font-medium ${on ? 'text-green-400' : 'text-gray-500'}`}>
                  {on ? 'ЗАМКНУТО' : 'РАЗОМКНУТО'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
