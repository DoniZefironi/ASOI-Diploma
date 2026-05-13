'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumTopic, ForumPost, CreatePostDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';
import { ArrowLeft, Pin, Lock, Eye, Pencil, Trash2 } from 'lucide-react';

// ── Icons ──────────────────────────────────────────────────────────
const ArrowLeftIcon = () => <ArrowLeft size={14} />;
const PinIcon = () => <Pin size={12} />;
const LockIcon = () => <Lock size={12} />;
const EyeIcon = () => <Eye size={13} />;
const PencilIcon = () => <Pencil size={12} />;
const TrashIcon = () => <Trash2 size={12} />;

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
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Загрузка...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!topic) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Тема не найдена</p>
      </div>
    );
  }

  const authorName = topic.author
    ? [topic.author.firstName, topic.author.lastName].filter(Boolean).join(' ')
    : 'Аноним';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', fontSize: 13, color: 'var(--color-fg-default)',
    background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6,
    outline: 'none', boxSizing: 'border-box', resize: 'vertical',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '24px 0' }}>
      <div className="gh-container" style={{ maxWidth: 900 }}>

        {/* Back */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => router.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
          >
            <ArrowLeftIcon /> Назад к разделу
          </button>
        </div>

        {/* Topic title + meta */}
        <div style={{ marginBottom: 20 }}>
          {editingTopic ? (
            <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: 20 }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 4 }}>Заголовок</label>
                <input
                  type="text"
                  value={editTopicData.title}
                  onChange={e => setEditTopicData({ ...editTopicData, title: e.target.value })}
                  style={{ ...inputStyle, resize: undefined }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: 'var(--color-fg-muted)', display: 'block', marginBottom: 4 }}>Содержание</label>
                <textarea value={editTopicData.content} onChange={e => setEditTopicData({ ...editTopicData, content: e.target.value })} style={inputStyle} rows={5} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleEditTopic} style={{ padding: '5px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: '#2da44e', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer' }}>
                  Сохранить
                </button>
                <button onClick={() => setEditingTopic(false)} style={{ padding: '5px 16px', fontSize: 13, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--color-fg-muted)', background: 'var(--color-border-muted)', padding: '2px 8px', borderRadius: 20, border: '1px solid var(--color-border-default)' }}>
                        <LockIcon /> Закрыто
                      </span>
                    )}
                  </div>
                  <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 8px' }}>{topic.title}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--color-fg-muted)' }}>
                    <Link
                      href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                      style={{ color: 'var(--color-fg-muted)', textDecoration: 'none', fontWeight: 500 }}
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
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, color: 'var(--color-fg-default)', background: 'var(--color-border-muted)', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
                    >
                      <PencilIcon /> Редактировать
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={handleTogglePinned}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, color: topic.isPinned ? '#8b949e' : '#2f81f7', background: 'var(--color-border-muted)', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
                      >
                        <PinIcon /> {topic.isPinned ? 'Открепить' : 'Закрепить'}
                      </button>
                      <button
                        onClick={handleToggleClosed}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: 12, color: topic.isClosed ? '#8b949e' : '#f85149', background: 'var(--color-border-muted)', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#30363d')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
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
                  marginTop: 16, background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #21262d', background: 'rgba(47,129,247,0.05)' }}>
                    <AuthorAvatar name={authorName} id={topic.author?.id} size={24} />
                    <Link
                      href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                      style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#e6edf3')}
                    >
                      {authorName}
                    </Link>
                    <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>автор · {formatDate(topic.createdAt)}</span>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <p style={{ color: 'var(--color-fg-default)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{topic.content}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Posts / replies */}
        {posts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {posts.length} {posts.length === 1 ? 'Ответ' : 'Ответов'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {posts.map((post) => {
                const postAuthorName = post.author
                  ? [post.author.firstName, post.author.lastName].filter(Boolean).join(' ')
                  : 'Аноним';
                const isPostAuthor = user && post.authorId?.toString() === user.id;

                return (
                  <div key={post.id} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, overflow: 'hidden' }}>
                    {/* Post header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 16px', borderBottom: '1px solid #21262d', background: 'var(--color-canvas-overlay)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AuthorAvatar name={postAuthorName} id={post.author?.id} size={24} />
                        <Link
                          href={post.author?.id ? `/profile/${post.author.id}` : '#'}
                          style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#e6edf3')}
                        >
                          {postAuthorName}
                        </Link>
                        <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>
                          {formatDate(post.createdAt)} в {formatTime(post.createdAt)}
                        </span>
                        {post.isEdited && (
                          <span style={{ fontSize: 11, color: 'var(--color-fg-muted)' }}>(изменено)</span>
                        )}
                      </div>

                      {/* Actions */}
                      {(isPostAuthor || isAdmin) && editingPostId !== post.id && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {isPostAuthor && (
                            <button
                              onClick={() => { setEditingPostId(post.id); setEditContent(post.content); }}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 11, color: 'var(--color-fg-muted)', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                              onMouseEnter={e => { e.currentTarget.style.color = '#e6edf3'; e.currentTarget.style.background = 'var(--color-neutral-2)'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = '#8b949e'; e.currentTarget.style.background = 'transparent'; }}
                              title="Редактировать"
                            >
                              <PencilIcon />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', fontSize: 11, color: 'var(--color-fg-muted)', background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#f85149'; e.currentTarget.style.background = 'var(--color-neutral-2)'; }}
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
                            <button onClick={() => { setEditingPostId(null); setEditContent(''); }} style={{ padding: '5px 14px', fontSize: 12, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: 'var(--color-fg-default)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>{post.content}</p>
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
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #21262d' }}>
              <AuthorAvatar name={[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Вы'} size={24} />
              <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Написать ответ</span>
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
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-fg-muted)' }}>
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
