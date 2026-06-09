'use client';
import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/shared/api/client';

// ── Vocab Types ───────────────────────────────────────────────────
interface VocabTerm {
  id: number;
  term: string;
  transcription: string;
  translation: string;
  category: string;
  definition: string;
  example: string;
  level: string;
}

const VOCAB_CATEGORY_COLOR: Record<string, { spine: string; cover: string }> = {
  'Программирование': { spine: '#1d4ed8', cover: 'linear-gradient(160deg,#1e3a8a 0%,#2563eb 100%)' },
  'Сети':             { spine: '#0e7490', cover: 'linear-gradient(160deg,#155e75 0%,#0891b2 100%)' },
  'IoT / Железо':     { spine: '#15803d', cover: 'linear-gradient(160deg,#14532d 0%,#16a34a 100%)' },
  'Безопасность':     { spine: '#b91c1c', cover: 'linear-gradient(160deg,#7f1d1d 0%,#dc2626 100%)' },
  'Базы данных':      { spine: '#7c3aed', cover: 'linear-gradient(160deg,#4c1d95 0%,#7c3aed 100%)' },
  'ИИ / ML':          { spine: '#b45309', cover: 'linear-gradient(160deg,#78350f 0%,#d97706 100%)' },
  'Общее':            { spine: '#475569', cover: 'linear-gradient(160deg,#1e293b 0%,#475569 100%)' },
};

const LEVEL_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  basic:        { bg: 'rgba(22,163,74,0.2)',  color: '#4ade80', label: 'Базовый' },
  intermediate: { bg: 'rgba(234,179,8,0.2)',  color: '#facc15', label: 'Средний' },
  advanced:     { bg: 'rgba(239,68,68,0.2)',  color: '#f87171', label: 'Продвинутый' },
};

