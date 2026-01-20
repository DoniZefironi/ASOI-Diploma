'use client';

import dynamic from 'next/dynamic';
import { useSchematicStore } from '../store/useSchematicStore';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export function CodeEditor() {
  const { arduinoCode, updateCode } = useSchematicStore();

  return (
    <div className="h-48 border-t bg-gray-950">
      <Editor
        height="100%"
        language="cpp"
        value={arduinoCode}
        onChange={(value) => updateCode(value || '')}
        options={{ minimap: { enabled: false }, fontSize: 14 }}
        theme="vs"
      />
    </div>
  );
}