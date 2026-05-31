'use client';

import { useState, useRef, useEffect } from 'react';
import { useCodeStore } from '../stores/useCodeStore';
import { apiClient } from '../../../shared/api/client';
import { Play, Download, Upload, RotateCcw, Terminal, Copy, Check } from 'lucide-react';

const LANGUAGES = [
  { value: 'js',     label: 'JavaScript', ext: '.js',   color: '#f7df1e', comment: '// JavaScript' },
  { value: 'python', label: 'Python',     ext: '.py',   color: '#3776ab', comment: '# Python' },
  { value: 'cpp',    label: 'C++',        ext: '.cpp',  color: '#00599c', comment: '// C++' },
  { value: 'java',   label: 'Java',       ext: '.java', color: '#ed8b00', comment: '// Java' },
];

const PLACEHOLDERS: Record<string, string> = {
  js:     'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  cpp:    '#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  java:   'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
};

export default function CompilerPage() {
  const { code, setCode, output, setOutput, language, reset } = useCodeStore();
  const [isRunning, setIsRunning]   = useState(false);
  const [copied, setCopied]         = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lang = LANGUAGES.find(l => l.value === language) ?? LANGUAGES[0];

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 300)}px`;
  }, [code]);

  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('Выполняю…');
    try {
      const result = await apiClient.post('/compiler/execute', { code, language });
      setOutput(result.status === 'success'
        ? (result.output || 'Код выполнен без вывода')
        : `Ошибка: ${result.error}`);
    } catch (e: any) {
      setOutput(`Сетевая ошибка: ${e.message ?? 'Неизвестная ошибка'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `code${lang.ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  const loadCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCode(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart, end = el.selectionEnd;
      const next = code.substring(0, start) + '    ' + code.substring(end);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = start + 4; });
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
  };

  const isError = output.startsWith('Ошибка') || output.startsWith('Сетевая ошибка');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
        background: 'var(--color-canvas-overlay)', borderBottom: '1px solid var(--color-border-default)',
        flexWrap: 'wrap',
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <Terminal size={16} color="var(--color-accent-fg)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-fg-default)' }}>Компилятор</span>
        </div>

        {/* Language selector */}
        <div style={{ display: 'flex', gap: 4 }}>
          {LANGUAGES.map(l => (
            <button
              key={l.value}
              onClick={() => { useCodeStore.getState().setLanguage(l.value); setCode(PLACEHOLDERS[l.value]); }}
              style={{
                padding: '4px 12px', fontSize: 12, fontWeight: 500, borderRadius: 6, cursor: 'pointer',
                background: language === l.value ? 'var(--color-accent-emphasis)' : 'transparent',
                color:      language === l.value ? '#fff' : 'var(--color-fg-muted)',
                border: `1px solid ${language === l.value ? 'transparent' : 'var(--color-border-default)'}`,
                transition: 'all 120ms',
              }}
            >
              <span style={{ marginRight: 5, fontSize: 10, color: l.color }}>●</span>
              {l.label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <IconBtn onClick={copyCode} title={copied ? 'Скопировано!' : 'Копировать код'}>
            {copied ? <Check size={14} color="var(--color-success-fg)" /> : <Copy size={14} />}
          </IconBtn>
          <IconBtn onClick={() => fileInputRef.current?.click()} title="Загрузить файл">
            <Upload size={14} />
          </IconBtn>
          <IconBtn onClick={downloadCode} title="Скачать код">
            <Download size={14} />
          </IconBtn>
          <IconBtn onClick={() => { reset(); setOutput(''); }} title="Сбросить">
            <RotateCcw size={14} />
          </IconBtn>
          <input ref={fileInputRef} type="file" accept=".js,.py,.cpp,.java,.ts" onChange={loadCode} style={{ display: 'none' }} />

          {/* Run button */}
          <button
            onClick={runCode}
            disabled={isRunning}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 18px', fontSize: 13, fontWeight: 600,
              background: isRunning ? 'var(--color-success-muted)' : 'var(--color-success-emphasis)',
              color: '#fff', border: 'none', borderRadius: 8, cursor: isRunning ? 'not-allowed' : 'pointer',
              transition: 'background 120ms',
            }}
            onMouseEnter={e => !isRunning && (e.currentTarget.style.background = 'var(--color-success-fg)')}
            onMouseLeave={e => !isRunning && (e.currentTarget.style.background = 'var(--color-success-emphasis)')}
          >
            <Play size={13} /> {isRunning ? 'Выполняется…' : 'Запустить'}
            <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>Ctrl+↵</span>
          </button>
        </div>
      </div>

      {/* ── Editor + Output ────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 0 }}>

        {/* Editor pane */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border-default)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: 'var(--color-canvas-inset)', borderBottom: '1px solid var(--color-border-muted)' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Редактор · {lang.label}
            </span>
            <span style={{ fontSize: 10, color: 'var(--color-fg-subtle)' }}>
              {code.split('\n').length} строк
            </span>
          </div>

          {/* Code area with line numbers */}
          <div style={{ flex: 1, display: 'flex', background: 'var(--color-canvas-inset)', overflow: 'auto', position: 'relative' }}>
            {/* Line numbers */}
            <div style={{ padding: '16px 8px 16px 12px', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace', fontSize: 13, lineHeight: '1.6', color: 'var(--color-fg-subtle)', userSelect: 'none', minWidth: 40, textAlign: 'right', borderRight: '1px solid var(--color-border-default)', background: 'var(--color-canvas-inset)', flexShrink: 0 }}>
              {code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKey}
              placeholder={PLACEHOLDERS[language]}
              spellCheck={false}
              style={{
                flex: 1, padding: '16px 16px 16px 12px', border: 'none', outline: 'none',
                background: 'transparent', color: 'var(--color-fg-default)', resize: 'none',
                fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace', fontSize: 13, lineHeight: '1.6',
                caretColor: 'var(--color-accent-fg)', minHeight: 400,
              }}
            />
          </div>
        </div>

        {/* Output pane */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: 'var(--color-canvas-inset)', borderBottom: '1px solid var(--color-border-muted)' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: output && !isRunning ? (isError ? '#f85149' : '#3fb950') : '#484f58', display: 'inline-block' }} />
              Вывод
            </span>
            {output && (
              <button onClick={() => setOutput('')} style={{ fontSize: 11, color: 'var(--color-fg-subtle)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Очистить
              </button>
            )}
          </div>
          <pre style={{
            flex: 1, margin: 0, padding: '16px', overflow: 'auto',
            background: 'var(--color-canvas-inset)', color: 'var(--color-fg-default)',
            fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace', fontSize: 13, lineHeight: '1.6',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 400,
          }}>
            {isRunning
              ? <span style={{ color: '#d29922' }}>⏳ Выполняется…</span>
              : output
                ? <span style={{ color: isError ? '#f85149' : '#3fb950' }}>{output}</span>
                : <span style={{ color: 'var(--color-fg-subtle)' }}>Результат выполнения появится здесь{'\n'}Нажмите «Запустить» или Ctrl+↵</span>
            }
          </pre>
        </div>
      </div>

      {/* ── Status bar ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '4px 20px',
        background: 'var(--color-accent-emphasis)', fontSize: 11, color: 'rgba(255,255,255,0.8)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3fb950', display: 'inline-block' }} />
          {lang.label}
        </span>
        <span>UTF-8</span>
        <span>Tab: 4 пробела</span>
        <div style={{ flex: 1 }} />
        <span>Ctrl+↵ — запустить</span>
      </div>
    </div>
  );
}

// ── Micro UI ──────────────────────────────────────────────────────
function IconBtn({ onClick, title, children }: { onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer', color: 'var(--color-fg-muted)', transition: 'all 100ms' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-neutral-2)'; e.currentTarget.style.color = 'var(--color-fg-default)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
    >
      {children}
    </button>
  );
}
