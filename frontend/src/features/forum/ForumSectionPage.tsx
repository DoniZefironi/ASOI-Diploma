'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumSection, ForumTopic, CreateTopicDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';
import { ArrowLeft, MessageSquare, Eye, Pin, Lock, Plus, Hash, BookOpen, Clock } from 'lucide-react';
import { Modal as SharedModal, ModalField, ModalCancelBtn, ModalSubmitBtn, modalInputStyle } from '@/shared/ui/modal';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} дн. назад`;
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function pluralize(n: number, one: string, few: string, many: string) {
  const abs = Math.abs(n) % 100, m = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (m === 1) return one;
  if (m >= 2 && m <= 4) return few;
  return many;
}

const btnGreen: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 16px', fontSize: 13, fontWeight: 600,
  color: '#fff', background: '#2da44e',
  border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer',
};

export function ForumSectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [sectionId, setSectionId] = useState<number | null>(null);
  const [section, setSection] = useState<ForumSection | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');

  useEffect(() => {
    if (params?.id) setSectionId(parseInt(params.id as string));
    else router.push('/forum');
  }, [params, router]);

  useEffect(() => { if (sectionId) loadData(); }, [sectionId]);

  const loadData = async () => {
    if (!sectionId) return;
    try {
      const [s, t] = await Promise.all([forumApi.getSection(sectionId), forumApi.getTopicsBySection(sectionId)]);
      setSection(s); setTopics(t || []);
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  const handleDeleteTopic = async (id: number) => {
    if (!confirm('Удалить тему?')) return;
    try { await forumApi.deleteTopic(id); setTopics(t => t.filter(x => x.id !== id)); }
    catch { alert('Не удалось удалить тему'); }
  };

  if (isLoading) return <Spinner />;
  if (!section) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--color-fg-muted)' }}>Раздел не найден</p></div>;

  const pinnedTopics = topics.filter(t => t.isPinned);
  const normalTopics = topics.filter(t => !t.isPinned);
  const displayed = filter === 'pinned' ? pinnedTopics : [...pinnedTopics, ...normalTopics];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0' }}>
      <div className="gh-container" style={{ maxWidth: 1100 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--color-fg-muted)' }}>
          <button onClick={() => router.push('/forum')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', padding: 0, fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
          >
            <ArrowLeft size={14} /> Форум
          </button>
          <span style={{ color: 'var(--color-border-default)' }}>/</span>
          <span style={{ color: 'var(--color-fg-default)', fontWeight: 600 }}>{section.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>

          {/* ── Main column ─────────────────────────────────────── */}
          <div>
            {/* Filter tabs + new topic */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 2, background: 'var(--color-canvas-overlay)', borderRadius: 8, padding: 3, border: '1px solid var(--color-border-default)' }}>
                {(['all', 'pinned'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: '5px 14px', fontSize: 13, fontWeight: 500,
                      background: filter === f ? 'var(--color-accent-emphasis)' : 'transparent',
                      color: filter === f ? '#fff' : 'var(--color-fg-muted)',
                      border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all 120ms',
                    }}
                  >
                    {f === 'all' ? `Все (${topics.length})` : `Закреплённые (${pinnedTopics.length})`}
                  </button>
                ))}
              </div>
              {user && (
                <button style={btnGreen} onClick={() => setShowCreateModal(true)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#2c974b')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#2da44e')}
                >
                  <Plus size={14} /> Новая тема
                </button>
              )}
            </div>

            {/* Topic list */}
            {displayed.length === 0 ? (
              <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 10, padding: '48px 24px', textAlign: 'center' }}>
                <MessageSquare size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>Тем пока нет</p>
                <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Будьте первым!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--color-canvas-overlay)', borderRadius: 10, border: '1px solid var(--color-border-default)', overflow: 'hidden' }}>
                {displayed.map((topic, i) => {
                  const authorName = topic.author
                    ? [topic.author.firstName, topic.author.lastName].filter(Boolean).join(' ')
                    : 'Аноним';
                  const letter = authorName.charAt(0).toUpperCase();
                  const activity = topic.lastPostAt || topic.createdAt;

                  return (
                    <div
                      key={topic.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 0,
                        borderBottom: i < displayed.length - 1 ? '1px solid var(--color-border-muted)' : 'none',
                        background: topic.isPinned ? 'rgba(47,129,247,0.03)' : 'transparent',
                        transition: 'background 100ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
                      onMouseLeave={e => (e.currentTarget.style.background = topic.isPinned ? 'rgba(47,129,247,0.03)' : 'transparent')}
                    >
                      {/* Views score */}
                      <div style={{ width: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 0', flexShrink: 0, borderRight: '1px solid var(--color-border-muted)' }}>
                        <Eye size={14} color="var(--color-fg-subtle)" />
                        <span style={{ fontSize: 11, color: 'var(--color-fg-subtle)', marginTop: 3, fontWeight: 500 }}>{topic.viewsCount || 0}</span>
                      </div>

                      {/* Main */}
                      <div style={{ flex: 1, padding: '14px 16px', minWidth: 0 }}>
                        {/* Badges row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 5 }}>
                          {topic.isPinned && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#2f81f7', background: 'rgba(47,129,247,0.1)', padding: '1px 7px', borderRadius: 20 }}>
                              <Pin size={10} /> Закреплено
                            </span>
                          )}
                          {topic.isClosed && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--color-fg-muted)', background: 'var(--color-border-muted)', padding: '1px 7px', borderRadius: 20 }}>
                              <Lock size={10} /> Закрыто
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <Link
                          href={`/forum/topic/${topic.id}`}
                          style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-fg-default)', textDecoration: 'none', display: 'block', marginBottom: 6, lineHeight: 1.4 }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-default)')}
                        >
                          {topic.title}
                        </Link>

                        {/* Meta */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-accent-emphasis)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                            {letter}
                          </div>
                          <Link
                            href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                            style={{ color: 'var(--color-fg-muted)', textDecoration: 'none', fontWeight: 500 }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
                          >
                            {authorName}
                          </Link>
                          <span>·</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <Clock size={11} /> {timeAgo(activity)}
                          </span>
                        </div>
                      </div>

                      {/* Reply count */}
                      <Link
                        href={`/forum/topic/${topic.id}`}
                        style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', flexShrink: 0, borderLeft: '1px solid var(--color-border-muted)' }}
                      >
                        <MessageSquare size={16} color="var(--color-fg-subtle)" />
                        <span style={{ fontSize: 11, color: 'var(--color-fg-subtle)', fontWeight: 500 }}>{topic.posts?.length ?? 0}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
              {/* Section info */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--color-border-muted)' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: 'var(--color-fg-default)' }}>{section.title}</h3>
                {section.description && (
                  <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.5 }}>{section.description}</p>
                )}
                {section.course && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-fg-muted)', background: 'var(--color-canvas-inset)', padding: '3px 10px', borderRadius: 20, border: '1px solid var(--color-border-default)' }}>
                    <BookOpen size={12} /> {section.course.name}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>Тем</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)' }}>{topics.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>Закреплено</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)' }}>{pinnedTopics.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>Просмотры</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-fg-default)' }}>
                    {topics.reduce((acc, t) => acc + (t.viewsCount || 0), 0)}
                  </span>
                </div>
              </div>

              {/* New topic button */}
              {user && (
                <div style={{ padding: 14 }}>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    style={{ ...btnGreen, width: '100%', justifyContent: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#2c974b')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#2da44e')}
                  >
                    <Plus size={14} /> Создать тему
                  </button>
                </div>
              )}
            </div>

            {/* Forum link */}
            <div style={{ marginTop: 12 }}>
              <Link
                href="/forum"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-fg-muted)', textDecoration: 'none', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border-default)', background: 'var(--color-canvas-overlay)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
              >
                <Hash size={14} /> Все разделы форума
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && sectionId && (
        <CreateTopicModal
          sectionId={sectionId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(topic) => { setShowCreateModal(false); router.push(`/forum/topic/${topic.id}`); }}
        />
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function CreateTopicModal({ sectionId, onClose, onSuccess }: { sectionId: number; onClose: () => void; onSuccess: (t: ForumTopic) => void }) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);
    try {
      const data: CreateTopicDto = { sectionId, title: formData.title, content: formData.content };
      const topic = await forumApi.createTopic(data);
      onSuccess(topic);
    } catch { alert('Не удалось создать тему'); }
    finally { setIsLoading(false); }
  };

  return (
    <SharedModal title="Новая тема" onClose={onClose} maxWidth={540}
      footer={<><ModalCancelBtn onClose={onClose} /><ModalSubmitBtn loading={isLoading} label="Создать тему" loadingLabel="Создание..." /></>}
    >
      <form onSubmit={handleSubmit}>
        <ModalField label="Заголовок" required>
          <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={modalInputStyle} placeholder="Тема вашего вопроса..." required autoFocus />
        </ModalField>
        <ModalField label="Содержание" required>
          <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} style={{ ...modalInputStyle, resize: 'vertical' }} placeholder="Опишите подробнее..." rows={6} required />
        </ModalField>
      </form>
    </SharedModal>
  );
}
