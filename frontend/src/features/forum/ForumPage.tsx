'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { forumApi, ForumSection } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';
import { MessageSquare, Plus, Trash2, BookOpen, Hash } from 'lucide-react';
import { Modal as SharedModal, ModalField, ModalCancelBtn, ModalSubmitBtn, modalInputStyle } from '@/shared/ui/modal';

// accent palette cycling by section index
const ACCENTS = [
  { border: '#2f81f7', bg: 'rgba(47,129,247,0.08)', text: '#2f81f7' },
  { border: '#a371f7', bg: 'rgba(163,113,247,0.08)', text: '#a371f7' },
  { border: '#3fb950', bg: 'rgba(63,185,80,0.08)',   text: '#3fb950' },
  { border: '#f0883e', bg: 'rgba(240,136,62,0.08)',  text: '#f0883e' },
  { border: '#39d353', bg: 'rgba(57,211,83,0.08)',   text: '#39d353' },
  { border: '#f85149', bg: 'rgba(248,81,73,0.08)',   text: '#f85149' },
];

function pluralize(n: number, one: string, few: string, many: string) {
  const abs = Math.abs(n) % 100, m = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (m === 1) return one;
  if (m >= 2 && m <= 4) return few;
  return many;
}

export function ForumPage() {
  const { user, hasRole } = useAuth();
  const [sections, setSections] = useState<ForumSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = hasRole('admin') || hasRole('mentor_english') || hasRole('mentor_electronics') || hasRole('mentor_computer_science') || hasRole('mentor_iot');

  useEffect(() => { loadSections(); }, []);

  const loadSections = async () => {
    try { setSections((await forumApi.getSections()) || []); }
    catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить раздел?')) return;
    try { await forumApi.deleteSection(id); setSections(s => s.filter(x => x.id !== id)); }
    catch { alert('Не удалось удалить'); }
  };

  if (isLoading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '32px 0' }}>
      <div className="gh-container" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <MessageSquare size={22} color="var(--color-accent-fg)" />
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-fg-default)' }}>Форум</h1>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
              Обсуждайте учебные материалы, задавайте вопросы и делитесь знаниями
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={btnGreen}
              onMouseEnter={e => (e.currentTarget.style.background = '#2c974b')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2da44e')}
            >
              <Plus size={14} /> Новый раздел
            </button>
          )}
        </div>

        {/* Total bar */}
        {sections.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '10px 16px', background: 'var(--color-canvas-overlay)', borderRadius: 8, border: '1px solid var(--color-border-default)' }}>
            <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>
              <strong style={{ color: 'var(--color-fg-default)' }}>{sections.length}</strong>{' '}
              {pluralize(sections.length, 'раздел', 'раздела', 'разделов')}
            </span>
            <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>·</span>
            <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>
              <strong style={{ color: 'var(--color-fg-default)' }}>
                {sections.reduce((acc, s) => acc + (s.topics?.length || 0), 0)}
              </strong>{' '}
              тем
            </span>
          </div>
        )}

        {/* Sections grid */}
        {sections.length === 0 ? (
          <EmptyState icon={<MessageSquare size={32} />} title="Разделов пока нет" desc="Разделы создаются администраторами" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {sections.map((section, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const topicsCount = section.topics?.length || 0;
              const letter = section.title.charAt(0).toUpperCase();

              return (
                <div
                  key={section.id}
                  style={{
                    background: 'var(--color-canvas-overlay)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 10,
                    borderLeft: `4px solid ${accent.border}`,
                    overflow: 'hidden',
                    transition: 'transform 150ms, box-shadow 150ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                >
                  <div style={{ padding: '20px 20px 16px' }}>
                    {/* Card header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 8,
                          background: accent.bg, color: accent.text,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18, fontWeight: 700, flexShrink: 0,
                        }}>
                          {letter}
                        </div>
                        <Link
                          href={`/forum/${section.id}`}
                          style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-fg-default)', textDecoration: 'none', lineHeight: 1.3 }}
                          onMouseEnter={e => (e.currentTarget.style.color = accent.text)}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-default)')}
                        >
                          {section.title}
                        </Link>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(section.id)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-fg-subtle)', padding: 4, borderRadius: 4, flexShrink: 0 }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#f85149')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-subtle)')}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    {/* Description */}
                    {section.description && (
                      <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {section.description}
                      </p>
                    )}

                    {/* Footer stats */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--color-border-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                          <Hash size={12} />
                          {topicsCount} {pluralize(topicsCount, 'тема', 'темы', 'тем')}
                        </span>
                        {section.course && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                            <BookOpen size={12} />
                            {section.course.name}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/forum/${section.id}`}
                        style={{ fontSize: 12, color: accent.text, textDecoration: 'none', fontWeight: 600 }}
                      >
                        Открыть →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateSectionModal onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); loadSections(); }} />
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Shared helpers ─────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 10, padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ color: 'var(--color-fg-subtle)', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 6px', fontSize: 16 }}>{title}</p>
      <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>{desc}</p>
    </div>
  );
}

const btnGreen: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 16px', fontSize: 13, fontWeight: 600,
  color: '#fff', background: '#2da44e',
  border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer',
};

// ── Create Section Modal ───────────────────────────────────────────
function CreateSectionModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({ title: '', description: '', courseId: '', orderIndex: '0' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      await forumApi.createSection({ title: formData.title, description: formData.description || undefined, courseId: parseInt(formData.courseId), orderIndex: parseInt(formData.orderIndex), isActive: true });
      onSuccess();
    } catch { alert('Не удалось создать раздел'); }
    finally { setIsLoading(false); }
  };

  return (
    <SharedModal title="Создать раздел" onClose={onClose}
      footer={<><ModalCancelBtn onClose={onClose} /><ModalSubmitBtn loading={isLoading} label="Создать" form="forum-section-form" /></>}
    >
      <form id="forum-section-form" onSubmit={handleSubmit}>
        <ModalField label="Название" required><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={modalInputStyle} required /></ModalField>
        <ModalField label="Описание"><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...modalInputStyle, resize: 'vertical' }} rows={3} /></ModalField>
        <ModalField label="ID курса" required><input type="number" value={formData.courseId} onChange={e => setFormData({ ...formData, courseId: e.target.value })} style={modalInputStyle} required /></ModalField>
        <ModalField label="Порядок"><input type="number" value={formData.orderIndex} onChange={e => setFormData({ ...formData, orderIndex: e.target.value })} style={modalInputStyle} /></ModalField>
      </form>
    </SharedModal>
  );
}