function VocabBookCard({ term }: { term: VocabTerm }) {
  const [hovered, setHovered] = useState(false);
  const colors = VOCAB_CATEGORY_COLOR[term.category] || VOCAB_CATEGORY_COLOR['Общее'];
  const lvl = LEVEL_BADGE[term.level] || LEVEL_BADGE.basic;

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', flexDirection: 'column',
          width: 120, height: 160,
          borderRadius: '2px 6px 6px 2px',
          background: colors.cover,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? '0 12px 28px rgba(0,0,0,0.6), -4px 0 0 rgba(0,0,0,0.4), inset 2px 0 0 rgba(255,255,255,0.12)'
            : '-4px 0 0 rgba(0,0,0,0.3), inset 2px 0 0 rgba(255,255,255,0.08), 2px 4px 12px rgba(0,0,0,0.4)',
          transform: hovered ? 'translateY(-12px) rotate(-1deg)' : 'translateY(0)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Spine */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: 'rgba(0,0,0,0.35)', borderRadius: '2px 0 0 2px' }} />

        {/* EN icon */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: -1 }}>EN</span>
        </div>

        {/* Term */}
        <div style={{ padding: '8px 10px 10px 14px' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, lineHeight: 1.3, color: '#fff',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            wordBreak: 'break-word', textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}>
            {term.term}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
          width: 220, background: S.surface, border: `1px solid ${S.border}`,
          borderRadius: 8, padding: '10px 12px', zIndex: 100,
          pointerEvents: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#60a5fa', marginBottom: 2 }}>{term.term}</div>
          {term.transcription && <div style={{ fontSize: 11, color: S.muted, fontFamily: 'monospace', marginBottom: 4 }}>{term.transcription}</div>}
          <div style={{ fontSize: 13, fontWeight: 600, color: S.text, marginBottom: 6 }}>{term.translation}</div>
          {term.definition && (
            <div style={{ fontSize: 11, color: S.muted, lineHeight: 1.4, marginBottom: 4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {term.definition}
            </div>
          )}
          {term.example && (
            <div style={{ fontSize: 11, color: S.muted, fontStyle: 'italic', marginBottom: 6,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              "{term.example}"
            </div>
          )}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: lvl.bg, color: lvl.color }}>{lvl.label}</span>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: S.muted }}>{term.category}</span>
          </div>
          <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
            width: 8, height: 8, background: S.surface, border: `1px solid ${S.border}`,
            borderTop: 'none', borderLeft: 'none', rotate: '45deg' }} />
        </div>
      )}

      {/* Label */}
      <div style={{ marginTop: 6, width: 120, textAlign: 'center', fontSize: 10, color: S.muted,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {term.translation}
      </div>
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────
type MaterialType = 'lecture_slides' | 'video' | 'document' | 'code_example' | 'project_template' | 'reference';

interface Material {
  id: number;
  title: string;
  description: string;
  type: MaterialType;
  fileUrl: string;
  isPublic: boolean;
  createdAt: string;
  course?: { id: number; title: string };
  uploadedBy?: { id: number; firstName: string; lastName: string };
}

// ── Constants ──────────────────────────────────────────────────────
const BOOKS_PER_PAGE = 18;
const BOOKS_PER_SHELF = 6;

const TYPE_META: Record<MaterialType, { label: string; spine: string; cover: string; icon: React.ReactNode }> = {
  lecture_slides: {
    label: 'Лекции',
    spine: '#1d4ed8',
    cover: 'linear-gradient(160deg,#1e40af 0%,#2563eb 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.062 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"/>
      </svg>
    ),
  },
  video: {
    label: 'Видео',
    spine: '#b91c1c',
    cover: 'linear-gradient(160deg,#991b1b 0%,#dc2626 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M16 3.75v8.5a.75.75 0 0 1-1.136.643L11 10.575v.675A1.75 1.75 0 0 1 9.25 13h-7.5A1.75 1.75 0 0 1 0 11.25v-6.5C0 3.784.784 3 1.75 3h7.5c.966 0 1.75.784 1.75 1.75v.675l3.864-2.318A.75.75 0 0 1 16 3.75Z"/>
      </svg>
    ),
  },
  document: {
    label: 'Документы',
    spine: '#15803d',
    cover: 'linear-gradient(160deg,#166534 0%,#16a34a 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z"/>
      </svg>
    ),
  },
  code_example: {
    label: 'Примеры кода',
    spine: '#b45309',
    cover: 'linear-gradient(160deg,#92400e 0%,#d97706 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25Zm7.47 3.97a.75.75 0 0 1 1.06 1.06L9.06 7.75l1.22 1.22a.75.75 0 1 1-1.06 1.06L7.47 8.28a.75.75 0 0 1 0-1.06ZM6.53 7.47 5.31 6.25a.75.75 0 1 0-1.06 1.06l1.22 1.22-1.22 1.22a.75.75 0 1 0 1.06 1.06l1.22-1.22a.75.75 0 0 0 0-1.06Z"/>
      </svg>
    ),
  },
  project_template: {
    label: 'Шаблоны',
    spine: '#7c3aed',
    cover: 'linear-gradient(160deg,#5b21b6 0%,#7c3aed 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.75v2.25a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75v-1H1.75A1.75 1.75 0 0 1 0 9.5v-6.5C0 2.007.784 1.25 1.75 1ZM1.5 3.25v6.25c0 .138.112.25.25.25H2.25v-1A.75.75 0 0 1 3 8h3.25V2.5h-4.5a.25.25 0 0 0-.25.25ZM6.5 2.5v7H3.5v1.5H6V10.5h.5v-8Z"/>
      </svg>
    ),
  },
  reference: {
    label: 'Справочники',
    spine: '#0e7490',
    cover: 'linear-gradient(160deg,#155e75 0%,#0891b2 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v1.75h1.25a.75.75 0 0 1 0 1.5H8.5v3.25a.75.75 0 0 1-1.5 0V8H5.75a.75.75 0 0 1 0-1.5H7V4.75a.75.75 0 0 1 1.5 0Z"/>
      </svg>
    ),
  },
};

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Новые сначала' },
  { value: 'createdAt_asc', label: 'Старые сначала' },
  { value: 'title_asc', label: 'По названию (А–Я)' },
  { value: 'title_desc', label: 'По названию (Я–А)' },
];

// ── Icons (lucide-react) ───────────────────────────────────────────
import { Search, ChevronLeft, ChevronRight, ExternalLink, Library, X } from 'lucide-react';
const SearchIcon      = () => <Search       size={14} />;
const ChevronLeftIcon  = () => <ChevronLeft  size={16} />;
const ChevronRightIcon = () => <ChevronRight size={16} />;
const ExternalLinkIcon = () => <ExternalLink size={13} />;
const LibraryIcon      = () => <Library      size={24} />;
const XIcon            = () => <X            size={14} />;

