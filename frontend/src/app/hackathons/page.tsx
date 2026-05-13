'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '@/shared/lib/auth-context';

// ── Types ──────────────────────────────────────────────────────────────────
interface Hackathon {
  id: number;
  title: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string | null;
  maxTeamSize: number;
  minTeamSize: number;
  prizePool: number | null;
  isActive: boolean;
  teams: any[];
  stages: { id: number; title: string; tasks: any[] }[];
}

// ── Design tokens ──────────────────────────────────────────────────────────
const S = {
  bg:      'var(--color-canvas-default)',
  surface: 'var(--color-canvas-overlay)',
  border:  'var(--color-border-default)',
  text:    'var(--color-fg-default)',
  muted:   'var(--color-fg-muted)',
  accent:  '#2f81f7',
  hover:   'var(--color-neutral-1)',
  green:   '#238636',
  orange:  '#9e6a03',
  red:     '#b91c1c',
  purple:  '#8957e5',
} as const;

// ── Helpers ────────────────────────────────────────────────────────────────
function getStatus(h: Hackathon): 'registration' | 'active' | 'ended' | 'upcoming' | 'reg_closed' {
  const now = new Date();
  const start = new Date(h.startDate);
  const end   = new Date(h.endDate);
  const reg   = h.registrationDeadline ? new Date(h.registrationDeadline) : null;
  if (now > end)                    return 'ended';
  if (now >= start)                 return 'active';
  if (reg && now > reg)             return 'reg_closed';
  if (reg && now <= reg)            return 'registration';
  return 'upcoming';
}

