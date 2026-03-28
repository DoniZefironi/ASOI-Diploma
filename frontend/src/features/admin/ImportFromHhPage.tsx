'use client';

import { useState } from 'react';
import { apiClient } from '@/shared/api/client';

// ── Icons ──────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14ZM7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.97a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.779a.749.749 0 1 1 1.06-1.06Z"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
  </svg>
);

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" strokeOpacity="0.3"/>
    <path d="M8 2a6 6 0 0 1 6 6" strokeLinecap="round"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/>
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────
interface ImportResult {
  imported: number;
  skipped: number;
  items: Array<{ id: number; title: string; company: string; url: string }>;
}

interface CleanupResult {
  checked: number;
  removed: number;
}

// ── Component ──────────────────────────────────────────────────────
export default function ImportFromHhPage() {
  const [searchQuery, setSearchQuery] = useState('стажировка IT');
  const [limit, setLimit] = useState(20);
  const [isImporting, setIsImporting] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiClient.post('/internships/admin/import-hh', { searchQuery, limit });
      setResult({ imported: data?.imported ?? 0, skipped: data?.skipped ?? 0, items: data?.items ?? [] });
    } catch (err: any) {
      setError(err.message || 'Ошибка при импорте вакансий');
    } finally {
      setIsImporting(false);
    }
  };

  const handleScheduledImport = async () => {
    setIsImporting(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiClient.get('/internships/admin/import-hh-scheduled');
      setResult({ imported: data?.imported ?? 0, skipped: data?.skipped ?? 0, items: data?.items ?? [] });
    } catch (err: any) {
      setError(err.message || 'Ошибка при автоматическом импорте');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('Проверить все вакансии с HH.ru и удалить те, которых больше нет? Это может занять некоторое время.')) return;
    setIsCleaning(true);
    setError(null);
    setCleanupResult(null);
    try {
      const data = await apiClient.post('/internships/admin/cleanup-hh', {});
      setCleanupResult({ checked: data?.checked ?? 0, removed: data?.removed ?? 0 });
    } catch (err: any) {
      setError(err.message || 'Ошибка при очистке вакансий');
    } finally {
      setIsCleaning(false);
    }
  };

  const card: React.CSSProperties = {
    background: '#161b22', border: '1px solid #30363d', borderRadius: 6,
  };
  const cardHeader: React.CSSProperties = {
    padding: '12px 16px', borderBottom: '1px solid #21262d',
  };
  const cardBody: React.CSSProperties = { padding: '16px' };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#e6edf3', marginBottom: 6,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '5px 12px', fontSize: 13, color: '#e6edf3',
    background: '#0d1117', border: '1px solid #30363d', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box',
  };
  const hintStyle: React.CSSProperties = { fontSize: 12, color: '#8b949e', marginTop: 4 };
  const btnPrimary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 16px', fontSize: 13, fontWeight: 600,
    color: '#fff', background: '#2f81f7',
    border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer',
  };
  const btnSecondary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 16px', fontSize: 13, fontWeight: 500,
    color: '#e6edf3', background: '#21262d',
    border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer',
  };

  const AUTO_QUERIES = [
    'стажировка IT', 'стажер программист', 'intern developer',
    'стажировка frontend', 'стажировка backend', 'стажировка аналитик',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#e6edf3', margin: '0 0 4px' }}>
          Импорт стажировок с HH.ru
        </h1>
        <p style={{ fontSize: 13, color: '#8b949e', margin: 0 }}>
          Автоматическое получение вакансий с HeadHunter и добавление в базу
        </p>
      </div>

      {/* Manual import */}
      <div style={card}>
        <div style={cardHeader}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', margin: 0 }}>Ручной импорт</p>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '2px 0 0' }}>
            Получите вакансии по произвольному поисковому запросу
          </p>
        </div>
        <div style={cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle} htmlFor="search-query">Поисковый запрос</label>
              <input
                id="search-query"
                style={inputStyle}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="стажировка IT"
              />
              <p style={hintStyle}>Например: стажировка frontend, intern developer, стажер аналитик</p>
            </div>
            <div>
              <label style={labelStyle} htmlFor="limit">Количество вакансий</label>
              <input
                id="limit"
                type="number"
                style={inputStyle}
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                min={1}
                max={100}
              />
              <p style={hintStyle}>Максимум 100 за раз</p>
            </div>
          </div>
          <button
            onClick={handleImport}
            disabled={isImporting}
            style={{ ...btnPrimary, opacity: isImporting ? 0.6 : 1, cursor: isImporting ? 'not-allowed' : 'pointer' }}
          >
            {isImporting
              ? <><span style={{ animation: 'spin 1s linear infinite', display: 'flex' }}><SpinnerIcon /></span> Импорт...</>
              : <><DownloadIcon /> Импортировать вакансии</>
            }
          </button>
        </div>
      </div>

      {/* Auto import */}
      <div style={card}>
        <div style={cardHeader}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', margin: 0 }}>Автоматический импорт</p>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '2px 0 0' }}>
            Обход по нескольким популярным запросам — по 10 вакансий на каждый
          </p>
        </div>
        <div style={cardBody}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {AUTO_QUERIES.map(q => (
              <span key={q} style={{
                fontSize: 12, color: '#8b949e', background: '#21262d',
                border: '1px solid #30363d', borderRadius: 20, padding: '2px 10px',
              }}>
                {q}
              </span>
            ))}
          </div>
          <p style={{ ...hintStyle, marginBottom: 12 }}>По 10 вакансий на каждый запрос (всего до {AUTO_QUERIES.length * 10})</p>
          <button
            onClick={handleScheduledImport}
            disabled={isImporting}
            style={{ ...btnSecondary, opacity: isImporting ? 0.6 : 1, cursor: isImporting ? 'not-allowed' : 'pointer' }}
          >
            {isImporting
              ? <><span style={{ animation: 'spin 1s linear infinite', display: 'flex' }}><SpinnerIcon /></span> Импорт...</>
              : <><SearchIcon /> Запустить автоматический импорт</>
            }
          </button>
        </div>
      </div>

      {/* Cleanup stale */}
      <div style={card}>
        <div style={cardHeader}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', margin: 0 }}>Очистка устаревших вакансий</p>
          <p style={{ fontSize: 12, color: '#8b949e', margin: '2px 0 0' }}>
            Проверить каждую вакансию из HH.ru и удалить те, которых больше нет на сайте
          </p>
        </div>
        <div style={cardBody}>
          <p style={{ ...hintStyle, marginBottom: 12 }}>
            Сервис обращается к HH.ru API для каждой сохранённой вакансии. Занимает время пропорционально их количеству.
          </p>
          <button
            onClick={handleCleanup}
            disabled={isCleaning || isImporting}
            style={{ ...btnSecondary, color: '#f85149', borderColor: 'rgba(248,81,73,0.4)', opacity: (isCleaning || isImporting) ? 0.6 : 1, cursor: (isCleaning || isImporting) ? 'not-allowed' : 'pointer' }}
          >
            {isCleaning
              ? <><span style={{ animation: 'spin 1s linear infinite', display: 'flex' }}><SpinnerIcon /></span> Проверка...</>
              : <><TrashIcon /> Удалить устаревшие вакансии</>
            }
          </button>
        </div>
      </div>

      {/* Cleanup result */}
      {cleanupResult && (
        <div style={{ ...card, border: '1px solid rgba(248,81,73,0.3)' }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#3fb950', display: 'flex' }}><CheckIcon /></span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', margin: 0 }}>Очистка завершена</p>
              <p style={{ fontSize: 12, color: '#8b949e', margin: '2px 0 0' }}>
                Проверено: <strong style={{ color: '#e6edf3' }}>{cleanupResult.checked}</strong>
                {' '}· Удалено: <strong style={{ color: '#f85149' }}>{cleanupResult.removed}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ ...card, border: '1px solid rgba(248,81,73,0.4)' }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#f85149', display: 'flex' }}><AlertIcon /></span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f85149', margin: 0 }}>Ошибка</p>
              <p style={{ fontSize: 12, color: '#8b949e', margin: '2px 0 0' }}>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          <div style={{ ...card, border: '1px solid rgba(63,185,80,0.4)' }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#3fb950', display: 'flex' }}><CheckIcon /></span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#3fb950', margin: 0 }}>Импорт завершён</p>
                <p style={{ fontSize: 12, color: '#8b949e', margin: '2px 0 0' }}>
                  Импортировано: <strong style={{ color: '#3fb950' }}>{result.imported}</strong>
                  {' '}· Пропущено (дубликаты): {result.skipped}
                </p>
              </div>
            </div>
          </div>

          {result.items.length > 0 && (
            <div style={card}>
              <div style={cardHeader}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', margin: 0 }}>
                  Импортированные вакансии ({result.items.length})
                </p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #21262d' }}>
                      <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Вакансия</th>
                      <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Компания</th>
                      <th style={{ padding: '8px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ссылка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #21262d' }}>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: '#e6edf3' }}>{item.title}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: '#8b949e' }}>{item.company}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#2f81f7', textDecoration: 'none' }}
                          >
                            Открыть <ExternalLinkIcon />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
