'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumSection, ForumTopic, CreateTopicDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';

// ── Icons ──────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"/>
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1Z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.824-.742 3.955-1.715 1.125-.967 1.955-2.095 2.366-2.717a.12.12 0 0 0 0-.136c-.411-.622-1.241-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.824.742-3.955 1.715-1.125.967-1.955 2.095-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"/>
  </svg>
);

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4.456.734a1.75 1.75 0 0 1 2.826.504l.613 1.327a3.081 3.081 0 0 0 2.084 1.707l2.454.584c1.332.317 1.8 1.972.832 2.94L11.06 9h1.22a.75.75 0 0 1 0 1.5H9.75l-1.22 4.347a.75.75 0 0 1-1.432-.04L5.52 9H3.72a.75.75 0 0 1 0-1.5H4.94L2.265 4.853c-.968-.968-.5-2.623.832-2.94l2.454-.584A3.082 3.082 0 0 0 7.635 0 1.744 1.744 0 0 1 4.456.734Z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
  </svg>
);

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
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#8b949e', fontSize: 14 }}>Загрузка...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!section) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8b949e', fontSize: 14 }}>Раздел не найден</p>
      </div>
    );
  }

  const pinnedTopics = topics.filter(t => t.isPinned);
  const normalTopics = topics.filter(t => !t.isPinned);
  const orderedTopics = [...pinnedTopics, ...normalTopics];

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', padding: '24px 0' }}>
      <div className="gh-container">

        {/* Breadcrumb */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8b949e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
          >
            <ArrowLeftIcon /> Назад к форуму
          </button>
        </div>

        {/* Section header card */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: '16px 20px', marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#e6edf3', margin: '0 0 6px' }}>{section.title}</h1>
          {section.description && (
            <p style={{ fontSize: 13, color: '#8b949e', margin: '0 0 10px' }}>{section.description}</p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8b949e' }}>
              <ChatBubbleIcon /> {topics.length} тем
            </span>
            {section.course && (
              <span style={{ fontSize: 12, color: '#8b949e' }}>Курс: {section.course.name}</span>
            )}
          </div>
        </div>

        {/* Topics header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Темы</span>
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
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ color: '#e6edf3', fontWeight: 600, margin: '0 0 4px' }}>Тем пока нет</p>
            <p style={{ color: '#8b949e', fontSize: 13, margin: 0 }}>Будьте первым, кто начнёт обсуждение!</p>
          </div>
        ) : (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, overflow: 'hidden' }}>
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
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#8b949e', background: '#21262d', padding: '1px 6px', borderRadius: 20, border: '1px solid #30363d' }}>
                          <LockIcon /> Закрыто
                        </span>
                      )}
                      <Link
                        href={`/forum/topic/${topic.id}`}
                        style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#e6edf3')}
                      >
                        {topic.title}
                      </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#8b949e' }}>
                      <span>
                        <Link
                          href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                          style={{ color: '#8b949e', textDecoration: 'none', fontWeight: 500 }}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8b949e' }}>
                      <EyeIcon /> {topic.viewsCount || 0}
                    </div>
                    <Link
                      href={`/forum/topic/${topic.id}`}
                      style={{ padding: '4px 10px', fontSize: 12, color: '#e6edf3', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#21262d')}
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
    width: '100%', padding: '5px 12px', fontSize: 13, color: '#e6edf3',
    background: '#0d1117', border: '1px solid #30363d', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, width: '100%', maxWidth: 560, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3', margin: '0 0 20px', paddingBottom: 16, borderBottom: '1px solid #21262d' }}>
          Новая тема
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', display: 'block', marginBottom: 6 }}>Заголовок</label>
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={inputStyle} placeholder="Введите заголовок темы" required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', display: 'block', marginBottom: 6 }}>Содержание</label>
            <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Опишите вашу тему подробнее..." rows={6} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '5px 16px', fontSize: 13, color: '#e6edf3', background: 'transparent', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}>
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
