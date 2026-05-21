// features/schedule/SchedulePage.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Pagination, usePagination } from '@/shared/ui/Pagination';
import { useAuth } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import {
  Calendar, Clock, MapPin, BookOpen, FileText, Trophy, Star,
  CheckCircle, Loader2, ChevronRight, ChevronDown, ExternalLink,
} from 'lucide-react';
import { usePeerReviewsToReview, useMyReceivedReviews, type ReceivedReviewGroup } from '@/shared/api/admin/peer-reviews';
import { Badge } from '@/shared/ui/badge';

// ── Types ──────────────────────────────────────────────────────────
interface ScheduleItem {
  id: number; title: string; description: string; type: string;
  startTime: string; endTime: string; location: string; meetingUrl?: string;
  courseGroupId: number;
  courseGroup?: { id: number; name: string; course?: { id: number; name: string; type: string } };
  instructor?: { id: number; firstName: string; lastName: string };
}
interface Assignment {
  id: number; title: string; description: string; deadline: string;
  courseGroupId: number;
  courseGroup?: { id: number; name: string; course?: { id: number; name: string } };
}
interface Hackathon { id: number; title: string; description: string; startDate: string; endDate: string; registrationDeadline?: string }
interface ElectiveItem { id: number; title: string; description?: string; startDate?: string; endDate?: string; courseGroupName?: string; courseName?: string }
interface WeekGroup { weekStart: Date; weekEnd: Date; scheduleItems: ScheduleItem[]; assignments: Assignment[]; hackathons: Hackathon[]; electives: ElectiveItem[] }

// ── Event type config ──────────────────────────────────────────────
const TYPE_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  lecture:    { label: 'Лекция',     color: 'var(--color-accent-fg)',     bg: 'rgba(47,129,247,0.1)',  dot: '#2f81f7' },
  practice:   { label: 'Практика',   color: 'var(--color-success-fg)',    bg: 'rgba(63,185,80,0.1)',   dot: '#3fb950' },
  test:       { label: 'Тест',       color: 'var(--color-danger-fg)',     bg: 'rgba(248,81,73,0.1)',   dot: '#f85149' },
  deadline:   { label: 'Дедлайн',   color: 'var(--color-danger-fg)',     bg: 'rgba(248,81,73,0.1)',   dot: '#f85149' },
  hackathon:  { label: 'Хакатон',   color: 'var(--color-done-fg)',       bg: 'rgba(163,113,247,0.1)', dot: '#a371f7' },
  elective:   { label: 'Факультатив', color: '#2dd4bf',                  bg: 'rgba(45,212,191,0.1)',  dot: '#2dd4bf' },
};
const getCfg = (t: string) => TYPE_CFG[t] ?? { label: t, color: 'var(--color-fg-muted)', bg: 'var(--color-canvas-inset)', dot: '#6e7681' };

const DAY_NAMES = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const DAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function fmt(d: string) { return new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }); }
function fmtDate(d: Date) { return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }); }
function isToday(d: Date) { return d.toDateString() === new Date().toDateString(); }
function isPast(s: string) { return new Date(s) < new Date(); }
function getWeekStart(date: Date): Date {
  const d = new Date(date); const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0); return d;
}

// ── Unified event type ─────────────────────────────────────────────
type AnyEvent =
  | { kind: 'schedule';   data: ScheduleItem;  date: Date }
  | { kind: 'assignment'; data: Assignment;    date: Date }
  | { kind: 'hackathon';  data: Hackathon;     date: Date }
  | { kind: 'elective';   data: ElectiveItem;  date: Date };

