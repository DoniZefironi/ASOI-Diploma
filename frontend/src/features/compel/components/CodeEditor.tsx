// src/features/compel/components/CodeEditor.tsx
'use client';

import { useCodeStore } from '../stores/useCodeStore';
import { ChangeEvent } from 'react';

export default function CodeEditor() {
  const { code, setCode, language } = useCodeStore();

  const placeholders: Record<string, string> = {
    js: 'console.log("Hello, World!");',
    python: 'print("Hello, World!")',
    cpp: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setCode(textarea.value);

    textarea.style.height = 'auto';

    const maxHeight = 600;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  const placeholder = placeholders[language] || 'Введите код...';

  return (
    <textarea
      value={code}
      onChange={handleTextareaChange}
      className="w-full p-4 border rounded font-mono text-sm bg-gray-800 text-white resize-none"
      placeholder={placeholder}
      rows={3}
      style={{ minHeight: '100px' }}
    />
  );
}