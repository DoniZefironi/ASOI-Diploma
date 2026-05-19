'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useInternships, type Internship } from '@/shared/api/internships';
import type { ReactNode } from 'react';
import { Search, Briefcase, Building, MapPin, Clock, DollarSign, Calendar, ChevronRight } from 'lucide-react';

// ── Icons ──────────────────────────────────────────────────────────
const SearchIcon = () => <Search size={14} />;
const BriefcaseIcon = () => <Briefcase size={16} />;
const BuildingIcon = () => <Building size={13} />;
const MapPinIcon = () => <MapPin size={12} />;
const ClockIcon = () => <Clock size={12} />;
const MoneyIcon = () => <DollarSign size={12} />;
const CalendarIcon = () => <Calendar size={12} />;
const ChevronRightIcon = () => <ChevronRight size={14} />;

// ── Helpers ────────────────────────────────────────────────────────
const FORMAT: Record<string, { label: string; color: string; bg: string; border: string }> = {
  remote: { label: 'Удалённо',  color: '#3fb950', bg: 'rgba(63,185,80,0.1)',   border: 'rgba(63,185,80,0.3)' },
  office: { label: 'Офис',      color: '#2f81f7', bg: 'rgba(47,129,247,0.1)',   border: 'rgba(47,129,247,0.3)' },
  hybrid: { label: 'Гибрид',   color: '#a371f7', bg: 'rgba(163,113,247,0.1)',  border: 'rgba(163,113,247,0.3)' },
};

