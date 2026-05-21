'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { olympiadsApi, type Olympiad } from '@/shared/api/olympiads';
import { Trophy, Clock, Code2, Users, ChevronRight, Lock } from 'lucide-react';
import { Pagination, usePagination } from '@/shared/ui/Pagination';

function getStatus(o: Olympiad): 'upcoming' | 'active' | 'ended' {
  const now = new Date();
  if (now < new Date(o.startDate)) return 'upcoming';
  if (now > new Date(o.endDate))   return 'ended';
  return 'active';
}

const STATUS_CFG = {
  active:   { label: 'Идёт сейчас',  color: '#3fb950', bg: 'rgba(63,185,80,0.1)',   border: 'rgba(63,185,80,0.3)' },
  upcoming: { label: 'Скоро',        color: '#d29922', bg: 'rgba(210,153,34,0.1)',  border: 'rgba(210,153,34,0.3)' },
  ended:    { label: 'Завершена',    color: '#6e7681', bg: 'rgba(110,118,129,0.1)', border: 'rgba(110,118,129,0.3)' },
};

const DIFF_CFG = {
  easy:   { label: 'Лёгкая',     color: '#3fb950' },
  medium: { label: 'Средняя',    color: '#d29922' },
  hard:   { label: 'Сложная',    color: '#f85149' },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function daysLeft(d: string) {
  const diff = new Date(d).getTime() - Date.now();
  if (diff < 0) return null;
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h} ч.`;
  return `${Math.ceil(diff / 86400000)} дн.`;
}

export default function OlympiadsPage() {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');

  useEffect(() => {
    olympiadsApi.getAll().then(setOlympiads).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredAll = olympiads.filter(o => filter === 'all' || getStatus(o) === filter);
  const { page, setPage, totalPages, slice: filtered, total } = usePagination(filteredAll, 12);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 1000 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Trophy size={22} color="var(--color-attention-fg)" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-fg-default)' }}>Олимпиады по программированию</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
            Индивидуальные соревнования по решению алгоритмических задач
          </p>
          <div style={{ height: 3, width: 48, borderRadius: 2, background: 'var(--color-attention-fg)', marginTop: 14 }} />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--color-border-muted)', paddingBottom: 0 }}>
          {(['all', 'active', 'upcoming', 'ended'] as const).map(f => {
            const labels = { all: `Все (${olympiads.length})`, active: 'Активные', upcoming: 'Предстоящие', ended: 'Завершённые' };
            return (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${filter === f ? 'var(--color-attention-fg)' : 'transparent'}`, color: filter === f ? 'var(--color-fg-default)' : 'var(--color-fg-muted)', fontWeight: filter === f ? 600 : 400, marginBottom: -1, transition: 'color 120ms' }}>
                {labels[f]}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 120, background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, animation: 'pulse 1.5s infinite' }} />)}
            <style>{`@keyframes pulse{0%,100%{opacity:.7}50%{opacity:.4}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 12, padding: '56px 24px', textAlign: 'center' }}>
            <Trophy size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>Олимпиад нет</p>
            <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Следите за обновлениями</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(o => {
              const status = getStatus(o);
              const cfg    = STATUS_CFG[status];
              const left   = status === 'active' ? daysLeft(o.endDate) : status === 'upcoming' ? daysLeft(o.startDate) : null;
              const totalPts = o.problems.reduce((s, p) => s + p.points, 0);

              return (
                <div key={o.id}
                  style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '20px 24px', transition: 'border-color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-attention-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                        <Link href={`/olympiads/${o.id}`}
                          style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-accent-fg)', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                          {o.title}
                        </Link>
                        <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, padding: '2px 10px', borderRadius: 20 }}>
                          ● {cfg.label}
                        </span>
                        {left && (
                          <span style={{ fontSize: 12, color: status === 'active' ? '#3fb950' : '#d29922', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} /> {left}
                          </span>
                        )}
                      </div>

                      {o.description && (
                        <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {o.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> {fmtDate(o.startDate)} — {fmtDate(o.endDate)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Code2 size={12} /> {o.problems.length} задач · {totalPts} баллов
                        </span>
                        {o.allowedLanguages.length > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Code2 size={12} /> {o.allowedLanguages.map(l => l.toUpperCase()).join(', ')}
                          </span>
                        )}
                        {o.course && (
                          <span>Курс: {o.course.name}</span>
                        )}
                      </div>
                    </div>

                    <Link href={`/olympiads/${o.id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600, background: status === 'active' ? 'var(--color-attention-emphasis)' : 'var(--color-canvas-inset)', color: status === 'active' ? '#fff' : 'var(--color-fg-muted)', border: `1px solid ${status === 'active' ? 'transparent' : 'var(--color-border-default)'}`, borderRadius: 8, textDecoration: 'none', flexShrink: 0 }}
                    >
                      {status === 'active' ? 'Участвовать' : 'Подробнее'} <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={12} />
      </div>
    </div>
  );
}
