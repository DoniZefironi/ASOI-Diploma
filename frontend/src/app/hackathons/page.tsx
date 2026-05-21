'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '@/shared/lib/auth-context';
import { Pagination, usePagination } from '@/shared/ui/Pagination';

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

  const filteredAll = useMemo(() => {
    const q = search.toLowerCase();
    return hackathons.filter(h => {
      const s = getStatus(h);
      const matchSearch = !q || h.title.toLowerCase().includes(q) || h.theme?.toLowerCase().includes(q) || h.description?.toLowerCase().includes(q);
      const matchFilter = filter === 'all' || (filter === 'registration' && s === 'registration') || (filter === 'active' && s === 'active') || (filter === 'ended' && s === 'ended');
      return matchSearch && matchFilter;
    });
  }, [hackathons, search, filter]);
  const { page, setPage, totalPages, slice: filtered, total: filteredTotal } = usePagination(filteredAll, 10);

  const counts = useMemo(() => ({
    all:          hackathons.length,
    registration: hackathons.filter(h => getStatus(h) === 'registration').length,
    active:       hackathons.filter(h => getStatus(h) === 'active').length,
    ended:        hackathons.filter(h => getStatus(h) === 'ended').length,
  }), [hackathons]);

  const totalPrize = hackathons.reduce((s, h) => s + (h.prizePool || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: S.bg, color: S.text }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 16px 64px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 700, color: S.text }}>Хакатоны</h1>
              <p style={{ margin: 0, color: S.muted, fontSize: 14 }}>Командные соревнования по разработке проектов</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {counts.active > 0 && (
                <span style={{ fontSize: 12, fontWeight: 600, color: '#3fb950', background: 'rgba(63,185,80,0.12)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(63,185,80,0.3)' }}>
                  {counts.active} идёт сейчас
                </span>
              )}
              {counts.registration > 0 && (
                <span style={{ fontSize: 12, fontWeight: 600, color: '#238636', background: 'rgba(35,134,54,0.12)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(35,134,54,0.3)' }}>
                  {counts.registration} открыта регистрация
                </span>
              )}
              {(isAdmin || isMentor) && (
                <Link href="/admin/hackathons" style={{ padding: '6px 14px', background: S.green, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  ＋ Управление
                </Link>
              )}
            </div>
          </div>
          <div style={{ height: 3, width: 48, borderRadius: 2, background: '#f0883e' }} />
        </div>

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>

          {/* ── Main ─────────────────────────────────────────────── */}
          <div>
            {/* Search + tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: S.muted, fontSize: 14, pointerEvents: 'none' }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
                  style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, boxSizing: 'border-box', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 8, color: S.text, fontSize: 13, outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: `1px solid ${S.border}` }}>
              {([['all', 'Все'], ['registration', 'Регистрация'], ['active', 'Активные'], ['ended', 'Завершённые']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setFilter(key)} style={{
                  padding: '8px 14px', fontSize: 13, cursor: 'pointer', background: 'none', border: 'none',
                  borderBottom: filter === key ? `2px solid ${S.accent}` : '2px solid transparent',
                  color: filter === key ? S.text : S.muted, fontWeight: filter === key ? 600 : 400,
                  marginBottom: -1, transition: 'color 0.15s',
                }}>
                  {label}
                  <span style={{ marginLeft: 5, fontSize: 11, background: 'rgba(139,148,158,0.15)', padding: '1px 6px', borderRadius: 10 }}>{counts[key]}</span>
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} style={{ height: 130, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, animation: 'pulse 1.5s infinite', opacity: 0.7 }} />)}
                <style>{`@keyframes pulse{0%,100%{opacity:.7}50%{opacity:.4}}`}</style>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: S.muted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: S.text, marginBottom: 6 }}>Ничего не найдено</div>
                <div style={{ fontSize: 13 }}>{search ? `По запросу «${search}» хакатонов нет` : 'Хакатоны пока не объявлены'}</div>
                {search && <button onClick={() => setSearch('')} style={{ marginTop: 12, fontSize: 13, color: S.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Сбросить поиск</button>}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(h => <HackathonCard key={h.id} h={h} isAdmin={isAdmin || !!isMentor} />)}
                <Pagination page={page} totalPages={totalPages} onPage={setPage} total={filteredTotal} pageSize={10} />
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>

            {/* Stats */}
            <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '11px 16px', borderBottom: `1px solid ${S.border}` }}>
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: S.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Статистика</h3>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Всего хакатонов', value: counts.all },
                  { label: 'Активных',         value: counts.active,       color: '#3fb950' },
                  { label: 'Регистрация',       value: counts.registration, color: '#238636' },
                  { label: 'Завершённых',       value: counts.ended,        color: S.muted },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: S.muted }}>{label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: color || S.text }}>{value}</span>
                  </div>
                ))}
                {totalPrize > 0 && (
                  <>
                    <div style={{ height: 1, background: S.border, margin: '2px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: S.muted }}>Призовой фонд</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#d29922' }}>{totalPrize.toLocaleString()} ₽</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* How to participate */}
            <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '11px 16px', borderBottom: `1px solid ${S.border}` }}>
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: S.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Как участвовать</h3>
              </div>
              <div style={{ padding: '14px 16px' }}>
                {[
                  { n: '1', title: 'Найдите хакатон', desc: 'Выберите соревнование с открытой регистрацией' },
                  { n: '2', title: 'Соберите команду', desc: `От ${hackathons[0]?.minTeamSize ?? 2} до ${hackathons[0]?.maxTeamSize ?? 5} участников` },
                  { n: '3', title: 'Выполните задания', desc: 'Решайте задачи по этапам за отведённое время' },
                  { n: '4', title: 'Получите оценку', desc: 'Проект оценивается жюри по критериям' },
                ].map(({ n, title, desc }) => (
                  <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(240,136,62,0.15)', border: '1px solid rgba(240,136,62,0.4)', color: '#f0883e', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {n}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: S.text }}>{title}</div>
                      <div style={{ fontSize: 11, color: S.muted, marginTop: 1 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status legend */}
            <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '11px 16px', borderBottom: `1px solid ${S.border}` }}>
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: S.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Статусы</h3>
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(STATUS_META).map(([, meta]) => (
                  <div key={meta.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: meta.color }}>●</span>
                    <span style={{ fontSize: 12, color: S.muted }}>{meta.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