// ── EventRow (single compact row) ────────────────────────────────
function EventRow({ ev }: { ev: AnyEvent }) {
  const past = isPast(ev.kind === 'schedule' ? ev.data.startTime : ev.kind === 'assignment' ? ev.data.deadline : ev.kind === 'hackathon' ? ev.data.startDate : (ev.data.startDate ?? ''));
  const today = isToday(ev.date);

  if (ev.kind === 'schedule') {
    const cfg = getCfg(ev.data.type);
    return (
      <Link href={`/schedule/${ev.data.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, textDecoration: 'none', opacity: past ? 0.55 : 1, transition: 'background 80ms' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--color-fg-subtle)', width: 44, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{fmt(ev.data.startTime)}</span>
        <span style={{ fontSize: 12, color: cfg.color, background: cfg.bg, padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>{cfg.label}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-fg-default)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.data.title}</span>
        <span style={{ fontSize: 11, color: 'var(--color-fg-subtle)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}><MapPin size={10} />{ev.data.location}</span>
        {today && !past && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-success-fg)', flexShrink: 0 }}>• сегодня</span>}
      </Link>
    );
  }

  if (ev.kind === 'assignment') {
    const cfg = getCfg('deadline');
    const overdue = isPast(ev.data.deadline) && !isToday(ev.date);
    return (
      <Link href={`/assignments/${ev.data.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, textDecoration: 'none', opacity: overdue ? 0.55 : 1, transition: 'background 80ms' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--color-fg-subtle)', width: 44, flexShrink: 0 }}>{fmt(ev.data.deadline)}</span>
        <span style={{ fontSize: 12, color: cfg.color, background: cfg.bg, padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>Дедлайн</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-fg-default)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.data.title}</span>
        {overdue && <span style={{ fontSize: 10, color: 'var(--color-danger-fg)', flexShrink: 0 }}>просрочено</span>}
        {today && !overdue && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-danger-fg)', flexShrink: 0 }}>• сегодня!</span>}
      </Link>
    );
  }

  if (ev.kind === 'hackathon') {
    const cfg = getCfg('hackathon');
    return (
      <Link href={`/hackathons/${ev.data.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, textDecoration: 'none', transition: 'background 80ms' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--color-fg-subtle)', width: 44, flexShrink: 0 }}>—</span>
        <span style={{ fontSize: 12, color: cfg.color, background: cfg.bg, padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>Хакатон</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-fg-default)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.data.title}</span>
        <ExternalLink size={12} color="var(--color-fg-subtle)" style={{ flexShrink: 0 }} />
      </Link>
    );
  }

  // elective
  const cfg = getCfg('elective');
  return (
    <Link href={`/electives/${ev.data.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', borderRadius: 6, textDecoration: 'none', transition: 'background 80ms' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: 'var(--color-fg-subtle)', width: 44, flexShrink: 0 }}>—</span>
      <span style={{ fontSize: 12, color: cfg.color, background: cfg.bg, padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>Факультатив</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-fg-default)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.data.title}</span>
    </Link>
  );
}

// ── WeekBlock ─────────────────────────────────────────────────────
function WeekBlock({ week, isExpanded, onToggle }: { week: WeekGroup; isExpanded: boolean; onToggle: () => void }) {
  const now = new Date();
  const isCurrent = week.weekStart <= now && now <= week.weekEnd;

  // Gather all events and group by day
  const allEvents: AnyEvent[] = [
    ...week.scheduleItems.map(d => ({ kind: 'schedule'   as const, data: d, date: new Date(d.startTime) })),
    ...week.assignments.map(d  => ({ kind: 'assignment'  as const, data: d, date: new Date(d.deadline) })),
    ...week.hackathons.map(d   => ({ kind: 'hackathon'   as const, data: d, date: new Date(d.startDate) })),
    ...week.electives.filter(d => d.startDate).map(d => ({ kind: 'elective' as const, data: d, date: new Date(d.startDate!) })),
  ];
  allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group by calendar day
  const byDay = new Map<string, AnyEvent[]>();
  allEvents.forEach(ev => {
    const key = ev.date.toDateString();
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(ev);
  });

  const total = allEvents.length;

  return (
    <div style={{
      background: 'var(--color-canvas-overlay)',
      border: `1px solid ${isCurrent ? 'var(--color-accent-fg)' : 'var(--color-border-default)'}`,
      borderRadius: 10, overflow: 'hidden',
      boxShadow: isCurrent ? '0 0 0 1px var(--color-accent-muted)' : 'none',
    }}>
      {/* Week header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
          transition: 'background 80ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {isExpanded ? <ChevronDown size={14} color="var(--color-fg-muted)" /> : <ChevronRight size={14} color="var(--color-fg-muted)" />}

        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>
          {fmtDate(week.weekStart)} — {fmtDate(week.weekEnd)}
        </span>

        {isCurrent && (
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-accent-fg)', background: 'var(--color-accent-subtle)', padding: '1px 8px', borderRadius: 20, border: '1px solid var(--color-accent-muted)' }}>
            Текущая
          </span>
        )}

        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-fg-subtle)' }}>
          {total} событ{total === 1 ? 'ие' : total >= 2 && total <= 4 ? 'ия' : 'ий'}
        </span>

        {/* Event type dots summary */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {week.scheduleItems.length > 0 && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2f81f7' }} title="Занятия" />}
          {week.assignments.length > 0    && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f85149' }} title="Дедлайны" />}
          {week.hackathons.length > 0     && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a371f7' }} title="Хакатоны" />}
          {week.electives.length > 0      && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2dd4bf' }} title="Факультативы" />}
        </div>
      </button>

      {/* Expanded: days tree */}
      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--color-border-muted)', padding: '4px 0 8px' }}>
          {Array.from(byDay.entries()).map(([dayKey, events]) => {
            const dayDate = new Date(dayKey);
            const todayDay = isToday(dayDate);
            const dayName = DAY_SHORT[dayDate.getDay()];
            const dayNum = dayDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

            return (
              <div key={dayKey}>
                {/* Day header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px 4px',
                  marginTop: 4,
                }}>
                  {/* Vertical tree line connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16, flexShrink: 0 }}>
                    <div style={{ width: 1, height: 10, background: 'var(--color-border-muted)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${todayDay ? 'var(--color-accent-fg)' : 'var(--color-border-default)'}`, background: todayDay ? 'var(--color-accent-fg)' : 'var(--color-canvas-default)', flexShrink: 0 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: todayDay ? 'var(--color-accent-fg)' : 'var(--color-fg-muted)' }}>
                    {dayName}, {dayNum}
                  </span>
                  {todayDay && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-accent-fg)' }}>· сегодня</span>}
                </div>

                {/* Events under this day */}
                <div style={{ paddingLeft: 32, paddingRight: 8 }}>
                  {/* Left tree line */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -16, top: 0, bottom: 0, width: 1, background: 'var(--color-border-muted)' }} />
                    {events.map((ev, i) => <EventRow key={`${ev.kind}-${i}`} ev={ev} />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function SchedulePage() {
  const { user } = useAuth();
  const [schedule, setSchedule]         = useState<ScheduleItem[]>([]);
  const [assignments, setAssignments]   = useState<Assignment[]>([]);
  const [hackathons, setHackathons]     = useState<Hackathon[]>([]);
  const [electives, setElectives]       = useState<ElectiveItem[]>([]);
  const [groupIds, setGroupIds]         = useState<number[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [filterType, setFilterType]     = useState<'all' | 'schedule' | 'assignments' | 'hackathons' | 'electives'>('all');
  const [showPast, setShowPast]         = useState(false);
  const [activeTab, setActiveTab]       = useState<'schedule' | 'peer_review'>('schedule');

  const { reviews: toReview, isLoading: loadingToReview } = usePeerReviewsToReview();
  const { received, isLoading: loadingReceived } = useMyReceivedReviews();

  useEffect(() => { loadData(); }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [schedData, assData, hackData, regData, electData] = await Promise.all([
        apiClient.get('/schedule?limit=1000'),
        apiClient.get('/assignments?limit=1000'),
        apiClient.get('/hackathons?limit=1000'),
        apiClient.get('/course-groups/user/registrations'),
        apiClient.get('/electives').catch(() => []),
      ]);
      const approved = (regData || []).filter((r: any) => r.status === 'approved');
      const ids = approved.map((r: any) => r.courseGroupId);
      setGroupIds(ids);
      setSchedule((schedData || []).filter((i: any) => ids.includes(i.courseGroupId)));
      setAssignments((assData || []).filter((a: any) => ids.includes(a.courseGroupId)));
      setHackathons(hackData || []);
      setElectives((electData || []).filter((e: any) => e.isEnrolled));

      // Auto-expand current + next week
      const builtWeeks = buildWeeks((schedData || []).filter((i: any) => ids.includes(i.courseGroupId)), (assData || []).filter((a: any) => ids.includes(a.courseGroupId)), hackData || [], (electData || []).filter((e: any) => e.isEnrolled));
      const now = new Date();
      const toExpand = new Set<string>();
      builtWeeks.forEach(w => { if (w.weekEnd >= now) toExpand.add(w.weekStart.toISOString()); });
      const arr = Array.from(toExpand);
      setExpandedWeeks(new Set(arr.slice(0, 2)));
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  const buildWeeks = (s: ScheduleItem[], a: Assignment[], h: Hackathon[], e: ElectiveItem[]): WeekGroup[] => {
    const map = new Map<string, WeekGroup>();
    const add = (date: Date) => {
      const ws = getWeekStart(date);
      const key = ws.toISOString();
      if (!map.has(key)) {
        const we = new Date(ws); we.setDate(we.getDate() + 6);
        map.set(key, { weekStart: ws, weekEnd: we, scheduleItems: [], assignments: [], hackathons: [], electives: [] });
      }
      return map.get(key)!;
    };
    s.forEach(i => add(new Date(i.startTime)).scheduleItems.push(i));
    a.forEach(i => add(new Date(i.deadline)).assignments.push(i));
    h.forEach(i => add(new Date(i.startDate)).hackathons.push(i));
    e.forEach(i => { if (i.startDate) add(new Date(i.startDate)).electives.push(i); });
    return Array.from(map.values()).sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
  };

  const allFilteredWeeks = useMemo(() => {
    const now = new Date();
    let weeks = buildWeeks(schedule, assignments, hackathons, electives);
    if (filterType === 'schedule')    weeks = weeks.filter(w => w.scheduleItems.length > 0);
    if (filterType === 'assignments') weeks = weeks.filter(w => w.assignments.length > 0);
    if (filterType === 'hackathons')  weeks = weeks.filter(w => w.hackathons.length > 0);
    if (filterType === 'electives')   weeks = weeks.filter(w => w.electives.length > 0);
    if (!showPast) weeks = weeks.filter(w => w.weekEnd >= now);
    return weeks;
  }, [schedule, assignments, hackathons, electives, filterType, showPast]);

  const { page: weekPage, setPage: setWeekPage, totalPages: weekTotalPages, slice: filteredWeeks, total: weeksTotal } = usePagination(allFilteredWeeks, 8);

  const toggle = (key: string) => {
    setExpandedWeeks(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ maxWidth: 360, width: '100%', textAlign: 'center', padding: 32 }}>
          <h2 style={{ color: 'var(--color-fg-default)', marginBottom: 8 }}>Требуется авторизация</h2>
          <Button variant="primary" onClick={() => (window.location.href = '/auth')}>Войти</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas-default)' }}>
        <Loader2 size={28} color="var(--color-accent-fg)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const pendingReviews = toReview.filter(r => !r.isCompleted).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
              <Calendar size={20} color="var(--color-accent-fg)" />
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-fg-default)' }}>Расписание</h1>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-muted)' }}>
              Занятия, дедлайны и события для ваших групп
            </p>
          </div>
          <Link href="/dashboard" style={{ fontSize: 13, color: 'var(--color-accent-fg)', textDecoration: 'none' }}>← Дашборд</Link>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--color-border-muted)', marginBottom: 16 }}>
          {(['schedule', 'peer_review'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 16px', fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? 'var(--color-accent-fg)' : 'transparent'}`, color: activeTab === tab ? 'var(--color-fg-default)' : 'var(--color-fg-muted)', cursor: 'pointer', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 6 }}>
              {tab === 'schedule' ? 'Расписание' : <><Star size={13} /> Peer Review</>}
              {tab === 'peer_review' && pendingReviews > 0 && (
                <span style={{ background: '#d29922', color: '#000', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 20 }}>{pendingReviews}</span>
              )}
            </button>
          ))}
        </div>

        {/* Schedule tab */}
        {activeTab === 'schedule' && (
          <>
            {/* Controls bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {(['all', 'schedule', 'assignments', 'hackathons', 'electives'] as const).map(f => {
                const labels: Record<string, string> = { all: 'Все', schedule: 'Занятия', assignments: 'Дедлайны', hackathons: 'Хакатоны', electives: 'Факультативы' };
                const active = filterType === f;
                return (
                  <button key={f} onClick={() => setFilterType(f)}
                    style={{ padding: '4px 12px', fontSize: 12, fontWeight: active ? 600 : 400, borderRadius: 20, cursor: 'pointer', background: active ? 'var(--color-accent-emphasis)' : 'var(--color-canvas-overlay)', color: active ? '#fff' : 'var(--color-fg-muted)', border: `1px solid ${active ? 'transparent' : 'var(--color-border-default)'}` }}>
                    {labels[f]}
                  </button>
                );
              })}

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8, fontSize: 12, color: 'var(--color-fg-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={showPast} onChange={e => setShowPast(e.target.checked)} />
                Прошедшие
              </label>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                <button onClick={() => setExpandedWeeks(new Set(allFilteredWeeks.map(w => w.weekStart.toISOString())))} style={{ fontSize: 11, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Развернуть все
                </button>
                <button onClick={() => setExpandedWeeks(new Set())} style={{ fontSize: 11, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Свернуть все
                </button>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
              {Object.entries(TYPE_CFG).map(([k, v]) => (
                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-fg-muted)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: v.dot, flexShrink: 0 }} /> {v.label}
                </span>
              ))}
            </div>

            {/* Weeks tree */}
            {filteredWeeks.length === 0 ? (
              <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 10, padding: '48px 24px', textAlign: 'center' }}>
                <Calendar size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 6px' }}>Нет событий</p>
                <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>
                  {groupIds.length === 0 ? 'Запишитесь на курс, чтобы видеть расписание' : showPast ? 'Нет событий по выбранному фильтру' : 'Включите «Прошедшие» для отображения прошлых недель'}
                </p>
                {groupIds.length === 0 && (
                  <Link href="/courses" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--color-accent-fg)' }}>Перейти к курсам</Link>
                )}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredWeeks.map(week => (
                    <WeekBlock
                      key={week.weekStart.toISOString()}
                      week={week}
                      isExpanded={expandedWeeks.has(week.weekStart.toISOString())}
                      onToggle={() => toggle(week.weekStart.toISOString())}
                    />
                  ))}
                </div>
                <Pagination page={weekPage} totalPages={weekTotalPages} onPage={setWeekPage} total={weeksTotal} pageSize={8} />
              </>
            )}
          </>
        )}

        {/* Peer Review tab */}
        {activeTab === 'peer_review' && (
          <PeerReviewTab toReview={toReview} received={received} isLoadingToReview={loadingToReview} isLoadingReceived={loadingReceived} />
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Peer Review Tab (unchanged logic) ─────────────────────────────
function PeerReviewTab({ toReview, received, isLoadingToReview, isLoadingReceived }: { toReview: any[]; received: ReceivedReviewGroup[]; isLoadingToReview: boolean; isLoadingReceived: boolean }) {
  const [section, setSection] = useState<'to_review' | 'received'>('to_review');
  const pending = toReview.filter(r => !r.isCompleted);
  const done    = toReview.filter(r => r.isCompleted);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {(['to_review', 'received'] as const).map(s => (
          <button key={s} onClick={() => setSection(s)}
            style={{ padding: '6px 14px', fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer', background: section === s ? (s === 'to_review' ? '#9e6a03' : 'var(--color-success-emphasis)') : 'var(--color-canvas-overlay)', color: section === s ? '#fff' : 'var(--color-fg-muted)', fontWeight: section === s ? 600 : 400 }}>
            {s === 'to_review' ? `Нужно проверить${pending.length > 0 ? ` (${pending.length})` : ''}` : 'Мои оценки'}
          </button>
        ))}
      </div>

      {section === 'to_review' && (
        isLoadingToReview ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-fg-muted)' }}>Загрузка...</div>
        : pending.length === 0 && done.length === 0 ? (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, padding: '48px 24px', textAlign: 'center' }}>
            <CheckCircle size={28} color="var(--color-success-fg)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: 0 }}>Нет работ для проверки</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#d29922', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>Ожидают проверки</p>
                {pending.map(r => (
                  <Link key={r.reviewId ?? r.id} href="/peer-review" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(210,153,34,0.06)', border: '1px solid rgba(210,153,34,0.3)', borderRadius: 8, marginBottom: 6, textDecoration: 'none' }}>
                    <div><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>{r.assignmentTitle}</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-fg-muted)' }}>Студент: {r.studentName}</p></div>
                    <span style={{ fontSize: 12, color: '#d29922', fontWeight: 600 }}>Проверить →</span>
                  </Link>
                ))}
              </div>
            )}
            {done.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '12px 0 8px' }}>Проверено</p>
                {done.map(r => (
                  <div key={r.reviewId ?? r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 8, marginBottom: 6 }}>
                    <div><p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-default)' }}>{r.assignmentTitle}</p><p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-fg-muted)' }}>{r.studentName}</p></div>
                    <span style={{ fontSize: 12, color: 'var(--color-success-fg)', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={13} />{r.score !== undefined ? `${r.score} баллов` : 'Оценено'}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )
      )}

      {section === 'received' && (
        isLoadingReceived ? <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-fg-muted)' }}>Загрузка...</div>
        : received.length === 0 ? (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, padding: '48px 24px', textAlign: 'center' }}>
            <Star size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>Оценок пока нет</p>
          </div>
        ) : (
          received.map(group => (
            <div key={group.submissionId} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-fg-default)' }}>{group.assignmentTitle ?? `Задание #${group.assignmentId}`}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-fg-muted)' }}>Проверок: {group.completedReviews}/{group.totalReviews}</p>
                </div>
                {group.finalScore != null ? (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 10, color: 'var(--color-fg-muted)' }}>Итого</p>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-fg-default)' }}>{group.finalScore}</p>
                  </div>
                ) : <span style={{ fontSize: 12, color: 'var(--color-fg-subtle)' }}>Ожидается…</span>}
              </div>
              {group.reviews.map((rev, i) => (
                <div key={rev.id} style={{ padding: '10px 16px', borderBottom: i < group.reviews.length - 1 ? '1px solid var(--color-border-muted)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>Рецензент #{i + 1}</span>
                    {rev.score != null && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)' }}>{rev.score} баллов</span>}
                  </div>
                  {rev.feedback && <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-default)', lineHeight: 1.5 }}>{rev.feedback}</p>}
                </div>
              ))}
            </div>
          ))
        )
      )}
    </div>
  );
}
