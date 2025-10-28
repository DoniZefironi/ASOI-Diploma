// components/SandboxControls.tsx
'use client';

import { useCodeStore } from '../stores/useCodeStore';

export default function SandboxControls() {
  const { code, setOutput } = useCodeStore();

  const runCode = () => {
    setOutput('');

    let originalLog: ((...data: any[]) => void) | undefined;
    let originalError: ((...data: any[]) => void) | undefined;
    let originalWarn: ((...data: any[]) => void) | undefined;

    try {
      new Function(code);
    } catch (syntaxError: any) {
      setOutput(`[Синтаксическая ошибка]\n${syntaxError.name}: ${syntaxError.message}`);
      return;
    }

    try {
      const capturedLogs: string[] = [];

      originalLog = console.log;
      originalError = console.error;
      originalWarn = console.warn;

      console.log = (...args) => capturedLogs.push(args.join(' '));
      console.error = (...args) => capturedLogs.push('ERROR: ' + args.join(' '));
      console.warn = (...args) => capturedLogs.push('WARN: ' + args.join(' '));

      new Function(code)();

      setOutput(capturedLogs.join('\n'));
    } catch (runtimeError: any) {
      setOutput(`[Ошибка выполнения]\n${runtimeError.name}: ${runtimeError.message}`);
    } finally {
      if (originalLog) console.log = originalLog;
      if (originalError) console.error = originalError;
      if (originalWarn) console.warn = originalWarn;
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      useCodeStore.getState().setCode(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={runCode} className="px-4 py-2 bg-blue-500 text-white rounded">
        Выполнить
      </button>
      <button onClick={downloadCode} className="px-4 py-2 bg-green-500 text-white rounded">
        Скачать
      </button>
      <label className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer">
        Загрузить
        <input type="file" accept=".js" onChange={loadCode} className="hidden" />
      </label>
    </div>
  );
}