'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { olympiadsApi, type Olympiad, type OlympiadProblem, type OlympiadSubmission } from '@/shared/api/olympiads';
import { apiClient } from '@/shared/api/client';
import { Play, ChevronLeft, CheckCircle, XCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';

const DIFF_COLOR = { easy: '#3fb950', medium: '#d29922', hard: '#f85149' };
const DIFF_LABEL = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' };

const LANG_PLACEHOLDERS: Record<string, string> = {
  js:     '// JavaScript\nconsole.log("Hello World");',
  python: '# Python\nprint("Hello World")',
  cpp:    '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}',
  java:   'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}',
};

const STATUS_CFG: Record<string, { color: string; label: string; Icon: any }> = {
  accepted:     { color: '#3fb950', label: 'Принято!',        Icon: CheckCircle },
  wrong_answer: { color: '#f85149', label: 'Неверный ответ',  Icon: XCircle },
  error:        { color: '#d29922', label: 'Ошибка выполнения', Icon: AlertTriangle },
  pending:      { color: 'var(--color-fg-muted)', label: 'На проверке',      Icon: Clock },
};

export default function ProblemPage() {
  const { id, pid } = useParams<{ id: string; pid: string }>();
  const router = useRouter();

  const [olympiad, setOlympiad]       = useState<Olympiad | null>(null);
  const [problem,  setProblem]        = useState<OlympiadProblem | null>(null);
  const [code, setCode]               = useState('');
  const [lang, setLang]               = useState('python');
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [result, setResult]           = useState<OlympiadSubmission | null>(null);
  const [prevSubs, setPrevSubs]       = useState<OlympiadSubmission[]>([]);
  const [testOutput, setTestOutput]   = useState('');
  const [testing, setTesting]         = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const oid = Number(id), pid_ = Number(pid);
    Promise.all([
      olympiadsApi.getOne(oid),
      olympiadsApi.getMySubmissions(oid).catch(() => []),
    ]).then(([o, subs]) => {
      setOlympiad(o);
      const p = o.problems.find(x => x.id === pid_);
      setProblem(p || null);
      setCode(LANG_PLACEHOLDERS[lang]);
      setPrevSubs(subs.filter(s => s.problemId === pid_));
    }).finally(() => setLoading(false));
  }, [id, pid]);

  const handleLangChange = (l: string) => { setLang(l); setCode(LANG_PLACEHOLDERS[l] ?? ''); };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const s = el.selectionStart, end = el.selectionEnd;
      const next = code.substring(0, s) + '    ' + code.substring(end);
      setCode(next);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
    }
  };

  const testCode = async () => {
    if (!problem || !code.trim()) return;
    setTesting(true);
    setTestOutput('');
    try {
      const res = await apiClient.post('/compiler/execute', { code, language: lang });
      setTestOutput(res.status === 'success' ? res.output || '(нет вывода)' : `Ошибка: ${res.error}`);
    } catch (e: any) { setTestOutput(`Ошибка: ${e.message}`); }
    finally { setTesting(false); }
  };

  const submit = async () => {
    if (!problem || !code.trim()) return;
    setSubmitting(true);
    setResult(null);
    try {
      const sub = await olympiadsApi.submit(Number(id), problem.id, { code, language: lang });
      setResult(sub);
      setPrevSubs(p => [sub, ...p]);
    } catch (e: any) { alert(e.message || 'Ошибка'); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!olympiad || !problem) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-fg-muted)' }}>
      Задача не найдена
    </div>
  );

  const bestScore = prevSubs.filter(s => s.status === 'accepted').reduce((m, s) => Math.max(m, s.score), 0);
  const isSolved  = prevSubs.some(s => s.status === 'accepted');

  return (
    <div style={{ height: '100vh', background: 'var(--color-canvas-default)', color: 'var(--color-fg-default)', display: 'flex', flexDirection: 'column', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: 'var(--color-canvas-overlay)', borderBottom: '1px solid var(--color-border-default)', flexShrink: 0 }}>
        <button onClick={() => router.push(`/olympiads/${id}`)} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          <ChevronLeft size={14} /> {olympiad.title}
        </button>
        <span style={{ color: 'var(--color-border-default)' }}>|</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>{problem.title}</span>
        <span style={{ fontSize: 11, color: DIFF_COLOR[problem.difficulty], background: `${DIFF_COLOR[problem.difficulty]}1a`, padding: '2px 8px', borderRadius: 20 }}>{DIFF_LABEL[problem.difficulty]}</span>
        {isSolved && <span style={{ fontSize: 11, color: '#3fb950', background: 'rgba(63,185,80,0.1)', padding: '2px 8px', borderRadius: 20 }}>✓ Решено · {bestScore} б.</span>}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <select value={lang} onChange={e => handleLangChange(e.target.value)}
            style={{ fontSize: 12, background: 'var(--color-canvas-inset)', border: '1px solid var(--color-border-default)', borderRadius: 6, color: 'var(--color-fg-default)', padding: '4px 8px', cursor: 'pointer' }}>
            {olympiad.allowedLanguages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <button onClick={testCode} disabled={testing}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', fontSize: 12, background: 'var(--color-canvas-inset)', color: 'var(--color-fg-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>
            {testing ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={12} />} Тест
          </button>
          <button onClick={submit} disabled={submitting}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 16px', fontSize: 12, fontWeight: 600, background: submitting ? '#238636' : '#2da44e', color: '#fff', border: 'none', borderRadius: 6, cursor: submitting ? 'not-allowed' : 'pointer' }}>
            {submitting ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Отправка...</> : 'Отправить'}
          </button>
        </div>
      </div>

      {/* Main split */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '420px 1fr', overflow: 'hidden' }}>

        {/* Left: problem statement */}
        <div style={{ overflow: 'auto', padding: '20px 24px', borderRight: '1px solid var(--color-border-default)', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--color-fg-default)' }}>{problem.title}</h2>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: '#d29922' }}>{problem.points} баллов</span>
          </div>

          <div style={{ fontSize: 14, color: 'var(--color-fg-default)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 20 }}>
            {problem.description}
          </div>

          {problem.inputDescription && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Входные данные</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-default)' }}>{problem.inputDescription}</p>
            </div>
          )}
          {problem.outputDescription && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Выходные данные</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-default)' }}>{problem.outputDescription}</p>
            </div>
          )}

          {problem.examples.length > 0 && (
            <div>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Примеры</p>
              {problem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: 12, background: 'var(--color-canvas-overlay)', borderRadius: 6, border: '1px solid var(--color-border-default)', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{ padding: '8px 12px', borderRight: '1px solid var(--color-border-default)' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 10, color: 'var(--color-fg-subtle)', textTransform: 'uppercase' }}>Вход</p>
                      <pre style={{ margin: 0, fontSize: 12, color: 'var(--color-fg-default)', whiteSpace: 'pre-wrap' }}>{ex.input}</pre>
                    </div>
                    <div style={{ padding: '8px 12px' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 10, color: 'var(--color-fg-subtle)', textTransform: 'uppercase' }}>Выход</p>
                      <pre style={{ margin: 0, fontSize: 12, color: '#3fb950', whiteSpace: 'pre-wrap' }}>{ex.output}</pre>
                    </div>
                  </div>
                  {ex.explanation && <p style={{ margin: 0, padding: '6px 12px', fontSize: 11, color: 'var(--color-fg-muted)', borderTop: '1px solid var(--color-border-default)' }}>{ex.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Previous attempts */}
          {prevSubs.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Мои попытки</p>
              {prevSubs.slice(0, 5).map(s => {
                const cfg = STATUS_CFG[s.status];
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--color-border-default)' }}>
                    <cfg.Icon size={13} color={cfg.color} />
                    <span style={{ fontSize: 12, color: cfg.color }}>{cfg.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-fg-subtle)' }}>{s.language.toUpperCase()}</span>
                    {s.status === 'accepted' && <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: '#d29922' }}>+{s.score}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: editor + output */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'var(--color-canvas-inset)' }}>
            {/* Line numbers */}
            <div style={{ padding: '16px 8px 16px 12px', fontFamily: 'monospace', fontSize: 13, lineHeight: '1.6', color: 'var(--color-fg-subtle)', userSelect: 'none', minWidth: 44, textAlign: 'right', borderRight: '1px solid var(--color-border-default)', background: 'var(--color-canvas-inset)', flexShrink: 0 }}>
              {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              ref={taRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleTabKey}
              spellCheck={false}
              style={{ flex: 1, padding: '16px 16px 16px 12px', border: 'none', outline: 'none', background: 'transparent', color: 'var(--color-fg-default)', resize: 'none', fontFamily: 'monospace', fontSize: 13, lineHeight: '1.6', caretColor: 'var(--color-accent-fg)' }}
            />
          </div>

          {/* Submit result */}
          {result && (
            <div style={{ padding: '12px 16px', background: 'var(--color-canvas-overlay)', borderTop: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
              {(() => { const cfg = STATUS_CFG[result.status]; return <><cfg.Icon size={16} color={cfg.color} /><span style={{ fontSize: 14, fontWeight: 600, color: cfg.color }}>{cfg.label}</span></>; })()}
              {result.status === 'accepted' && <span style={{ fontSize: 14, fontWeight: 700, color: '#d29922' }}>+{result.score} баллов</span>}
              {result.errorMessage && <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>{result.errorMessage}</span>}
            </div>
          )}

          {/* Test output */}
          {(testOutput || testing) && (
            <div style={{ maxHeight: 180, overflow: 'auto', padding: '10px 14px', background: 'var(--color-canvas-inset)', borderTop: '1px solid var(--color-border-default)' }}>
              <p style={{ margin: '0 0 4px', fontSize: 10, color: 'var(--color-fg-subtle)', textTransform: 'uppercase' }}>Вывод (тест)</p>
              <pre style={{ margin: 0, fontSize: 12, color: testing ? 'var(--color-fg-subtle)' : testOutput.startsWith('Ошибка') ? '#f85149' : '#3fb950', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {testing ? 'Выполняется...' : testOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
