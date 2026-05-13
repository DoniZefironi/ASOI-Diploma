'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useInternships, type Internship } from '@/shared/api/internships';
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '24px 0' }}>
      <div className="gh-container">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#2f81f7', display: 'flex' }}><BriefcaseIcon /></span>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Стажировки</h1>
              <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: 0 }}>Актуальные предложения от компаний-партнёров</p>
            </div>
          </div>
          {!isLoading && internships?.length > 0 && (
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--color-fg-muted)' }}>
              <span style={{ color: '#3fb950', fontWeight: 600 }}>{activeCount} активных</span>
              {expiredCount > 0 && <span>{expiredCount} завершено</span>}
            </div>
          )}
        </div>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-fg-muted)', display: 'flex', pointerEvents: 'none' }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Поиск по названию или компании..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '5px 12px 5px 32px', fontSize: 13,
                color: 'var(--color-fg-default)', background: 'var(--color-canvas-default)',
                border: '1px solid var(--color-border-default)', borderRadius: 6,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {filterBtn('all', 'Все')}
            {filterBtn('remote', 'Удалённо')}
            {filterBtn('office', 'Офис')}
            {filterBtn('hybrid', 'Гибрид')}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Загрузка...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ color: 'var(--color-fg-muted)', display: 'flex', justifyContent: 'center', marginBottom: 12 }}><BriefcaseIcon /></div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 4px' }}>
              {search || formatFilter !== 'all' ? 'Ничего не найдено' : 'Стажировок пока нет'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: 0 }}>
              {search || formatFilter !== 'all'
                ? 'Попробуйте изменить фильтры или поисковый запрос'
                : 'Следите за обновлениями — скоро появятся новые предложения'}
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginBottom: 12 }}>
              {pluralInternships(filtered.length)}
              {(search || formatFilter !== 'all') && ' по запросу'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(internship => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
