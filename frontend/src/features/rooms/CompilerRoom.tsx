'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCodeStore } from '@/features/compel/stores/useCodeStore';
import { apiClient } from '@/shared/api/client';
import { Play, Download, RotateCcw, Loader2, Check } from 'lucide-react';
import type { Room } from './api';

const LANGUAGES = [
  { value: 'js',     label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'cpp',    label: 'C++' },
  { value: 'java',   label: 'Java' },
];

interface Props {
  room: Room;
  canEdit: boolean;
  pushState: (state: any) => void;
  onStateSync: (state: any) => void;
}

export default function CompilerRoom({ room, canEdit, pushState, onStateSync: _ }: Props) {
  const { code, setCode, output, setOutput, language, reset } = useCodeStore();
  const [isRunning, setIsRunning]     = useState(false);
  const [copied, setCopied]           = useState(false);
  const pushTimer                     = useRef<NodeJS.Timeout | null>(null);
  const skipSync                      = useRef(false);

  // Sync code changes to room state (debounced)
  useEffect(() => {
    if (!canEdit) return;
    if (skipSync.current) { skipSync.current = false; return; }
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      pushState({ code, language });
    }, 800);
    return () => { if (pushTimer.current) clearTimeout(pushTimer.current); };
  }, [code, language, canEdit]);

  // Receive state from other participants
  useEffect(() => {
    const originalOnSync = (state: any) => {
      if (!state || !state.code) return;
      skipSync.current = true;
      setCode(state.code);
      if (state.language) useCodeStore.getState().setLanguage(state.language);
    };
    // Register handler in useRoom via callback
    return () => {};
  }, []);

  // Load saved state from room
  useEffect(() => {
    if (room.state?.code) {
      skipSync.current = true;
      setCode(room.state.code);
      if (room.state.language) useCodeStore.getState().setLanguage(room.state.language);
    }
  }, [room.id]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Выполняю...');
    try {
      const r = await apiClient.post('/compiler/execute', { code, language });
      setOutput(r.status === 'success' ? r.output || '(нет вывода)' : `Ошибка: ${r.error}`);
    } catch (e: any) { setOutput(`Сетевая ошибка: ${e.message}`); }
    finally { setIsRunning(false); }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget, s = el.selectionStart, end = el.selectionEnd;
      const next = code.substring(0, s) + '    ' + code.substring(end);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };

  const downloadCode = () => {
    const exts: Record<string, string> = { js: '.js', python: '.py', cpp: '.cpp', java: '.java' };
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = `code${exts[language] ?? '.txt'}`; a.click();
    URL.revokeObjectURL(url);
  };

  const isError = output.startsWith('Ошибка') || output.startsWith('Сетевая');
  const lines   = code.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0d1117', color: '#e6edf3' }}>

      {/* Controls bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#161b22', borderBottom: '1px solid #21262d', flexShrink: 0 }}>
        <select value={language} onChange={e => useCodeStore.getState().setLanguage(e.target.value)} disabled={!canEdit}
          style={{ fontSize: 12, background: '#21262d', border: '1px solid #30363d', borderRadius: 6, color: '#e6edf3', padding: '4px 8px', cursor: canEdit ? 'pointer' : 'not-allowed' }}>
          {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>

        {!canEdit && <span style={{ fontSize: 11, color: '#6e7681', background: '#21262d', padding: '2px 8px', borderRadius: 20 }}>Только просмотр</span>}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button onClick={copyCode} title={copied ? 'Скопировано' : 'Копировать'}
            style={{ padding: '5px 10px', fontSize: 11, background: '#21262d', color: copied ? '#3fb950' : '#8b949e', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}>
            {copied ? <Check size={12} /> : 'Копировать'}
          </button>
          <button onClick={downloadCode}
            style={{ padding: '5px 10px', fontSize: 11, background: '#21262d', color: '#8b949e', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}>
            <Download size={12} />
          </button>
          <button onClick={() => { reset(); setOutput(''); }}
            style={{ padding: '5px 10px', fontSize: 11, background: '#21262d', color: '#8b949e', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}>
            <RotateCcw size={12} />
          </button>
          <button onClick={runCode} disabled={isRunning}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 14px', fontSize: 12, fontWeight: 600, background: isRunning ? '#238636' : '#2da44e', color: '#fff', border: 'none', borderRadius: 6, cursor: isRunning ? 'not-allowed' : 'pointer' }}>
            {isRunning ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={12} />}
            {isRunning ? 'Выполняется...' : 'Запустить'}
            <span style={{ fontSize: 10, opacity: 0.7 }}>Ctrl+↵</span>
          </button>
        </div>
      </div>

      {/* Editor + Output */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>

        {/* Editor */}
        <div style={{ display: 'flex', borderRight: '1px solid #21262d', background: '#010409', overflow: 'auto' }}>
          <div style={{ padding: '14px 8px 14px 12px', fontFamily: 'monospace', fontSize: 13, lineHeight: '1.6', color: '#444c56', userSelect: 'none', minWidth: 44, textAlign: 'right', borderRight: '1px solid #21262d', background: '#010409', flexShrink: 0 }}>
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <textarea
            value={code}
            onChange={e => canEdit && setCode(e.target.value)}
            onKeyDown={handleKey}
            readOnly={!canEdit}
            spellCheck={false}
            style={{ flex: 1, padding: '14px 14px 14px 10px', border: 'none', outline: 'none', background: 'transparent', color: '#e6edf3', resize: 'none', fontFamily: 'monospace', fontSize: 13, lineHeight: '1.6', caretColor: '#58a6ff', cursor: canEdit ? 'text' : 'default', minHeight: '100%' }}
          />
        </div>

        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#010409' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', background: '#161b22', borderBottom: '1px solid #21262d', flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: output && !isRunning ? (isError ? '#f85149' : '#3fb950') : '#484f58', display: 'inline-block' }} />
              Вывод
            </span>
            {output && <button onClick={() => setOutput('')} style={{ fontSize: 11, color: '#6e7681', background: 'none', border: 'none', cursor: 'pointer' }}>Очистить</button>}
          </div>
          <pre style={{ flex: 1, margin: 0, padding: '14px', overflow: 'auto', color: '#e6edf3', fontFamily: 'monospace', fontSize: 13, lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {isRunning
              ? <span style={{ color: '#d29922' }}>⏳ Выполняется…</span>
              : output
                ? <span style={{ color: isError ? '#f85149' : '#3fb950' }}>{output}</span>
                : <span style={{ color: '#444c56' }}>Результат появится здесь{'\n'}Нажмите «Запустить» или Ctrl+↵</span>
            }
          </pre>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
