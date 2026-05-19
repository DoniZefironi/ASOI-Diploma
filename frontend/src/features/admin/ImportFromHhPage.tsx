'use client';

import { useState } from 'react';
import { apiClient } from '@/shared/api/client';
import { Download, Search, Check, AlertTriangle, Loader2, ExternalLink, Plus, Minus } from 'lucide-react';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

const card: React.CSSProperties = { background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 8 };
const cardHeader: React.CSSProperties = { padding: '12px 16px', borderBottom: '1px solid var(--color-border-muted)' };
const cardBody: React.CSSProperties = { padding: '16px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 12px', fontSize: 13, color: 'var(--color-fg-default)', background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, outline: 'none', boxSizing: 'border-box' };
const btnPrimary: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--color-accent-emphasis)', border: 'none', borderRadius: 6, cursor: 'pointer' };

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export default function ImportFromHhPage() {
  const [query, setQuery]             = useState('software developer');
  const [category, setCategory]       = useState('software-dev');
  const [limit, setLimit]             = useState(50);
  const [jobs, setJobs]               = useState<RemotiveJob[]>([]);
  const [selected, setSelected]       = useState<Set<number>>(new Set());
  const [loading, setLoading]         = useState(false);
  const [importing, setImporting]     = useState(false);
  const [error, setError]             = useState('');
  const [importResult, setImportResult] = useState<{ ok: number; fail: number } | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setJobs([]);
    setSelected(new Set());
    setImportResult(null);
    try {
      // Remotive.com — бесплатный API с CORS, без авторизации
      const params = new URLSearchParams({ limit: String(limit) });
      if (query.trim()) params.set('search', query.trim());
      if (category) params.set('category', category);
      const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Remotive API вернул ${res.status}`);
      const data = await res.json();
      const items: RemotiveJob[] = data.jobs || [];
      setJobs(items);
      if (items.length === 0) setError('Вакансий не найдено. Попробуйте другой запрос.');
    } catch (e: any) {
      setError(e.message || 'Ошибка при загрузке вакансий');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll  = () => setSelected(new Set(jobs.map(j => j.id)));
  const selectNone = () => setSelected(new Set());

  const importSelected = async () => {
    const toImport = jobs.filter(j => selected.has(j.id));
    if (!toImport.length) return;
    setImporting(true);
    setImportResult(null);
    let ok = 0, fail = 0;
    for (const job of toImport) {
      try {
        const payload: Record<string, unknown> = {
          title:          job.title,
          company:        job.company_name,
          description:    stripHtml(job.description || '').slice(0, 2000) || 'Описание на сайте работодателя.',
          format:         'remote',
          isActive:       true,
        };
        if (job.candidate_required_location) payload.location = job.candidate_required_location;
        if (job.salary)                       payload.salary   = String(job.salary);
        if (job.url)                          payload.applicationUrl = job.url;
        if (job.company_logo)                 payload.imageUrl = job.company_logo;
        if (job.tags?.length)                 payload.tags     = job.tags.slice(0, 6);
        await apiClient.post('/internships', payload);
        ok++;
      } catch { fail++; }
    }
    setImporting(false);
    setImportResult({ ok, fail });
    setSelected(new Set());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-fg-default)', margin: '0 0 4px' }}>
          Импорт стажировок
        </h1>
        <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: 0 }}>
          Источник: <a href="https://remotive.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-fg)' }}>Remotive.com</a>
          {' '}— бесплатный каталог удалённых IT-вакансий
        </p>
      </div>

      {/* Search */}
      <div style={card}>
        <div style={cardHeader}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Поиск вакансий</p>
          <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0' }}>Источник: Remotive.com — удалённые IT-вакансии со всего мира</p>
        </div>
        <div style={cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 120px', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle} htmlFor="q">Ключевые слова (необязательно)</label>
              <input id="q" style={inputStyle} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="junior, developer, intern..." />
            </div>
            <div>
              <label style={labelStyle} htmlFor="cat">Категория</label>
              <select id="cat" style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Все категории</option>
                <option value="software-dev">Software Dev</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Fullstack</option>
                <option value="devops">DevOps / Sysadmin</option>
                <option value="data">Data</option>
                <option value="qa">QA / Testing</option>
                <option value="design">Design / UX</option>
                <option value="product">Product</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            <div>
              <label style={labelStyle} htmlFor="lim">Количество</label>
              <input id="lim" type="number" style={inputStyle} value={limit} min={1} max={100} onChange={e => setLimit(Number(e.target.value))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--color-fg-muted)', alignSelf: 'center' }}>Быстрый выбор:</span>
            {[
              { label: 'Все frontend', cat: 'frontend', q: '' },
              { label: 'Все backend', cat: 'backend', q: '' },
              { label: 'Junior dev', cat: 'software-dev', q: 'junior' },
              { label: 'Intern', cat: 'software-dev', q: 'intern' },
              { label: 'Entry level', cat: '', q: 'entry level' },
              { label: 'Всё (без фильтра)', cat: '', q: '' },
            ].map(p => (
              <button key={p.label} onClick={() => { setQuery(p.q); setCategory(p.cat); }}
                style={{ fontSize: 11, color: 'var(--color-accent-fg)', background: 'var(--color-accent-subtle)', border: '1px solid var(--color-accent-muted)', borderRadius: 20, padding: '2px 10px', cursor: 'pointer' }}>
                {p.label}
              </button>
            ))}
          </div>

          <button onClick={search} disabled={loading} style={{ ...btnPrimary, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Поиск...</> : <><Search size={14} /> Найти вакансии</>}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...card, border: '1px solid var(--color-danger-muted)', padding: '12px 16px', display: 'flex', gap: 8 }}>
          <AlertTriangle size={15} color="var(--color-danger-fg)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-danger-fg)' }}>{error}</p>
        </div>
      )}

      {/* Import result */}
      {importResult && (
        <div style={{ ...card, border: '1px solid var(--color-success-muted)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Check size={16} color="var(--color-success-fg)" />
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-success-fg)' }}>
            Импортировано: <strong>{importResult.ok}</strong>
            {importResult.fail > 0 && <>, не удалось: <strong style={{ color: 'var(--color-danger-fg)' }}>{importResult.fail}</strong></>}
          </p>
        </div>
      )}

      {/* Results */}
      {jobs.length > 0 && (
        <div style={card}>
          <div style={{ ...cardHeader, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>
              Найдено: {jobs.length} · Выбрано: {selected.size}
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={selectAll} style={{ fontSize: 12, color: 'var(--color-accent-fg)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', textDecoration: 'underline' }}>
                Выбрать все
              </button>
              <button onClick={selectNone} style={{ fontSize: 12, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', textDecoration: 'underline' }}>
                Снять
              </button>
              <button
                onClick={importSelected}
                disabled={selected.size === 0 || importing}
                style={{ ...btnPrimary, background: selected.size > 0 ? 'var(--color-success-emphasis)' : 'var(--color-canvas-inset)', color: selected.size > 0 ? '#fff' : 'var(--color-fg-subtle)', opacity: importing ? 0.6 : 1, cursor: selected.size === 0 || importing ? 'not-allowed' : 'pointer' }}>
                {importing ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Импорт...</> : <><Download size={13} /> Импортировать ({selected.size})</>}
              </button>
            </div>
          </div>

          <div style={{ maxHeight: 520, overflowY: 'auto' }}>
            {jobs.map(job => {
              const checked = selected.has(job.id);
              return (
                <div key={job.id}
                  onClick={() => toggleSelect(job.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border-muted)', cursor: 'pointer',
                    background: checked ? 'var(--color-accent-subtle)' : 'transparent',
                    transition: 'background 80ms',
                  }}
                  onMouseEnter={e => !checked && ((e.currentTarget as HTMLElement).style.background = 'var(--color-canvas-subtle)')}
                  onMouseLeave={e => !checked && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  {/* Checkbox */}
                  <div style={{ width: 18, height: 18, border: `2px solid ${checked ? 'var(--color-accent-fg)' : 'var(--color-border-default)'}`, borderRadius: 4, background: checked ? 'var(--color-accent-fg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    {checked && <Check size={11} color="#fff" />}
                  </div>

                  {/* Logo */}
                  {job.company_logo && (
                    <img src={job.company_logo} alt={job.company_name} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6, background: '#fff', flexShrink: 0 }} />
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                    <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--color-fg-muted)' }}>{job.company_name} · {job.candidate_required_location || 'Remote'}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {job.tags?.slice(0, 4).map(t => (
                        <span key={t} style={{ fontSize: 10, color: 'var(--color-fg-muted)', background: 'var(--color-canvas-inset)', padding: '1px 6px', borderRadius: 10, border: '1px solid var(--color-border-muted)' }}>{t}</span>
                      ))}
                      {job.salary && <span style={{ fontSize: 10, color: 'var(--color-success-fg)', fontWeight: 600 }}>{job.salary}</span>}
                    </div>
                  </div>

                  <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    style={{ color: 'var(--color-fg-subtle)', display: 'flex', flexShrink: 0 }}>
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
