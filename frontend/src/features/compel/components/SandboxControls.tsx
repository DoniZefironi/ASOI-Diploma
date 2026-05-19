// frontend/src/features/compel/components/SandboxControls.tsx
'use client';

import { useCodeStore } from '../stores/useCodeStore';
import { apiClient } from '../../../shared/api/client';

export default function SandboxControls() {
  const { code, setOutput, language } = useCodeStore();

  const runCode = async () => {
    setOutput('Выполняю код...');
    try {
      const result = await apiClient.post('/compiler/execute', {
        code,
        language,
      });

      if (result.status === 'success') {
        setOutput(result.output || 'Код выполнен успешно');
      } else {
        setOutput(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      setOutput(`Сетевая ошибка: ${errorMessage}`);
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
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <label>Язык: </label>
        <select
          value={language}
          onChange={(e) => useCodeStore.getState().setLanguage(e.target.value)} 
          className="border rounded p-1 bg-gray-950"
        >
          <option value="js">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="flex gap-2">
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
    </div>
  );
}