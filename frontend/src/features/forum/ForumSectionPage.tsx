'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumSection, ForumTopic, CreateTopicDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';
import { ArrowLeft, MessageSquare, Eye, Pin, Lock, Plus, Clock } from 'lucide-react';

// ── Icons ──────────────────────────────────────────────────────────
const ArrowLeftIcon = () => <ArrowLeft size={14} />;
const ChatBubbleIcon = () => <MessageSquare size={14} />;
const EyeIcon = () => <Eye size={14} />;
const PinIcon = () => <Pin size={12} />;
const LockIcon = () => <Lock size={12} />;
const PlusIcon = () => <Plus size={14} />;
const ClockIcon = () => <Clock size={12} />;

export function ForumSectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [sectionId, setSectionId] = useState<number | null>(null);
  const [section, setSection] = useState<ForumSection | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (params?.id) setSectionId(parseInt(params.id as string));
    else router.push('/forum');
  }, [params, router]);

  useEffect(() => {
    if (sectionId) loadData();
  }, [sectionId]);

  const loadData = async () => {
    if (!sectionId) return;
    try {
      const [sectionData, topicsData] = await Promise.all([
        forumApi.getSection(sectionId),
        forumApi.getTopicsBySection(sectionId),
      ]);
      setSection(sectionData);
      setTopics(topicsData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTopic = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту тему?')) return;
    try {
      await forumApi.deleteTopic(id);
      setTopics(topics.filter(t => t.id !== id));
    } catch {
      alert('Не удалось удалить тему');
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

  if (!section) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Раздел не найден</p>
      </div>
    );
  }

  const pinnedTopics = topics.filter(t => t.isPinned);
  const normalTopics = topics.filter(t => !t.isPinned);
  const orderedTopics = [...pinnedTopics, ...normalTopics];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '24px 0' }}>
      <div className="gh-container">

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
          >
            <ArrowLeftIcon /> Назад к форуму
          </button>
        </div>

        {/* Section header card */}
        <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: '16px 20px', marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 6px' }}>{section.title}</h1>
          {section.description && (
            <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: '0 0 10px' }}>{section.description}</p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-fg-muted)' }}>
              <ChatBubbleIcon /> {topics.length} тем
            </span>
            {section.course && (
              <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>Курс: {section.course.name}</span>
            )}
          </div>
        </div>

        {/* Topics header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Темы</span>
          {user && (
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
              <PlusIcon /> Новая тема
            </button>
          )}
        </div>

        {/* Topics list */}
        {orderedTopics.length === 0 ? (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>Тем пока нет</p>
            <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Будьте первым, кто начнёт обсуждение!</p>
          </div>
        ) : (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, overflow: 'hidden' }}>
            {orderedTopics.map((topic, index) => {
              const authorName = topic.author
                ? [topic.author.firstName, topic.author.lastName].filter(Boolean).join(' ')
                : 'Аноним';
              const authorLetter = authorName.charAt(0).toUpperCase();
              const lastActivity = topic.lastPostAt || topic.createdAt;

              return (
                <div
                  key={topic.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 20px',
                    borderBottom: index < orderedTopics.length - 1 ? '1px solid #21262d' : 'none',
                    background: topic.isPinned ? 'rgba(47,129,247,0.04)' : 'transparent',
                  }}
                >
                  {/* Author avatar */}
                  <Link href={topic.author?.id ? `/profile/${topic.author.id}` : '#'} style={{ flexShrink: 0, textDecoration: 'none' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: '#2f81f7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: '#fff',
                    }}>
                      {authorLetter}
                    </div>
                  </Link>

                  {/* Main content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                      {topic.isPinned && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#2f81f7', background: 'rgba(47,129,247,0.1)', padding: '1px 6px', borderRadius: 20, border: '1px solid rgba(47,129,247,0.3)' }}>
                          <PinIcon /> Закреплено
                        </span>
                      )}
                      {topic.isClosed && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--color-fg-muted)', background: 'var(--color-border-muted)', padding: '1px 6px', borderRadius: 20, border: '1px solid var(--color-border-default)' }}>
                          <LockIcon /> Закрыто
                        </span>
                      )}
                      <Link
                        href={`/forum/topic/${topic.id}`}
                        style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#e6edf3')}
                      >
                        {topic.title}
                      </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                      <span>
                        <Link
                          href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                          style={{ color: 'var(--color-fg-muted)', textDecoration: 'none', fontWeight: 500 }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
                        >
                          {authorName}
                        </Link>
                      </span>
                      {lastActivity && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <ClockIcon />
                          {new Date(lastActivity).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                      <EyeIcon /> {topic.viewsCount || 0}
                    </div>
                    <Link
                      href={`/forum/topic/${topic.id}`}
                      style={{ padding: '4px 10px', fontSize: 12, color: 'var(--color-fg-default)', background: 'var(--color-border-muted)', border: '1px solid var(--color-border-default)', borderRadius: 6, textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
                    >
                      Открыть
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

// ── Create Topic Modal ─────────────────────────────────────────────
function CreateTopicModal({ sectionId, onClose, onSuccess }: { sectionId: number; onClose: () => void; onSuccess: (t: ForumTopic) => void }) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data: CreateTopicDto = { sectionId, title: formData.title, content: formData.content };
      const topic = await forumApi.createTopic(data);
      onSuccess(topic);
    } catch {
      alert('Не удалось создать тему');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '5px 12px', fontSize: 13, color: 'var(--color-fg-default)',
    background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, width: '100%', maxWidth: 560, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 20px', paddingBottom: 16, borderBottom: '1px solid #21262d' }}>
          Новая тема
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', display: 'block', marginBottom: 6 }}>Заголовок</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={inputStyle} placeholder="Введите заголовок темы" required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', display: 'block', marginBottom: 6 }}>Содержание</label>
            <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Опишите вашу тему подробнее..." rows={6} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '5px 16px', fontSize: 13, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>
              Отмена
            </button>
            <button type="submit" disabled={isLoading} style={{ padding: '5px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: '#2da44e', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer' }}>
              {isLoading ? 'Создание...' : 'Создать тему'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
