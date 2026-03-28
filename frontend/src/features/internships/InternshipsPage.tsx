'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useInternships, type Internship } from '@/shared/api/internships';

// ── Icons ──────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.5 1.75C6.5.784 7.284 0 8.25 0h-.5C8.716 0 9.5.784 9.5 1.75V3h2.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5V1.75ZM8 1.5a.25.25 0 0 0-.25.25V3h.5V1.75A.25.25 0 0 0 8 1.5ZM3.5 5v7.5c0 .276.224.5.5.5h8a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H4a.5.5 0 0 0-.5.5Z"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v5.5c0 .138-.112.25-.25.25H10.5V14.25a1.75 1.75 0 0 1-1.75 1.75H1.75ZM8.75 7.5V14h.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h.5V7.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75Zm-6.5 0v6.5h1v-2.25a.25.25 0 0 1 .25-.25h1a.25.25 0 0 1 .25.25V14h1V7.5H2.25ZM3 2.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 0 .5h-.5A.25.25 0 0 1 3 2.25Zm0 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 0 .5h-.5A.25.25 0 0 1 3 4.25Zm0 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 0 .5h-.5A.25.25 0 0 1 3 6.25ZM6.25 2a.25.25 0 0 0-.25.25v.5a.25.25 0 0 0 .5 0v-.5A.25.25 0 0 0 6.25 2Zm1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 0 .5h-.5A.25.25 0 0 1 8 2.25ZM6 4.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 0 .5h-.5A.25.25 0 0 1 6 4.25Zm2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 0 .5h-.5A.25.25 0 0 1 8 4.25Z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.193 6.5 6.5 0 0 1 0 9.193Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 1.586A.25.25 0 0 1 10.75 7v2a.25.25 0 0 1-.107.204l-4.264 2.932A.25.25 0 0 1 6 11.932V5.002a.25.25 0 0 1 .379-.215Z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Z"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/>
  </svg>
);

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
          background: '#161b22',
          border: '1px solid #30363d',
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
                  color: '#8b949e', background: '#21262d', border: '1px solid #30363d',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <p style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', margin: '0 0 6px', lineHeight: 1.4 }}>
              {internship.title}
            </p>

            {/* Company */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
              <span style={{ color: '#8b949e', display: 'flex' }}><BuildingIcon /></span>
              <span style={{ fontSize: 13, color: '#8b949e', fontWeight: 500 }}>{internship.company}</span>
            </div>

            {/* Description */}
            {internship.description && (
              <p style={{
                fontSize: 13, color: '#8b949e', margin: '0 0 12px',
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', lineHeight: 1.5,
              }}>
                {internship.description}
              </p>
            )}

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {internship.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8b949e' }}>
                  <MapPinIcon /> {internship.location}
                </span>
              )}
              {internship.duration && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8b949e' }}>
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
          <span style={{ color: '#6e7681', display: 'flex', flexShrink: 0, marginTop: 2 }}>
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
    <div style={{ minHeight: '100vh', background: '#0d1117', padding: '24px 0' }}>
      <div className="gh-container">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#2f81f7', display: 'flex' }}><BriefcaseIcon /></span>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e6edf3', margin: 0 }}>Стажировки</h1>
              <p style={{ fontSize: 12, color: '#8b949e', margin: 0 }}>Актуальные предложения от компаний-партнёров</p>
            </div>
          </div>
          {!isLoading && internships?.length > 0 && (
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#8b949e' }}>
              <span style={{ color: '#3fb950', fontWeight: 600 }}>{activeCount} активных</span>
              {expiredCount > 0 && <span>{expiredCount} завершено</span>}
            </div>
          )}
        </div>

        {/* Search + filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#8b949e', display: 'flex', pointerEvents: 'none' }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Поиск по названию или компании..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '5px 12px 5px 32px', fontSize: 13,
                color: '#e6edf3', background: '#0d1117',
                border: '1px solid #30363d', borderRadius: 6,
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
              <p style={{ color: '#8b949e', fontSize: 14 }}>Загрузка...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ color: '#8b949e', display: 'flex', justifyContent: 'center', marginBottom: 12 }}><BriefcaseIcon /></div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', margin: '0 0 4px' }}>
              {search || formatFilter !== 'all' ? 'Ничего не найдено' : 'Стажировок пока нет'}
            </p>
            <p style={{ fontSize: 13, color: '#8b949e', margin: 0 }}>
              {search || formatFilter !== 'all'
                ? 'Попробуйте изменить фильтры или поисковый запрос'
                : 'Следите за обновлениями — скоро появятся новые предложения'}
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, color: '#8b949e', marginBottom: 12 }}>
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
