'use client';

import { useSchematicStore } from '../store/useSchematicStore';

export function ControlPanel() {
  const { simulationRunning, setSimulationRunning } = useSchematicStore();

  return (
    <div className="p-3 border-t bg-gray-950 flex gap-3">
      <button
        onClick={() => setSimulationRunning(!simulationRunning)}
        className={`px-4 py-2 bg-gray-950 rounded font-medium text-white ${
          simulationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
      </button>
    </div>
  );
}