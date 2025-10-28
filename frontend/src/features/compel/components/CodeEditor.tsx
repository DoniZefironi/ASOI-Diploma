// src/features/compel/components/CodeEditor.tsx
'use client';

import { useCodeStore } from '../stores/useCodeStore';

export default function CodeEditor() {
  const { code, setCode } = useCodeStore();

  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      className="w-full h-64 p-4 border rounded font-mono text-sm bg-gray-800"
      placeholder="Введи JavaScript код здесь..."
    />
  );
}