const STATUS_META = {
  registration: { label: 'Регистрация открыта', color: '#238636', bg: 'rgba(35,134,54,0.15)' },
  active:       { label: 'Идёт сейчас',         color: '#3fb950', bg: 'rgba(63,185,80,0.12)' },
  ended:        { label: 'Завершён',             color: 'var(--color-fg-muted)', bg: 'rgba(139,148,158,0.1)' },
  upcoming:     { label: 'Скоро',                color: '#d29922', bg: 'rgba(210,153,34,0.12)' },
  reg_closed:   { label: 'Регистрация закрыта',  color: '#f85149', bg: 'rgba(248,81,73,0.12)' },
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysLeft(d: string) {
  const diff = new Date(d).getTime() - Date.now();
  if (diff < 0) return null;
  return Math.ceil(diff / 86400000);
}

// ── HackathonCard ──────────────────────────────────────────────────────────
function HackathonCard({ h, isAdmin }: { h: Hackathon; isAdmin: boolean }) {
  const status = getStatus(h);
  const meta   = STATUS_META[status];
  const days   = status === 'registration' && h.registrationDeadline ? daysLeft(h.registrationDeadline) : status === 'active' ? daysLeft(h.endDate) : null;
  const tasksCount = h.stages?.reduce((s, st) => s + (st.tasks?.length || 0), 0) || 0;

  return (
    <div style={{
      background: S.surface, border: `1px solid ${S.border}`,
      borderRadius: 10, padding: '20px 24px',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = S.accent)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = S.border)}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
            <Link href={`/hackathons/${h.id}`} style={{ color: S.accent, fontWeight: 600, fontSize: 17, textDecoration: 'none' }}>
              {h.title}
            </Link>
            {h.theme && <span style={{ fontSize: 12, color: S.muted, background: 'rgba(139,148,158,0.1)', padding: '2px 8px', borderRadius: 12, border: `1px solid ${S.border}` }}>{h.theme}</span>}
          </div>
          {h.description && (
            <p style={{ margin: 0, fontSize: 13, color: S.muted, lineHeight: 1.5,
              overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {h.description}
            </p>
          )}
        </div>
        {/* Status */}
        <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 12, whiteSpace: 'nowrap', flexShrink: 0,
          background: meta.bg, color: meta.color, border: `1px solid ${meta.color}40` }}>
          ● {meta.label}
        </span>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 12, color: S.muted, marginBottom: 14 }}>
        <span>📅 {fmt(h.startDate)} — {fmt(h.endDate)}</span>
        <span>👥 {h.minTeamSize}–{h.maxTeamSize} чел.</span>
        {tasksCount > 0 && <span>📋 {tasksCount} заданий</span>}
        {h.stages?.length > 0 && <span>🏁 {h.stages.length} этапов</span>}
        {(h.teams?.length || 0) > 0 && <span>🧑‍💻 {h.teams.length} команд</span>}
        {h.prizePool && <span style={{ color: '#d29922', fontWeight: 600 }}>🏆 {h.prizePool.toLocaleString()} ₽</span>}
        {days !== null && (
          <span style={{ color: status === 'active' ? '#3fb950' : '#d29922', fontWeight: 500 }}>
            ⏱ {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {status === 'registration' && (
            <Link href={`/hackathons/${h.id}`} style={{
              padding: '6px 14px', background: S.green, color: '#fff', borderRadius: 6,
              fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Регистрация
            </Link>
          )}
          {status === 'active' && (
            <Link href={`/hackathons/${h.id}`} style={{
              padding: '6px 14px', background: 'rgba(63,185,80,0.15)', color: '#3fb950',
              border: '1px solid #3fb950', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Участвую
            </Link>
          )}
          <Link href={`/hackathons/${h.id}`} style={{
            padding: '6px 14px', background: S.hover, color: S.text,
            border: `1px solid ${S.border}`, borderRadius: 6, fontSize: 13, textDecoration: 'none' }}>
            Подробнее
          </Link>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 6 }}>
            <Link href={`/admin/hackathons/${h.id}`} style={{
              padding: '5px 10px', background: S.hover, color: S.muted,
              border: `1px solid ${S.border}`, borderRadius: 6, fontSize: 12, textDecoration: 'none' }}>
              ⚙ Управление
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function HackathonsPage() {
  const { user, hasRole } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<'all' | 'registration' | 'active' | 'ended'>('all');

  const isAdmin = hasRole('admin');
  const isMentor = user?.roles?.some(r => r.startsWith('mentor_'));

  useEffect(() => {
    apiClient.get('/hackathons')
      .then(d => setHackathons(d || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return hackathons.filter(h => {
      const s = getStatus(h);
      const matchSearch = !q || h.title.toLowerCase().includes(q) || h.theme?.toLowerCase().includes(q) || h.description?.toLowerCase().includes(q);
      const matchFilter = filter === 'all' || (filter === 'registration' && s === 'registration') || (filter === 'active' && s === 'active') || (filter === 'ended' && s === 'ended');
      return matchSearch && matchFilter;
    });
  }, [hackathons, search, filter]);

  const counts = useMemo(() => ({
    all:          hackathons.length,
    registration: hackathons.filter(h => getStatus(h) === 'registration').length,
    active:       hackathons.filter(h => getStatus(h) === 'active').length,
    ended:        hackathons.filter(h => getStatus(h) === 'ended').length,
  }), [hackathons]);

  return (
    <div style={{ minHeight: '100vh', background: S.bg, color: S.text, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 16px 64px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, color: S.text }}>🏆 Хакатоны</h1>
            <p style={{ margin: 0, color: S.muted, fontSize: 14 }}>Командные соревнования по разработке проектов</p>
          </div>
          {(isAdmin || isMentor) && (
            <Link href="/admin/hackathons" style={{
              padding: '8px 16px', background: S.green, color: '#fff',
              borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              ＋ Управление
            </Link>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: S.muted, fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по хакатонам..."
              style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, boxSizing: 'border-box',
                background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, color: S.text, fontSize: 14, outline: 'none' }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${S.border}`, paddingBottom: 0 }}>
          {([['all', 'Все'], ['registration', 'Регистрация'], ['active', 'Активные'], ['ended', 'Завершённые']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{
                padding: '8px 14px', fontSize: 13, cursor: 'pointer',
                background: 'none', border: 'none', borderBottom: filter === key ? `2px solid ${S.accent}` : '2px solid transparent',
                color: filter === key ? S.text : S.muted, fontWeight: filter === key ? 600 : 400,
                marginBottom: -1, transition: 'color 0.15s',
              }}>
              {label}
              <span style={{ marginLeft: 6, fontSize: 11, background: 'rgba(139,148,158,0.15)', padding: '1px 6px', borderRadius: 10 }}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 130, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10,
                animation: 'pulse 1.5s infinite', opacity: 0.7 }} />
            ))}
            <style>{`@keyframes pulse{0%,100%{opacity:.7}50%{opacity:.4}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: S.muted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: S.text, marginBottom: 8 }}>Ничего не найдено</div>
            <div style={{ fontSize: 14 }}>{search ? `По запросу «${search}» хакатонов нет` : 'Хакатоны пока не объявлены'}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(h => <HackathonCard key={h.id} h={h} isAdmin={isAdmin || !!isMentor} />)}
          </div>
        )}
      </div>
    </div>
  );
}
