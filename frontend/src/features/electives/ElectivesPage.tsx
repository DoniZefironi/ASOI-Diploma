'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useElectives, enrollElective, unenrollElective, Elective } from '@/shared/api/electives';
import { Calendar, Users, BookOpen, ChevronRight, Check, GraduationCap, Info } from 'lucide-react';

type FilterTab = 'all' | 'enrolled' | 'available';

function formatDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Card ───────────────────────────────────────────────────────────
function ElectiveCard({ elective, onEnroll, onUnenroll, enrollingId }: {
  elective: Elective;
  onEnroll: (id: number) => Promise<void>;
  onUnenroll: (id: number) => Promise<void>;
  enrollingId: number | null;
}) {
  const isFull = elective.maxParticipants != null && elective.currentParticipants >= elective.maxParticipants;
  const isLoading = enrollingId === elective.id;
  const fillPct = elective.maxParticipants
    ? Math.min(100, Math.round((elective.currentParticipants / elective.maxParticipants) * 100))
    : null;
  const fillColor = fillPct == null ? '' : fillPct >= 100 ? '#f85149' : fillPct >= 75 ? '#d29922' : '#3fb950';

  return (
    <div style={{
      background: 'var(--color-canvas-overlay)',
      border: `1px solid ${elective.isEnrolled ? 'rgba(63,185,80,0.4)' : 'var(--color-border-default)'}`,
      borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'border-color 150ms, transform 150ms',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--color-fg-default)', lineHeight: 1.3, flex: 1 }}>
          {elective.title}
        </h3>
        {elective.isEnrolled && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--color-success-fg)', background: 'rgba(63,185,80,0.1)', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
            <Check size={10} /> Записан
          </span>
        )}
      </div>

      {/* Course badges */}
      {(elective.courseGroupName || elective.courseName) && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {elective.courseGroupName && (
            <span style={{ fontSize: 11, color: 'var(--color-accent-fg)', background: 'var(--color-accent-subtle)', padding: '1px 8px', borderRadius: 20, border: '1px solid var(--color-accent-muted)' }}>
              {elective.courseGroupName}
            </span>
          )}
          {elective.courseName && (
            <span style={{ fontSize: 11, color: 'var(--color-done-fg)', background: 'var(--color-done-subtle)', padding: '1px 8px', borderRadius: 20, border: '1px solid var(--color-done-muted)' }}>
              {elective.courseName}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {elective.description && (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {elective.description}
        </p>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {elective.instructorName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-fg-muted)' }}>
            <BookOpen size={12} /> {elective.instructorName}
          </div>
        )}
        {(elective.startDate || elective.endDate) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-fg-muted)' }}>
            <Calendar size={12} />
            {elective.startDate ? formatDate(elective.startDate) : '?'}
            {elective.endDate ? ` — ${formatDate(elective.endDate)}` : ''}
          </div>
        )}
        {elective.maxParticipants != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-fg-muted)' }}>
            <Users size={12} /> {elective.currentParticipants} / {elective.maxParticipants} мест
          </div>
        )}
      </div>

      {/* Seats bar */}
      {fillPct != null && (
        <div>
          <div style={{ height: 4, background: 'var(--color-canvas-inset)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${fillPct}%`, background: fillColor, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
          {isFull && <p style={{ margin: '3px 0 0', fontSize: 11, color: '#f85149' }}>Мест нет</p>}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
        {elective.isEnrolled ? (
          <>
            <Link href={`/electives/${elective.id}`} style={{ textDecoration: 'none' }}>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontSize: 13, fontWeight: 600, background: 'var(--color-accent-emphasis)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-fg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent-emphasis)')}
              >
                Открыть <ChevronRight size={13} />
              </button>
            </Link>
            <button
              disabled={isLoading}
              onClick={() => onUnenroll(elective.id)}
              style={{ padding: '6px 14px', fontSize: 13, color: 'var(--color-danger-fg)', background: 'transparent', border: '1px solid var(--color-danger-muted)', borderRadius: 8, cursor: 'pointer' }}
            >
              {isLoading ? 'Отмена...' : 'Отписаться'}
            </button>
          </>
        ) : isFull ? (
          <span style={{ fontSize: 12, color: 'var(--color-danger-fg)', padding: '6px 0' }}>Нет свободных мест</span>
        ) : (
          <button
            disabled={isLoading}
            onClick={() => onEnroll(elective.id)}
            style={{ padding: '6px 16px', fontSize: 13, fontWeight: 600, background: 'var(--color-success-emphasis)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-success-fg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-success-emphasis)')}
          >
            {isLoading ? 'Запись...' : 'Записаться'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────
export default function ElectivesPage() {
  const { electives, isLoading, isError, mutate } = useElectives();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const filtered = electives.filter(e => filter === 'enrolled' ? e.isEnrolled : filter === 'available' ? !e.isEnrolled : true);
  const enrolledList  = electives.filter(e => e.isEnrolled);
  const availableList = electives.filter(e => !e.isEnrolled);
  const fullList      = electives.filter(e => e.maxParticipants != null && e.currentParticipants >= e.maxParticipants);

  const handleEnroll = async (id: number) => {
    setEnrollingId(id);
    try { await enrollElective(id); await mutate(); }
    catch (err: any) { alert(err?.message || 'Не удалось записаться'); }
    finally { setEnrollingId(null); }
  };

  const handleUnenroll = async (id: number) => {
    if (!confirm('Отписаться от факультатива?')) return;
    setEnrollingId(id);
    try { await unenrollElective(id); await mutate(); }
    catch (err: any) { alert(err?.message || 'Не удалось отписаться'); }
    finally { setEnrollingId(null); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 1200 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <GraduationCap size={22} color="var(--color-done-fg)" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-fg-default)' }}>Факультативы</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
            Дополнительные курсы и занятия для вашей группы
          </p>
          <div style={{ height: 3, width: 48, borderRadius: 2, background: 'var(--color-done-fg)', marginTop: 14 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>

          {/* ── Main ────────────────────────────────────────────── */}
          <div>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {([
                { key: 'all',       label: `Все`,        count: electives.length },
                { key: 'enrolled',  label: `Записан`,    count: enrolledList.length },
                { key: 'available', label: `Доступные`,  count: availableList.length },
              ] as { key: FilterTab; label: string; count: number }[]).map(t => (
                <button key={t.key} onClick={() => setFilter(t.key)}
                  style={{ padding: '6px 14px', fontSize: 13, fontWeight: filter === t.key ? 600 : 400, borderRadius: 8, border: 'none', cursor: 'pointer', background: filter === t.key ? 'var(--color-accent-emphasis)' : 'var(--color-canvas-overlay)', color: filter === t.key ? '#fff' : 'var(--color-fg-muted)', border: `1px solid ${filter === t.key ? 'transparent' : 'var(--color-border-default)'}` }}>
                  {t.label} <span style={{ fontSize: 11, opacity: 0.8 }}>({t.count})</span>
                </button>
              ))}
            </div>

            {isLoading && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-fg-muted)' }}>
                <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                Загрузка...
              </div>
            )}

            {isError && <p style={{ color: 'var(--color-danger-fg)', padding: 16 }}>Ошибка загрузки</p>}

            {!isLoading && !isError && filtered.length === 0 && (
              <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 12, padding: '56px 24px', textAlign: 'center' }}>
                <GraduationCap size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 6px' }}>
                  {filter === 'enrolled' ? 'Вы не записаны ни на один факультатив' : filter === 'available' ? 'Нет доступных факультативов' : 'Факультативов пока нет'}
                </p>
                <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>
                  {electives.length === 0 ? 'Факультативы добавляются администраторами' : 'Попробуйте другой фильтр'}
                </p>
              </div>
            )}

            {!isLoading && !isError && filtered.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {filtered.map(e => (
                  <ElectiveCard key={e.id} elective={e} onEnroll={handleEnroll} onUnenroll={handleUnenroll} enrollingId={enrollingId} />
                ))}
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>

            {/* Stats */}
            <SideCard title="Статистика">
              {[
                { label: 'Всего факультативов', value: electives.length },
                { label: 'Я записан',           value: enrolledList.length,  color: 'var(--color-success-fg)' },
                { label: 'Доступно',            value: availableList.length, color: 'var(--color-accent-fg)' },
                { label: 'Заполнено',           value: fullList.length,      color: 'var(--color-danger-fg)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px' }}>
                  <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: color || 'var(--color-fg-default)' }}>{value}</span>
                </div>
              ))}
            </SideCard>

            {/* My enrollments */}
            {enrolledList.length > 0 && (
              <SideCard title="Мои факультативы">
                {enrolledList.map(e => (
                  <Link key={e.id} href={`/electives/${e.id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, textDecoration: 'none', transition: 'background 80ms' }}
                    onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--color-canvas-subtle)')}
                    onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success-fg)', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--color-fg-default)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                    <ChevronRight size={12} color="var(--color-fg-subtle)" />
                  </Link>
                ))}
              </SideCard>
            )}

            {/* Info */}
            <SideCard title="Как это работает">
              {[
                { text: 'Выберите факультатив из списка доступных' },
                { text: 'Нажмите «Записаться» — место будет зарезервировано' },
                { text: 'Факультатив появится в вашем расписании' },
                { text: 'Отписаться можно до начала занятий' },
              ].map(({ text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 8px' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-done-subtle)', border: '1px solid var(--color-done-muted)', color: 'var(--color-done-fg)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 12, color: 'var(--color-fg-muted)', lineHeight: 1.4 }}>{text}</span>
                </div>
              ))}
            </SideCard>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
        <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      </div>
      <div style={{ padding: '8px' }}>{children}</div>
    </div>
  );
}
