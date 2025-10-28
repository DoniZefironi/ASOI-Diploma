// src/features/compel/components/OutputDisplay.tsx
'use client';

import { useCodeStore } from '../stores/useCodeStore';

export default function OutputDisplay() {
  const { output } = useCodeStore();

  return (
    <pre className="w-full p-4 bg-gray-800 text-green-400 font-mono text-sm h-32 overflow-auto">
      {output || 'Вывод появится здесь...'}
    </pre>
  );
}