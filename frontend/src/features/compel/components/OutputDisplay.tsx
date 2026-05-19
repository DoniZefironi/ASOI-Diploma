// src/features/compel/components/OutputDisplay.tsx
'use client';

import { useCodeStore } from '../stores/useCodeStore';
import { useEffect, useRef } from 'react';

export default function OutputDisplay() {
  const { output } = useCodeStore();
  const preRef = useRef<HTMLPreElement>(null);

  const formatOutput = (output: any): string => {
    if (typeof output === 'string') {
      return output;
    }
    if (typeof output === 'object' && output !== null) {
      try {
        return JSON.stringify(output, null, 2);
      } catch {
        return String(output);
      }
    }
    return String(output);
  };

  useEffect(() => {
    const preElement = preRef.current;
    if (preElement) {
      preElement.style.height = 'auto';

      const maxHeight = 400;
      const newHeight = Math.min(preElement.scrollHeight, maxHeight);
      preElement.style.height = `${newHeight}px`;
    }
  }, [output]); 

  const displayText = output ? formatOutput(output) : 'Вывод появится здесь...';

  return (
    <pre 
      ref={preRef}
      className="w-full p-4 bg-gray-800 text-green-400 font-mono text-sm overflow-auto border rounded"
      style={{ 
        minHeight: '80px',
        maxHeight: '400px',
        transition: 'height 0.2s ease'
      }}
    >
      {displayText}
    </pre>
  );
}