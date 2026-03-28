'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumTopic, ForumPost, CreatePostDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';

// ── Icons ──────────────────────────────────────────────────────────
const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"/>
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

const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.824-.742 3.955-1.715 1.125-.967 1.955-2.095 2.366-2.717a.12.12 0 0 0 0-.136c-.411-.622-1.241-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.824.742-3.955 1.715-1.125.967-1.955 2.095-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"/>
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function AuthorAvatar({ name, id, size = 32 }: { name: string; id?: number; size?: number }) {
  const letter = name.charAt(0).toUpperCase();
  const avatar = (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: '#2f81f7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: '#fff', flexShrink: 0,
    }}>
      {letter}
    </div>
  );
  if (id) {
    return (
      <Link href={`/profile/${id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
        {avatar}
      </Link>
    );
  }
  return avatar;
}

// ── Main component ─────────────────────────────────────────────────
export function ForumTopicPage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasRole } = useAuth();

  const [topicId, setTopicId] = useState<number | null>(null);
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editingTopic, setEditingTopic] = useState(false);
  const [editTopicData, setEditTopicData] = useState({ title: '', content: '' });

  const isAdmin = hasRole('admin') || hasRole('mentor_english') || hasRole('mentor_electronics') || hasRole('mentor_computer_science') || hasRole('mentor_iot');
  const isTopicAuthor = topic && user && topic.authorId?.toString() === user.id;

  useEffect(() => {
    if (params?.id) setTopicId(parseInt(params.id as string));
    else router.push('/forum');
  }, [params, router]);

  useEffect(() => {
    if (topicId) loadData();
  }, [topicId]);

  useEffect(() => {
    if (topic) setEditTopicData({ title: topic.title, content: topic.content });
  }, [topic]);

  const loadData = async () => {
    if (!topicId) return;
    try {
      const [topicData, postsData] = await Promise.all([
        forumApi.getTopic(topicId),
        forumApi.getPostsByTopic(topicId),
      ]);
      setTopic(topicData);
      setPosts(postsData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || !replyContent.trim()) return;
    try {
      await forumApi.createPost({ topicId, content: replyContent } as CreatePostDto);
      setReplyContent('');
      loadData();
    } catch {
      alert('Не удалось создать сообщение');
    }
  };

  const handleEditPost = async (postId: number) => {
    try {
      await forumApi.updatePost(postId, editContent);
      setEditingPostId(null);
      setEditContent('');
      loadData();
    } catch {
      alert('Не удалось обновить сообщение');
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Удалить это сообщение?')) return;
    try {
      await forumApi.deletePost(postId);
      loadData();
    } catch {
      alert('Не удалось удалить сообщение');
    }
  };

  const handleTogglePinned = async () => {
    if (!topicId) return;
    try { await forumApi.toggleTopicPinned(topicId); loadData(); } catch {}
  };

  const handleToggleClosed = async () => {
    if (!topicId) return;
    try { await forumApi.toggleTopicClosed(topicId); loadData(); } catch {}
  };

  const handleEditTopic = async () => {
    if (!topicId) return;
    try {
      await forumApi.updateTopic(topicId, editTopicData);
      setEditingTopic(false);
      loadData();
    } catch {
      alert('Не удалось обновить тему');
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

  if (!topic) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#8b949e', fontSize: 14 }}>Тема не найдена</p>
      </div>
    );
  }

  const authorName = topic.author
    ? [topic.author.firstName, topic.author.lastName].filter(Boolean).join(' ')
    : 'Аноним';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', fontSize: 13, color: '#e6edf3',
    background: '#0d1117', border: '1px solid #30363d', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box', resize: 'vertical',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', padding: '24px 0' }}>
      <div className="gh-container" style={{ maxWidth: 900 }}>

        {/* Back */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8b949e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
          >
            <ArrowLeftIcon /> Назад к разделу
          </button>
        </div>

        {/* Topic title + meta */}
        <div style={{ marginBottom: 20 }}>
          {editingTopic ? (
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#8b949e', display: 'block', marginBottom: 4 }}>Заголовок</label>
                <input
                  type="text"
                  value={editTopicData.title}
                  onChange={e => setEditTopicData({ ...editTopicData, title: e.target.value })}
                  style={{ ...inputStyle, resize: undefined }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#8b949e', display: 'block', marginBottom: 4 }}>Содержание</label>
                <textarea value={editTopicData.content} onChange={e => setEditTopicData({ ...editTopicData, content: e.target.value })} style={inputStyle} rows={5} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleEditTopic} style={{ padding: '5px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: '#2da44e', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer' }}>
                  Сохранить
                </button>
                <button onClick={() => setEditingTopic(false)} style={{ padding: '5px 16px', fontSize: 13, color: '#e6edf3', background: 'transparent', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}>
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {topic.isPinned && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#2f81f7', background: 'rgba(47,129,247,0.1)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(47,129,247,0.3)' }}>
                        <PinIcon /> Закреплено
                      </span>
                    )}
                    {topic.isClosed && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#8b949e', background: '#21262d', padding: '2px 8px', borderRadius: 20, border: '1px solid #30363d' }}>
                        <LockIcon /> Закрыто
                      </span>
                    )}
                  </div>
                  <h1 style={{ fontSize: 22, fontWeight: 600, color: '#e6edf3', margin: '0 0 8px' }}>{topic.title}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#8b949e' }}>
                    <Link
                      href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                      style={{ color: '#8b949e', textDecoration: 'none', fontWeight: 500 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
                    >
                      {authorName}
                    </Link>
                    <span>·</span>
                    <span>{formatDate(topic.createdAt)}</span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><EyeIcon /> {topic.viewsCount || 0}</span>
                    <span>·</span>
                    <span>{posts.length} ответ{posts.length === 1 ? '' : posts.length >= 2 && posts.length <= 4 ? 'а' : 'ов'}</span>
                  </div>
                </div>

                {/* Admin/author actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {isTopicAuthor && (
                    <button
                      onClick={() => setEditingTopic(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, color: '#e6edf3', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#21262d')}
                    >
                      <PencilIcon /> Редактировать
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={handleTogglePinned}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, color: topic.isPinned ? '#8b949e' : '#2f81f7', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#21262d')}
                      >
                        <PinIcon /> {topic.isPinned ? 'Открепить' : 'Закрепить'}
                      </button>
                      <button
                        onClick={handleToggleClosed}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, color: topic.isClosed ? '#8b949e' : '#f85149', background: '#21262d', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#21262d')}
                      >
                        <LockIcon /> {topic.isClosed ? 'Открыть' : 'Закрыть'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Original post body */}
              {topic.content && (
                <div style={{
                  marginTop: 16, background: '#161b22', border: '1px solid #30363d', borderRadius: 6, overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #21262d', background: 'rgba(47,129,247,0.05)' }}>
                    <AuthorAvatar name={authorName} id={topic.author?.id} size={24} />
                    <Link
                      href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                      style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#e6edf3')}
                    >
                      {authorName}
                    </Link>
                    <span style={{ fontSize: 12, color: '#8b949e' }}>автор · {formatDate(topic.createdAt)}</span>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <p style={{ color: '#e6edf3', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{topic.content}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Posts / replies */}
        {posts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#8b949e', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {posts.length} {posts.length === 1 ? 'Ответ' : 'Ответов'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.map((post) => {
                const postAuthorName = post.author
                  ? [post.author.firstName, post.author.lastName].filter(Boolean).join(' ')
                  : 'Аноним';
                const isPostAuthor = user && post.authorId?.toString() === user.id;

                return (
                  <div key={post.id} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, overflow: 'hidden' }}>
                    {/* Post header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 16px', borderBottom: '1px solid #21262d', background: '#161b22',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AuthorAvatar name={postAuthorName} id={post.author?.id} size={24} />
                        <Link
                          href={post.author?.id ? `/profile/${post.author.id}` : '#'}
                          style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#e6edf3')}
                        >
                          {postAuthorName}
                        </Link>
                        <span style={{ fontSize: 12, color: '#8b949e' }}>
                          {formatDate(post.createdAt)} в {formatTime(post.createdAt)}
                        </span>
                        {post.isEdited && (
                          <span style={{ fontSize: 11, color: '#8b949e' }}>(изменено)</span>
                        )}
                      </div>

                      {/* Actions */}
                      {(isPostAuthor || isAdmin) && editingPostId !== post.id && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {isPostAuthor && (
                            <button
                              onClick={() => { setEditingPostId(post.id); setEditContent(post.content); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 11, color: '#8b949e', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                              onMouseEnter={e => { e.currentTarget.style.color = '#e6edf3'; e.currentTarget.style.background = '#21262d'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.background = 'transparent'; }}
                              title="Редактировать"
                            >
                              <PencilIcon />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 11, color: '#8b949e', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f85149'; e.currentTarget.style.background = '#21262d'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.background = 'transparent'; }}
                            title="Удалить"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post body */}
                    <div style={{ padding: '16px 20px' }}>
                      {editingPostId === post.id ? (
                        <div>
                          <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            style={inputStyle}
                            rows={4}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button onClick={() => handleEditPost(post.id)} style={{ padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#fff', background: '#2da44e', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer' }}>
                              Сохранить
                            </button>
                            <button onClick={() => { setEditingPostId(null); setEditContent(''); }} style={{ padding: '5px 14px', fontSize: 12, color: '#e6edf3', background: 'transparent', border: '1px solid #30363d', borderRadius: 6, cursor: 'pointer' }}>
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: '#e6edf3', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{post.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reply box */}
        {user && !topic.isClosed ? (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #21262d' }}>
              <AuthorAvatar name={[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Вы'} size={24} />
              <span style={{ fontSize: 13, color: '#8b949e' }}>Написать ответ</span>
            </div>
            <form onSubmit={handleCreatePost} style={{ padding: 16 }}>
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                style={inputStyle}
                placeholder="Напишите ваш ответ..."
                rows={4}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  style={{
                    padding: '5px 16px', fontSize: 13, fontWeight: 600,
                    color: '#fff', background: '#2da44e',
                    border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer',
                    opacity: replyContent.trim() ? 1 : 0.5,
                  }}
                >
                  Отправить ответ
                </button>
              </div>
            </form>
          </div>
        ) : topic.isClosed ? (
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 6, padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#8b949e' }}>
              <LockIcon />
              <span style={{ fontSize: 13 }}>Эта тема закрыта для ответов</span>
            </div>
          </div>
        ) : null}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
