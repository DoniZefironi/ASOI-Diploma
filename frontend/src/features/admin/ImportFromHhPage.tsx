'use client';

import { useState } from 'react';
import { apiClient } from '@/shared/api/client';
import { Download, Search, Check, AlertTriangle, Loader2, ExternalLink, Trash2 } from 'lucide-react';

// ── Icons ──────────────────────────────────────────────────────────
const DownloadIcon = () => <Download size={14} />;
const SearchIcon = () => <Search size={14} />;
const CheckIcon = () => <Check size={14} />;
const AlertIcon = () => <AlertTriangle size={14} />;
const SpinnerIcon = () => <Loader2 size={14} />;
const ExternalLinkIcon = () => <ExternalLink size={12} />;
const TrashIcon = () => <Trash2 size={14} />;

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
    background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6,
  };
  const cardHeader: React.CSSProperties = {
    padding: '12px 16px', borderBottom: '1px solid #21262d',
  };
  const cardBody: React.CSSProperties = { padding: '16px' };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 6,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '5px 12px', fontSize: 13, color: 'var(--color-fg-default)',
    background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box',
  };
  const hintStyle: React.CSSProperties = { fontSize: 12, color: 'var(--color-fg-muted)', marginTop: 4 };
  const btnPrimary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 16px', fontSize: 13, fontWeight: 600,
    color: '#fff', background: '#2f81f7',
    border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer',
  };
  const btnSecondary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 16px', fontSize: 13, fontWeight: 500,
    color: 'var(--color-fg-default)', background: 'var(--color-border-muted)',
    border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer',
  };

  const AUTO_QUERIES = [
    'стажировка IT', 'стажер программист', 'intern developer',
    'стажировка frontend', 'стажировка backend', 'стажировка аналитик',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 4px' }}>
          Импорт стажировок с HH.ru
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: 0 }}>
          Автоматическое получение вакансий с HeadHunter и добавление в базу
        </p>
      </div>

      {/* Manual import */}
      <div style={card}>
        <div style={cardHeader}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Ручной импорт</p>
          <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0' }}>
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
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Автоматический импорт</p>
          <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0' }}>
            Обход по нескольким популярным запросам — по 10 вакансий на каждый
          </p>
        </div>
        <div style={cardBody}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {AUTO_QUERIES.map(q => (
              <span key={q} style={{
                fontSize: 12, color: 'var(--color-fg-muted)', background: 'var(--color-border-muted)',
                border: '1px solid var(--color-border-default)', borderRadius: 20, padding: '2px 10px',
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
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Очистка устаревших вакансий</p>
          <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0' }}>
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
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Очистка завершена</p>
              <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0' }}>
                Проверено: <strong style={{ color: 'var(--color-fg-default)' }}>{cleanupResult.checked}</strong>
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
              <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0' }}>{error}</p>
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
                <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0' }}>
                  Импортировано: <strong style={{ color: '#3fb950' }}>{result.imported}</strong>
                  {' '}· Пропущено (дубликаты): {result.skipped}
                </p>
              </div>
            </div>
          </div>

          {result.items.length > 0 && (
            <div style={card}>
              <div style={cardHeader}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>
                  Импортированные вакансии ({result.items.length})
                </p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #21262d' }}>
                      <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Вакансия</th>
                      <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Компания</th>
                      <th style={{ padding: '8px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ссылка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #21262d' }}>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--color-fg-default)' }}>{item.title}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, color: 'var(--color-fg-muted)' }}>{item.company}</td>
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