// ── Styles ─────────────────────────────────────────────────────────
const S = {
  bg: 'var(--color-canvas-default)',
  surface: 'var(--color-canvas-overlay)',
  border: 'var(--color-border-default)',
  text: 'var(--color-fg-default)',
  muted: 'var(--color-fg-muted)',
  accent: '#2f81f7',
  hover: 'var(--color-neutral-1)',
} as const;

// ── BookCard ───────────────────────────────────────────────────────
function BookCard({ material }: { material: Material }) {
  const [hovered, setHovered] = useState(false);
  const meta = TYPE_META[material.type];
  const date = new Date(material.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Book */}
      <a
        href={material.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={material.title}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 120,
          height: 160,
          borderRadius: '2px 6px 6px 2px',
          background: meta.cover,
          border: `1px solid rgba(255,255,255,0.08)`,
          boxShadow: hovered
            ? `0 12px 28px rgba(0,0,0,0.6), -4px 0 0 rgba(0,0,0,0.4), inset 2px 0 0 rgba(255,255,255,0.12)`
            : `-4px 0 0 rgba(0,0,0,0.3), inset 2px 0 0 rgba(255,255,255,0.08), 2px 4px 12px rgba(0,0,0,0.4)`,
          transform: hovered ? 'translateY(-12px) rotate(-1deg)' : 'translateY(0) rotate(0deg)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Spine line */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '2px 0 0 2px',
        }} />

        {/* Icon area */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'rgba(255,255,255,0.9)',
          paddingTop: 20,
        }}>
          {meta.icon}
        </div>

        {/* Title */}
        <div style={{
          padding: '8px 10px 10px 14px',
          color: '#fff',
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}>
            {material.title}
          </div>
        </div>

        {/* External link icon on hover */}
        {hovered && (
          <div style={{
            position: 'absolute', top: 6, right: 6,
            color: 'rgba(255,255,255,0.8)',
          }}>
            <ExternalLinkIcon />
          </div>
        )}
      </a>

      {/* Hover tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          background: S.surface,
          border: `1px solid ${S.border}`,
          borderRadius: 8,
          padding: '10px 12px',
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: S.text, marginBottom: 4, lineHeight: 1.4 }}>
            {material.title}
          </div>
          {material.description && (
            <div style={{
              fontSize: 11, color: S.muted, marginBottom: 6, lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {material.description}
            </div>
          )}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, padding: '2px 6px', borderRadius: 4,
              background: 'rgba(47,129,247,0.15)', color: S.accent,
              border: `1px solid rgba(47,129,247,0.25)`,
            }}>
              {meta.label}
            </span>
            {material.course && (
              <span style={{ fontSize: 10, color: S.muted }}>{material.course.title}</span>
            )}
          </div>
          <div style={{ fontSize: 10, color: S.muted, marginTop: 5 }}>{date}</div>
          {/* Arrow */}
          <div style={{
            position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
            width: 8, height: 8, background: S.surface,
            border: `1px solid ${S.border}`, borderTop: 'none', borderLeft: 'none',
            rotate: '45deg',
          }} />
        </div>
      )}

      {/* Book label below */}
      <div style={{
        marginTop: 6, width: 120, textAlign: 'center',
        fontSize: 10, color: S.muted,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {material.course?.title || meta.label}
      </div>
    </div>
  );
}

// ── Shelf ──────────────────────────────────────────────────────────
function Shelf({ books }: { books: Material[] }) {
  // Pad to full shelf width for uniform look
  const filled = [...books];
  while (filled.length < BOOKS_PER_SHELF) filled.push(null as any);

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Books row */}
      <div style={{
        display: 'flex', gap: 16, alignItems: 'flex-end',
        padding: '24px 24px 0',
        background: S.surface,
        borderRadius: '8px 8px 0 0',
        border: `1px solid ${S.border}`,
        borderBottom: 'none',
        minHeight: 210,
        flexWrap: 'nowrap',
      }}>
        {filled.map((m, i) =>
          m ? (
            <BookCard key={m.id} material={m} />
          ) : (
            <div key={`empty-${i}`} style={{ width: 120, height: 160, opacity: 0.12 }}>
              <div style={{
                width: 120, height: 160,
                borderRadius: '2px 6px 6px 2px',
                border: `2px dashed ${S.border}`,
              }} />
            </div>
          )
        )}
      </div>
      {/* Shelf plank */}
      <div style={{
        height: 14,
        background: 'linear-gradient(180deg, #3d2b1f 0%, #2a1d13 60%, #1a1108 100%)',
        borderRadius: '0 0 4px 4px',
        border: `1px solid #4a3525`,
        borderTop: '2px solid #5c3d28',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }} />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────