function formatDeadline(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function pluralInternships(n: number) {
  const mod = n % 100;
  const mod10 = n % 10;
  if (mod >= 11 && mod <= 19) return `${n} стажировок`;
  if (mod10 === 1) return `${n} стажировка`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} стажировки`;
  return `${n} стажировок`;
}

// ── Card ───────────────────────────────────────────────────────────
function InternshipCard({ internship }: { internship: Internship }) {
  const fmt = FORMAT[internship.format] ?? FORMAT.office;
  const deadline = formatDeadline(internship.deadline);
  const isExpired = !!(internship.deadline && new Date(internship.deadline) < new Date());

  return (
    <Link
      href={`/internships/${internship.id}`}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div
        style={{
          background: 'var(--color-canvas-overlay)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 6,
          padding: '16px 20px',
          transition: 'border-color 80ms',
          opacity: isExpired ? 0.65 : 1,
          cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#6e7681')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#30363d')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Badges row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                color: fmt.color, background: fmt.bg, border: `1px solid ${fmt.border}`,
              }}>
                {fmt.label}
              </span>
              {isExpired && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                  color: '#f85149', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)',
                }}>
                  Приём завершён
                </span>
              )}
              {internship.tags?.slice(0, 4).map(tag => (
                <span key={tag} style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 20,
                  color: 'var(--color-fg-muted)', background: 'var(--color-border-muted)', border: '1px solid var(--color-border-default)',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 6px', lineHeight: 1.4 }}>
              {internship.title}
            </p>

            {/* Company */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
              <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}><BuildingIcon /></span>
              <span style={{ fontSize: 13, color: 'var(--color-fg-muted)', fontWeight: 500 }}>{internship.company}</span>
            </div>

            {/* Description */}
            {internship.description && (
              <p style={{
                fontSize: 13, color: 'var(--color-fg-muted)', margin: '0 0 12px',
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', lineHeight: 1.5,
              }}>
                {internship.description}
              </p>
            )}

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {internship.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                  <MapPinIcon /> {internship.location}
                </span>
              )}
              {internship.duration && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                  <ClockIcon /> {internship.duration}
                </span>
              )}
              {internship.salary && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3fb950' }}>
                  <MoneyIcon /> {internship.salary}
                </span>
              )}
              {deadline && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: isExpired ? '#f85149' : '#8b949e' }}>
                  <CalendarIcon /> до {deadline}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <span style={{ color: 'var(--color-fg-subtle)', display: 'flex', flexShrink: 0, marginTop: 2 }}>
            <ChevronRightIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────
export default function InternshipsPage() {
  const { internships, isLoading } = useInternships();
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');

  const filtered = (internships ?? []).filter(i => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      i.title.toLowerCase().includes(q) ||
      i.company.toLowerCase().includes(q) ||
      (i.description ?? '').toLowerCase().includes(q);
    const matchesFormat = formatFilter === 'all' || i.format === formatFilter;
    return matchesSearch && matchesFormat;
  });

  const activeCount = filtered.filter(i => !i.deadline || new Date(i.deadline) >= new Date()).length;
  const expiredCount = filtered.length - activeCount;

  const filterBtn = (val: string, label: string) => {
    const isActive = formatFilter === val;
    return (
      <button
        key={val}
        onClick={() => setFormatFilter(val)}
        style={{
          padding: '4px 12px', fontSize: 13, fontWeight: 500, borderRadius: 6,
          border: '1px solid',
          borderColor: isActive ? '#2f81f7' : '#30363d',
          color: isActive ? '#fff' : '#8b949e',
          background: isActive ? '#2f81f7' : 'transparent',
          cursor: 'pointer', transition: 'all 80ms',
        }}
      >
        {label}
      </button>
    );
  };

  const allInternships = internships ?? [];
  const formatCounts = {
    remote: allInternships.filter(i => i.format === 'remote').length,
    office: allInternships.filter(i => i.format === 'office').length,
    hybrid: allInternships.filter(i => i.format === 'hybrid').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 1200 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Briefcase size={22} color="var(--color-accent-fg)" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-fg-default)' }}>Стажировки</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
            Актуальные предложения от компаний-партнёров
          </p>
          <div style={{ height: 3, width: 48, borderRadius: 2, background: 'var(--color-accent-emphasis)', marginTop: 14 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>

          {/* ── Main ────────────────────────────────────────────── */}
          <div>
            {/* Search + filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-fg-muted)', display: 'flex', pointerEvents: 'none' }}>
                  <SearchIcon />
                </span>
                <input type="text" placeholder="Поиск по названию или компании..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '7px 12px 7px 32px', fontSize: 13, color: 'var(--color-fg-default)', background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {filterBtn('all', 'Все')}
                {filterBtn('remote', 'Удалённо')}
                {filterBtn('office', 'Офис')}
                {filterBtn('hybrid', 'Гибрид')}
              </div>
            </div>

            {isLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-fg-muted)' }}>
                <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                Загрузка...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 12, padding: '56px 24px', textAlign: 'center' }}>
                <Briefcase size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 6px' }}>
                  {search || formatFilter !== 'all' ? 'Ничего не найдено' : 'Стажировок пока нет'}
                </p>
                <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>
                  {search || formatFilter !== 'all' ? 'Попробуйте изменить фильтры' : 'Скоро появятся новые предложения'}
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginBottom: 10 }}>
                  {pluralInternships(filtered.length)}{(search || formatFilter !== 'all') && ' по запросу'}
                  {' · '}<span style={{ color: 'var(--color-success-fg)' }}>{activeCount} активных</span>
                  {expiredCount > 0 && <span style={{ color: 'var(--color-fg-subtle)' }}> · {expiredCount} завершено</span>}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filtered.map(i => <InternshipCard key={i.id} internship={i} />)}
                </div>
              </>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>

            {/* Stats */}
            {!isLoading && allInternships.length > 0 && (
              <SideCard title="Статистика">
                {[
                  { label: 'Всего',     value: allInternships.length },
                  { label: 'Активных',  value: allInternships.filter(i => !i.deadline || new Date(i.deadline) >= new Date()).length, color: 'var(--color-success-fg)' },
                  { label: 'Завершено', value: allInternships.filter(i => i.deadline && new Date(i.deadline) < new Date()).length,  color: 'var(--color-fg-subtle)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px' }}>
                    <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: color || 'var(--color-fg-default)' }}>{value}</span>
                  </div>
                ))}
              </SideCard>
            )}

            {/* Format breakdown */}
            {!isLoading && allInternships.length > 0 && (
              <SideCard title="По формату">
                {Object.entries(FORMAT).map(([key, cfg]) => (
                  <button key={key} onClick={() => setFormatFilter(formatFilter === key ? 'all' : key)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: formatFilter === key ? cfg.bg : 'transparent', transition: 'background 80ms', marginBottom: 2 }}
                    onMouseEnter={e => formatFilter !== key && (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
                    onMouseLeave={e => formatFilter !== key && (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 13, color: formatFilter === key ? cfg.color : 'var(--color-fg-muted)', fontWeight: formatFilter === key ? 600 : 400 }}>{cfg.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '1px 8px', borderRadius: 20 }}>{formatCounts[key as keyof typeof formatCounts]}</span>
                  </button>
                ))}
              </SideCard>
            )}

            {/* Tips */}
            <SideCard title="Советы">
              {[
                'Отправляйте заявку заранее — некоторые компании закрывают набор досрочно',
                'Изучите компанию перед откликом — это ценится на собеседовании',
                'Подготовьте актуальное резюме с последними проектами',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 8px' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-accent-fg)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ fontSize: 12, color: 'var(--color-fg-muted)', lineHeight: 1.45 }}>{tip}</span>
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

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
        <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      </div>
      <div style={{ padding: '8px' }}>{children}</div>
    </div>
  );
}
