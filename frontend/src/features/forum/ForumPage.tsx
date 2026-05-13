'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { forumApi, ForumSection } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';
import { MessageSquare, BookOpen, Plus, Trash2 } from 'lucide-react';

// ── Icons ──────────────────────────────────────────────────────────
const ChatBubbleIcon = () => <MessageSquare size={16} />;
const BookIcon = () => <BookOpen size={14} />;
const PlusIcon = () => <Plus size={14} />;
const TrashIcon = () => <Trash2 size={12} />;

export function ForumPage() {
  const { user, hasRole } = useAuth();
  const [sections, setSections] = useState<ForumSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = hasRole('admin') || hasRole('mentor_english') || hasRole('mentor_electronics') || hasRole('mentor_computer_science') || hasRole('mentor_iot');

  useEffect(() => { loadSections(); }, []);

  const loadSections = async () => {
    try {
      const data = await forumApi.getSections();
      setSections(data || []);
    } catch (error) {
      console.error('Failed to load sections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот раздел?')) return;
    try {
      await forumApi.deleteSection(id);
      setSections(sections.filter(s => s.id !== id));
    } catch {
      alert('Не удалось удалить раздел');
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Загрузка...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '24px 0' }}>
      <div className="gh-container">

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#2f81f7', display: 'flex' }}><ChatBubbleIcon /></span>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Форум</h1>
              <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: 0 }}>Обсуждайте учебные материалы и задавайте вопросы</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 16px', fontSize: 13, fontWeight: 600,
                color: '#fff', background: '#2da44e',
                border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#2c974b')}
              onMouseLeave={e => (e.currentTarget.style.background = '#2da44e')}
            >
              <PlusIcon /> Новый раздел
            </button>
          )}
        </div>

        {/* Sections list */}
        {sections.length === 0 ? (
          <div style={{
            background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6,
            padding: '48px 24px', textAlign: 'center',
          }}>
            <div style={{ color: 'var(--color-fg-muted)', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
              <ChatBubbleIcon />
            </div>
            <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px', fontSize: 15 }}>Разделов пока нет</p>
            <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Разделы форума создаются администраторами</p>
          </div>
        ) : (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, overflow: 'hidden' }}>
            {sections.map((section, index) => (
              <div
                key={section.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: index < sections.length - 1 ? '1px solid #21262d' : 'none',
                  transition: 'background 80ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-overlay)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Left: icon + info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 6, background: 'var(--color-border-muted)',
                    border: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#2f81f7', flexShrink: 0,
                  }}>
                    <ChatBubbleIcon />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/forum/${section.id}`}
                      style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-fg-default)', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#e6edf3')}
                    >
                      {section.title}
                    </Link>
                    {section.description && (
                      <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480 }}>
                        {section.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                        <ChatBubbleIcon />
                        {section.topics?.length || 0} {pluralize(section.topics?.length || 0, 'тема', 'темы', 'тем')}
                      </span>
                      {section.course && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                          <BookIcon /> {section.course.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: admin actions */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 16 }}>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 8px', fontSize: 12, color: '#f85149',
                        background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <TrashIcon /> Удалить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateSectionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); loadSections(); }}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const mod10 = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

// ── Create Section Modal ───────────────────────────────────────────
function CreateSectionModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({ title: '', description: '', courseId: '', orderIndex: '0' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forumApi.createSection({
        title: formData.title,
        description: formData.description || undefined,
        courseId: parseInt(formData.courseId),
        orderIndex: parseInt(formData.orderIndex),
        isActive: true,
      });
      onSuccess();
    } catch {
      alert('Не удалось создать раздел');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '5px 12px', fontSize: 13, color: 'var(--color-fg-default)',
    background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, width: '100%', maxWidth: 460, padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 20px', paddingBottom: 16, borderBottom: '1px solid #21262d' }}>
          Создать раздел
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Название</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Описание</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} rows={3} />
          </div>
          <div>
            <label style={labelStyle}>ID курса</label>
            <input type="number" value={formData.courseId} onChange={e => setFormData({ ...formData, courseId: e.target.value })} style={inputStyle} required />
          </div>
          <div>
            <label style={labelStyle}>Порядок</label>
            <input type="number" value={formData.orderIndex} onChange={e => setFormData({ ...formData, orderIndex: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '5px 16px', fontSize: 13, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>
              Отмена
            </button>
            <button type="submit" disabled={isLoading} style={{ padding: '5px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: '#2da44e', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer' }}>
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