export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<MaterialType | 'all'>('all');
  const [sort, setSort] = useState('createdAt_desc');
  const [page, setPage] = useState(1);
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabCategory, setVocabCategory] = useState('');
  const [vocabPage, setVocabPage] = useState(1);

  const { data, isLoading, error } = useSWR<Material[]>(
    `/materials`,
    (url: string) => apiClient.get(url),
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );

  const { data: vocabData } = useSWR<VocabTerm[]>(
    '/vocabulary',
    (url: string) => apiClient.get(url),
    { revalidateOnFocus: false, dedupingInterval: 60000 },
  );

  const filtered = useMemo(() => {
    let list = data || [];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.course?.title?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') {
      list = list.filter(m => m.type === typeFilter);
    }

    const [field, dir] = sort.split('_');
    list = [...list].sort((a, b) => {
      const aVal = field === 'createdAt' ? new Date(a.createdAt).getTime() : a.title.toLowerCase();
      const bVal = field === 'createdAt' ? new Date(b.createdAt).getTime() : b.title.toLowerCase();
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, search, typeFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BOOKS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * BOOKS_PER_PAGE, currentPage * BOOKS_PER_PAGE);

  // Split into shelves
  const shelves: Material[][] = [];
  for (let i = 0; i < pageItems.length; i += BOOKS_PER_SHELF) {
    shelves.push(pageItems.slice(i, i + BOOKS_PER_SHELF));
  }
  if (shelves.length === 0) shelves.push([]);

  const typeCounts = useMemo(() => {
    const m: Partial<Record<MaterialType | 'all', number>> = { all: data?.length || 0 };
    (data || []).forEach(mat => {
      m[mat.type] = (m[mat.type] || 0) + 1;
    });
    return m;
  }, [data]);

  return (
    <div style={{ minHeight: '100vh', background: S.bg, color: S.text, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px 64px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ color: S.accent }}>
              <LibraryIcon />
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: S.text }}>
              Библиотека материалов
            </h1>
          </div>
          <p style={{ margin: 0, color: S.muted, fontSize: 14 }}>
            Учебные материалы, лекции, видео и примеры кода по всем курсам
          </p>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
          marginBottom: 28,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <span style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: S.muted, pointerEvents: 'none',
            }}>
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск по названию, описанию, курсу..."
              style={{
                width: '100%', paddingLeft: 32, paddingRight: search ? 32 : 12,
                paddingTop: 7, paddingBottom: 7, boxSizing: 'border-box',
                background: S.surface, border: `1px solid ${S.border}`,
                borderRadius: 6, color: S.text, fontSize: 14, outline: 'none',
              }}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                style={{
                  position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: S.muted, padding: 0,
                }}
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            style={{
              padding: '7px 10px', background: S.surface, border: `1px solid ${S.border}`,
              borderRadius: 6, color: S.text, fontSize: 13, cursor: 'pointer', outline: 'none',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Count badge */}
          <div style={{
            padding: '6px 12px', borderRadius: 6,
            background: S.surface, border: `1px solid ${S.border}`,
            fontSize: 13, color: S.muted, whiteSpace: 'nowrap',
          }}>
            {filtered.length} {filtered.length === 1 ? 'материал' : filtered.length < 5 ? 'материала' : 'материалов'}
          </div>
        </div>

        {/* Type filter tabs */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32,
          borderBottom: `1px solid ${S.border}`, paddingBottom: 12,
        }}>
          {([['all', 'Все'] as const, ...Object.entries(TYPE_META).map(([k, v]) => [k, v.label] as const)]).map(([type, label]) => {
            const active = typeFilter === type;
            return (
              <button
                key={type}
                onClick={() => { setTypeFilter(type as MaterialType | 'all'); setPage(1); }}
                style={{
                  padding: '5px 12px', borderRadius: 16, fontSize: 12, cursor: 'pointer',
                  border: active ? `1px solid ${S.accent}` : `1px solid ${S.border}`,
                  background: active ? 'rgba(47,129,247,0.15)' : S.surface,
                  color: active ? S.accent : S.muted,
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                {type !== 'all' && (
                  <span style={{
                    width: 8, height: 8, borderRadius: 2,
                    background: TYPE_META[type as MaterialType].spine,
                    display: 'inline-block', flexShrink: 0,
                  }} />
                )}
                {label}
                <span style={{
                  fontSize: 10, opacity: 0.7,
                  background: active ? 'rgba(47,129,247,0.2)' : 'rgba(255,255,255,0.06)',
                  borderRadius: 8, padding: '0 5px',
                }}>
                  {typeCounts[type as MaterialType | 'all'] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Vocab Section ──────────────────────────────────────── */}
        {vocabData && vocabData.length > 0 && (() => {
          const VOCAB_PER_SHELF = 6;
          const VOCAB_PER_PAGE = 18;
          const vocabCategories = Array.from(new Set(vocabData.map(t => t.category)));
          const filteredVocab = vocabData.filter(t =>
            (!vocabSearch || t.term.toLowerCase().includes(vocabSearch.toLowerCase()) || t.translation.toLowerCase().includes(vocabSearch.toLowerCase())) &&
            (!vocabCategory || t.category === vocabCategory)
          );
          const totalVocabPages = Math.max(1, Math.ceil(filteredVocab.length / VOCAB_PER_PAGE));
          const curVocabPage = Math.min(vocabPage, totalVocabPages);
          const pageVocab = filteredVocab.slice((curVocabPage - 1) * VOCAB_PER_PAGE, curVocabPage * VOCAB_PER_PAGE);
          const vocabShelves: VocabTerm[][] = [];
          for (let i = 0; i < pageVocab.length; i += VOCAB_PER_SHELF) vocabShelves.push(pageVocab.slice(i, i + VOCAB_PER_SHELF));
          if (vocabShelves.length === 0) vocabShelves.push([]);

          return (
            <div style={{ marginBottom: 48 }}>
              {/* Vocab header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>📖</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: S.text }}>Technical English</span>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 10, background: 'rgba(47,129,247,0.15)', color: S.accent, border: `1px solid rgba(47,129,247,0.25)` }}>
                      {filteredVocab.length} терминов
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>IT-словарь с транскрипцией, переводом и примерами</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: S.muted, pointerEvents: 'none' }}><SearchIcon /></span>
                    <input
                      value={vocabSearch}
                      onChange={e => { setVocabSearch(e.target.value); setVocabPage(1); }}
                      placeholder="Поиск термина..."
                      style={{ paddingLeft: 28, paddingRight: 12, paddingTop: 6, paddingBottom: 6, background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, color: S.text, fontSize: 13, outline: 'none', width: 180 }}
                    />
                  </div>
                  <select value={vocabCategory} onChange={e => { setVocabCategory(e.target.value); setVocabPage(1); }}
                    style={{ padding: '6px 10px', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 6, color: S.text, fontSize: 13, outline: 'none' }}>
                    <option value="">Все категории</option>
                    {vocabCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Vocab shelves */}
              {vocabShelves.map((shelf, si) => {
                const filled = [...shelf];
                while (filled.length < VOCAB_PER_SHELF) filled.push(null as any);
                return (
                  <div key={si} style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', padding: '24px 24px 0',
                      background: S.surface, borderRadius: '8px 8px 0 0', border: `1px solid ${S.border}`,
                      borderBottom: 'none', minHeight: 210, flexWrap: 'nowrap' }}>
                      {filled.map((t, i) => t
                        ? <VocabBookCard key={t.id} term={t} />
                        : <div key={`ev-${i}`} style={{ width: 120, height: 160, opacity: 0.1 }}>
                            <div style={{ width: 120, height: 160, borderRadius: '2px 6px 6px 2px', border: `2px dashed ${S.border}` }} />
                          </div>
                      )}
                    </div>
                    <div style={{ height: 14, background: 'linear-gradient(180deg,#3d2b1f 0%,#2a1d13 60%,#1a1108 100%)',
                      borderRadius: '0 0 4px 4px', border: `1px solid #4a3525`, borderTop: '2px solid #5c3d28',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
                  </div>
                );
              })}

              {/* Vocab pagination */}
              {totalVocabPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8 }}>
                  <PaginationButton onClick={() => setVocabPage(p => Math.max(1, p - 1))} disabled={curVocabPage === 1}><ChevronLeftIcon /></PaginationButton>
                  {Array.from({ length: totalVocabPages }, (_, i) => i + 1).map(n => (
                    <PaginationButton key={n} onClick={() => setVocabPage(n)} active={curVocabPage === n}>{n}</PaginationButton>
                  ))}
                  <PaginationButton onClick={() => setVocabPage(p => Math.min(totalVocabPages, p + 1))} disabled={curVocabPage === totalVocabPages}><ChevronRightIcon /></PaginationButton>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: 1, background: S.border, margin: '32px 0 0' }} />
            </div>
          );
        })()}

        {/* Content */}
        {isLoading ? (
          <LoadingShelves />
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#f85149' }}>
            Ошибка загрузки материалов
          </div>
        ) : filtered.length === 0 ? (
          <EmptyShelf search={search} typeFilter={typeFilter} />
        ) : (
          <>
            {shelves.map((shelf, i) => (
              <Shelf key={i} books={shelf} />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: 4, marginTop: 32,
              }}>
                <PaginationButton
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon />
                </PaginationButton>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                  .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                    if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === '...' ? (
                      <span key={`dots-${i}`} style={{ padding: '0 4px', color: S.muted }}>…</span>
                    ) : (
                      <PaginationButton
                        key={n}
                        onClick={() => setPage(n as number)}
                        active={currentPage === n}
                      >
                        {n}
                      </PaginationButton>
                    )
                  )}

                <PaginationButton
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon />
                </PaginationButton>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: S.muted }}>
              Страница {currentPage} из {totalPages} · {filtered.length} материалов
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────
function PaginationButton({ children, onClick, active, disabled }: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, padding: '0 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 6, fontSize: 13, cursor: disabled ? 'default' : 'pointer',
        border: active ? `1px solid ${S.accent}` : `1px solid ${S.border}`,
        background: active ? 'rgba(47,129,247,0.2)' : S.surface,
        color: active ? S.accent : disabled ? S.border : S.muted,
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function LoadingShelves() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {[0, 1, 2].map(si => (
        <div key={si}>
          <div style={{
            display: 'flex', gap: 16, alignItems: 'flex-end',
            padding: '24px 24px 0',
            background: S.surface,
            border: `1px solid ${S.border}`,
            borderBottom: 'none',
            borderRadius: '8px 8px 0 0',
            minHeight: 210,
          }}>
            {Array.from({ length: BOOKS_PER_SHELF }).map((_, bi) => (
              <div key={bi} style={{
                width: 120, height: 160,
                borderRadius: '2px 6px 6px 2px',
                background: `linear-gradient(90deg,${S.hover} 25%,#1c2535 50%,${S.hover} 75%)`,
                backgroundSize: '200% 100%',
                animation: `shimmer 1.5s infinite`,
                animationDelay: `${bi * 0.1}s`,
              }} />
            ))}
          </div>
          <div style={{ height: 14, background: '#2a1d13', borderRadius: '0 0 4px 4px', border: `1px solid #4a3525` }} />
        </div>
      ))}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

function EmptyShelf({ search, typeFilter }: { search: string; typeFilter: string }) {
  return (
    <div>
      <div style={{
        display: 'flex', gap: 16, alignItems: 'flex-end',
        padding: '24px 24px 0',
        background: S.surface,
        border: `1px solid ${S.border}`,
        borderBottom: 'none',
        borderRadius: '8px 8px 0 0',
        minHeight: 210,
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', paddingBottom: 24, color: S.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: S.text, marginBottom: 6 }}>
            {search || typeFilter !== 'all' ? 'Ничего не найдено' : 'Библиотека пуста'}
          </div>
          <div style={{ fontSize: 13 }}>
            {search ? `По запросу «${search}» материалов не найдено` : typeFilter !== 'all' ? 'Нет материалов этого типа' : 'Материалы ещё не добавлены'}
          </div>
        </div>
      </div>
      <div style={{ height: 14, background: 'linear-gradient(180deg,#3d2b1f,#1a1108)', borderRadius: '0 0 4px 4px', border: `1px solid #4a3525` }} />
    </div>
  );
}
