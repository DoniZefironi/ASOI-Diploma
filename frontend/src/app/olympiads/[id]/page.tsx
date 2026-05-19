'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { olympiadsApi, type Olympiad, type OlympiadSubmission, type LeaderboardEntry } from '@/shared/api/olympiads';
import { Trophy, Clock, Code2, ChevronRight, ArrowLeft, Medal, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getStatus(o: Olympiad): 'upcoming' | 'active' | 'ended' {
  const now = new Date();
  if (now < new Date(o.startDate)) return 'upcoming';
  if (now > new Date(o.endDate))   return 'ended';
  return 'active';
}

const STATUS_ICON: Record<string, { Icon: any; color: string; label: string }> = {
  accepted:     { Icon: CheckCircle,   color: '#3fb950', label: 'Принято' },
  wrong_answer: { Icon: XCircle,       color: '#f85149', label: 'Неверный ответ' },
  error:        { Icon: AlertTriangle, color: '#d29922', label: 'Ошибка' },
  pending:      { Icon: Clock,         color: '#8b949e', label: 'На проверке' },
};

const DIFF_COLOR = { easy: '#3fb950', medium: '#d29922', hard: '#f85149' };
const DIFF_LABEL = { easy: 'Лёгкая', medium: 'Средняя', hard: 'Сложная' };

export default function OlympiadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();
  const [olympiad, setOlympiad]         = useState<Olympiad | null>(null);
  const [mySubmissions, setMySubs]      = useState<OlympiadSubmission[]>([]);
  const [leaderboard, setLeaderboard]   = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading]           = useState(true);
  const [tab, setTab]                   = useState<'problems' | 'leaderboard' | 'my'>('problems');

  useEffect(() => {
    const n = Number(id);
    Promise.all([
      olympiadsApi.getOne(n),
      olympiadsApi.getMySubmissions(n).catch(() => []),
      olympiadsApi.getLeaderboard(n).catch(() => []),
    ]).then(([o, subs, lb]) => {
      setOlympiad(o);
      setMySubs(subs);
      setLeaderboard(lb);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas-default)' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!olympiad) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--color-fg-muted)' }}>Олимпиада не найдена</p>
    </div>
  );

  const status    = getStatus(olympiad);
  const isActive  = status === 'active';
  const totalPts  = olympiad.problems.reduce((s, p) => s + p.points, 0);
  const myScore   = mySubmissions.filter(s => s.status === 'accepted').reduce((acc, s) => acc + s.score, 0);
  const solvedIds = new Set(mySubmissions.filter(s => s.status === 'accepted').map(s => s.problemId));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 960 }}>

        {/* Back */}
        <button onClick={() => router.push('/olympiads')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
        >
          <ArrowLeft size={14} /> Олимпиады
        </button>

        {/* Hero */}
        <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '24px 28px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Trophy size={20} color="var(--color-attention-fg)" />
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-fg-default)' }}>{olympiad.title}</h1>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 20, color: status === 'active' ? '#3fb950' : status === 'upcoming' ? '#d29922' : '#6e7681', background: status === 'active' ? 'rgba(63,185,80,0.1)' : status === 'upcoming' ? 'rgba(210,153,34,0.1)' : 'rgba(110,118,129,0.1)' }}>
                  {status === 'active' ? '● Идёт' : status === 'upcoming' ? '● Скоро' : '● Завершена'}
                </span>
              </div>
              {olympiad.description && <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--color-fg-muted)', lineHeight: 1.6 }}>{olympiad.description}</p>}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: 'var(--color-fg-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={13} /> {fmtDate(olympiad.startDate)} — {fmtDate(olympiad.endDate)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Code2 size={13} /> {olympiad.problems.length} задач · {totalPts} баллов</span>
                <span>Языки: {olympiad.allowedLanguages.map(l => l.toUpperCase()).join(', ')}</span>
              </div>
            </div>
            {/* My score */}
            {mySubmissions.length > 0 && (
              <div style={{ textAlign: 'right', background: 'var(--color-canvas-inset)', padding: '12px 18px', borderRadius: 10, border: '1px solid var(--color-border-default)' }}>
                <p style={{ margin: '0 0 2px', fontSize: 11, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Мой результат</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: 'var(--color-attention-fg)' }}>{myScore}<span style={{ fontSize: 14, color: 'var(--color-fg-muted)', fontWeight: 400 }}>/{totalPts}</span></p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-fg-muted)' }}>{solvedIds.size}/{olympiad.problems.length} решено</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--color-border-muted)', marginBottom: 20 }}>
          {([
            { key: 'problems',    label: `Задачи (${olympiad.problems.length})` },
            { key: 'leaderboard', label: `Таблица лидеров (${leaderboard.length})` },
            { key: 'my',         label: `Мои попытки (${mySubmissions.length})` },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: '8px 16px', fontSize: 13, fontWeight: tab === t.key ? 600 : 400, background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.key ? 'var(--color-attention-fg)' : 'transparent'}`, color: tab === t.key ? 'var(--color-fg-default)' : 'var(--color-fg-muted)', cursor: 'pointer', marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Problems */}
        {tab === 'problems' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {olympiad.problems.length === 0 ? (
              <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: '40px 0' }}>Задачи ещё не добавлены</p>
            ) : olympiad.problems.map((p, i) => {
              const solved = solvedIds.has(p.id);
              const lastSub = mySubmissions.filter(s => s.problemId === p.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
              const StatusIcon = lastSub ? STATUS_ICON[lastSub.status] : null;

              return (
                <div key={p.id} style={{ background: 'var(--color-canvas-overlay)', border: `1px solid ${solved ? 'rgba(63,185,80,0.4)' : 'var(--color-border-default)'}`, borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'border-color 150ms' }}
                  onMouseEnter={e => !solved && (e.currentTarget.style.borderColor = 'var(--color-accent-fg)')}
                  onMouseLeave={e => !solved && (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: solved ? 'rgba(63,185,80,0.1)' : 'var(--color-canvas-inset)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: solved ? '#3fb950' : 'var(--color-fg-muted)', flexShrink: 0 }}>
                    {solved ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-fg-default)' }}>{p.title}</span>
                      <span style={{ fontSize: 11, color: DIFF_COLOR[p.difficulty], background: `${DIFF_COLOR[p.difficulty]}1a`, padding: '1px 7px', borderRadius: 20 }}>
                        {DIFF_LABEL[p.difficulty]}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: 'var(--color-attention-fg)' }}>{p.points} б.</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--color-fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.description.slice(0, 120)}{p.description.length > 120 ? '...' : ''}
                    </p>
                  </div>
                  {isActive && (
                    <Link href={`/olympiads/${olympiad.id}/problem/${p.id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', fontSize: 13, fontWeight: 600, background: solved ? 'rgba(63,185,80,0.1)' : 'var(--color-accent-emphasis)', color: solved ? '#3fb950' : '#fff', border: `1px solid ${solved ? 'rgba(63,185,80,0.3)' : 'transparent'}`, borderRadius: 8, textDecoration: 'none', flexShrink: 0 }}>
                      {solved ? 'Решено' : 'Решать'} <ChevronRight size={13} />
                    </Link>
                  )}
                  {StatusIcon && !isActive && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: StatusIcon.color }}>
                      <StatusIcon.Icon size={14} /> {StatusIcon.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard */}
        {tab === 'leaderboard' && (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
            {leaderboard.length === 0 ? (
              <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: '40px 0' }}>Нет результатов</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-muted)' }}>
                    {['#', 'Участник', 'Решено', 'Баллы'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, color: 'var(--color-fg-muted)', textAlign: h === '#' || h === 'Баллы' || h === 'Решено' ? 'center' : 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map(e => (
                    <tr key={e.userId} style={{ borderBottom: '1px solid var(--color-border-muted)' }}>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : <span style={{ fontSize: 13, color: 'var(--color-fg-subtle)' }}>{e.rank}</span>}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 14, color: 'var(--color-fg-default)' }}>{e.name}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center', fontSize: 13, color: 'var(--color-fg-muted)' }}>{e.solved}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-attention-fg)' }}>{e.score}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* My submissions */}
        {tab === 'my' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mySubmissions.length === 0 ? (
              <p style={{ color: 'var(--color-fg-muted)', textAlign: 'center', padding: '40px 0' }}>У вас пока нет попыток</p>
            ) : mySubmissions.map(s => {
              const cfg = STATUS_ICON[s.status] ?? STATUS_ICON.pending;
              return (
                <div key={s.id} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <cfg.Icon size={16} color={cfg.color} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>{s.problem?.title ?? `Задача #${s.problemId}`}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginLeft: 10 }}>{s.language.toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize: 12, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                  {s.status === 'accepted' && <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-attention-fg)' }}>+{s.score}</span>}
                  <span style={{ fontSize: 11, color: 'var(--color-fg-subtle)' }}>{new Date(s.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
