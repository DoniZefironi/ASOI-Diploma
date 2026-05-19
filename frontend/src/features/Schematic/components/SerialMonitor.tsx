'use client';
import { useEffect, useRef } from 'react';
import { useSchematicStore } from '../store/useSchematicStore';

export function SerialMonitor() {
  const serialLog = useSchematicStore(s => s.simState.serialLog);
  const clearSerial = useSchematicStore(s => s.clearSerial);
  const running = useSchematicStore(s => s.simState.running);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [serialLog]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Serial Monitor</span>
          {running && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        <button
          onClick={clearSerial}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Очистить
        </button>
      </div>
      <div
        ref={ref}
        className="flex-1 overflow-y-auto p-2 font-mono text-xs bg-black/40"
      >
        {serialLog.length === 0 ? (
          <p className="text-gray-600 italic">Запустите симуляцию для вывода данных...</p>
        ) : (
          serialLog.map((line, i) => (
            <div key={i} className="text-green-400 leading-5 break-all">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
