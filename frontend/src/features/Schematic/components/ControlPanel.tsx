'use client';
import { useSchematicStore } from '../store/useSchematicStore';
import { runSimulation } from '../engine/simulator';

export function ControlPanel() {
  const {
    simState, code, components, wires,
    setRunning, setAbortController, abortController,
    updateSimState, clearSerial,
  } = useSchematicStore();

  const running = simState.running;

  const handleStart = async () => {
    clearSerial();
    updateSimState({
      pinValues: {}, analogValues: {}, ledStates: {}, relayStates: {},
      servoAngles: {}, buzzerOn: false, lcdText: ['', ''], error: null,
    });

    const ac = new AbortController();
    setAbortController(ac);
    setRunning(true);

    try {
      await runSimulation(
        code,
        components,
        wires,
        () => useSchematicStore.getState().simState.sensorValues,
        patch => useSchematicStore.getState().updateSimState(patch),
        line => useSchematicStore.getState().appendSerial(line),
        ac.signal,
      );
    } catch (err: any) {
      if (err?.message !== 'SIMULATION_STOPPED') {
        useSchematicStore.getState().updateSimState({ error: String(err?.message ?? err) });
      }
    } finally {
      setRunning(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    abortController?.abort();
    setRunning(false);
    setAbortController(null);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-950 border-t border-gray-800">
      {!running ? (
        <button
          onClick={handleStart}
          className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <span>▶</span> Запустить симуляцию
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="flex items-center gap-2 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors animate-pulse"
        >
          <span>■</span> Остановить
        </button>
      )}

      {running && (
        <div className="flex items-center gap-2 text-xs text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          Симуляция запущена
        </div>
      )}

      {simState.error && (
        <div className="flex-1 text-xs text-red-400 bg-red-900/20 border border-red-800 rounded px-2 py-1 font-mono truncate">
          ⚠ {simState.error}
        </div>
      )}

      <div className="ml-auto text-xs text-gray-600">
        ПКМ по компоненту — удалить · Клик на пин → другой пин — соединить
      </div>
    </div>
  );
}
