'use client';
import dynamic from 'next/dynamic';
import { useSchematicStore } from '../store/useSchematicStore';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export function CodeEditor() {
  const { code, updateCode } = useSchematicStore();

  return (
    <div className="h-52 border-t border-gray-800 bg-gray-950 flex flex-col">
      <div className="flex items-center px-3 py-1 border-b border-gray-800">
        <span className="text-xs text-gray-500 font-mono">sketch.ino</span>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language="cpp"
          value={code}
          onChange={value => updateCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
