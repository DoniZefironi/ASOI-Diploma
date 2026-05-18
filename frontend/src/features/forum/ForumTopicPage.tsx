'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumTopic, ForumPost, CreatePostDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';
import { ArrowLeft, Pin, Lock, Eye, Pencil, Trash2, MessageSquare, Hash, Send } from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} дн. назад`;
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Avatar({ name, id, size = 36 }: { name: string; id?: number; size?: number }) {
  const letter = name.charAt(0).toUpperCase();
  const el = (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--color-accent-emphasis)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
    }}>
      {letter}
    </div>
  );
  if (id) return <Link href={`/profile/${id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>{el}</Link>;
  return el;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', fontSize: 14, color: 'var(--color-fg-default)',
  background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)',
  borderRadius: 8, outline: 'none', boxSizing: 'border-box', resize: 'vertical',
  lineHeight: 1.5,
};

const btnGreen: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 18px', fontSize: 13, fontWeight: 600,
  color: '#fff', background: '#2da44e',
  border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer',
};

// ── Main ───────────────────────────────────────────────────────────

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

  useEffect(() => { if (topicId) loadData(); }, [topicId]);
  useEffect(() => { if (topic) setEditTopicData({ title: topic.title, content: topic.content }); }, [topic]);

  const loadData = async () => {
    if (!topicId) return;
    try {
      const [t, p] = await Promise.all([forumApi.getTopic(topicId), forumApi.getPostsByTopic(topicId)]);
      setTopic(t); setPosts(p || []);
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId || !replyContent.trim()) return;
    try { await forumApi.createPost({ topicId, content: replyContent } as CreatePostDto); setReplyContent(''); loadData(); }
    catch { alert('Не удалось отправить ответ'); }
  };

  const handleEditPost = async (postId: number) => {
    try { await forumApi.updatePost(postId, editContent); setEditingPostId(null); setEditContent(''); loadData(); }
    catch { alert('Не удалось обновить сообщение'); }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Удалить это сообщение?')) return;
    try { await forumApi.deletePost(postId); loadData(); }
    catch { alert('Не удалось удалить'); }
  };

  const handleTogglePinned = async () => { if (topicId) { try { await forumApi.toggleTopicPinned(topicId); loadData(); } catch {} } };
  const handleToggleClosed = async () => { if (topicId) { try { await forumApi.toggleTopicClosed(topicId); loadData(); } catch {} } };
  const handleEditTopic = async () => {
    if (!topicId) return;
    try { await forumApi.updateTopic(topicId, editTopicData); setEditingTopic(false); loadData(); }
    catch { alert('Не удалось обновить тему'); }
  };

  if (isLoading) return <Spinner />;
  if (!topic) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--color-fg-muted)' }}>Тема не найдена</p></div>;

  const authorName = topic.author
    ? [topic.author.firstName, topic.author.lastName].filter(Boolean).join(' ')
    : 'Аноним';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 860 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--color-fg-muted)', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/forum')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', padding: 0, fontSize: 13 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
          >
            <Hash size={13} /> Форум
          </button>
          {topic.section && (
            <>
              <span style={{ color: 'var(--color-border-default)' }}>/</span>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-fg-muted)', padding: 0, fontSize: 13 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
              >
                {topic.section.title}
              </button>
            </>
          )}
          <span style={{ color: 'var(--color-border-default)' }}>/</span>
          <span style={{ color: 'var(--color-fg-default)', fontWeight: 600, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic.title}</span>
        </div>

        {/* ── Original post ──────────────────────────────────────── */}
        <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>

          {/* Post header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-muted)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <Avatar name={authorName} id={topic.author?.id} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Link href={topic.author?.id ? `/profile/${topic.author.id}` : '#'}
                    style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-fg-default)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-default)')}
                  >
                    {authorName}
                  </Link>
                  <span style={{ fontSize: 12, color: 'var(--color-fg-subtle)', background: 'var(--color-canvas-inset)', padding: '1px 8px', borderRadius: 20 }}>автор</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2, fontSize: 12, color: 'var(--color-fg-muted)', flexWrap: 'wrap' }}>
                  <span>{timeAgo(topic.createdAt)}</span>
                  <span>·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Eye size={12} /> {topic.viewsCount || 0} просм.</span>
                  <span>·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MessageSquare size={12} /> {posts.length} отв.</span>
                </div>
              </div>
            </div>

            {/* Badges + admin actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
              {topic.isPinned && <Badge color="#2f81f7" bg="rgba(47,129,247,0.1)" icon={<Pin size={10} />}>Закреплено</Badge>}
              {topic.isClosed && <Badge color="var(--color-fg-muted)" bg="var(--color-border-muted)" icon={<Lock size={10} />}>Закрыто</Badge>}
              {isTopicAuthor && !editingTopic && (
                <ActionBtn onClick={() => setEditingTopic(true)}><Pencil size={12} /> Ред.</ActionBtn>
              )}
              {isAdmin && (
                <>
                  <ActionBtn onClick={handleTogglePinned} accent={topic.isPinned}>
                    <Pin size={12} /> {topic.isPinned ? 'Открепить' : 'Закрепить'}
                  </ActionBtn>
                  <ActionBtn onClick={handleToggleClosed} danger={!topic.isClosed}>
                    <Lock size={12} /> {topic.isClosed ? 'Открыть' : 'Закрыть'}
                  </ActionBtn>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <div style={{ padding: '18px 20px 0' }}>
            {editingTopic ? (
              <input
                type="text"
                value={editTopicData.title}
                onChange={e => setEditTopicData({ ...editTopicData, title: e.target.value })}
                style={{ ...inputStyle, fontSize: 20, fontWeight: 700, resize: undefined, padding: '6px 10px' }}
              />
            ) : (
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--color-fg-default)', lineHeight: 1.3 }}>{topic.title}</h1>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '16px 20px 20px' }}>
            {editingTopic ? (
              <>
                <textarea
                  value={editTopicData.content}
                  onChange={e => setEditTopicData({ ...editTopicData, content: e.target.value })}
                  style={{ ...inputStyle, marginTop: 10 }}
                  rows={6}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={handleEditTopic} style={btnGreen}
                    onMouseEnter={e => (e.currentTarget.style.background = '#2c974b')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#2da44e')}
                  >Сохранить</button>
                  <button onClick={() => setEditingTopic(false)} style={{ padding: '6px 16px', fontSize: 13, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>Отмена</button>
                </div>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 15, color: 'var(--color-fg-default)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{topic.content}</p>
            )}
          </div>
        </div>

        {/* ── Replies ────────────────────────────────────────────── */}
        {posts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {/* Thread header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {posts.length} {posts.length === 1 ? 'ответ' : posts.length >= 2 && posts.length <= 4 ? 'ответа' : 'ответов'}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
            </div>

            {/* Post tree */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {posts.map((post, idx) => {
                const postAuthorName = post.author
                  ? [post.author.firstName, post.author.lastName].filter(Boolean).join(' ')
                  : 'Аноним';
                const isPostAuthor = user && post.authorId?.toString() === user.id;
                const isEditing = editingPostId === post.id;
                const isLast = idx === posts.length - 1;

                return (
                  <div key={post.id} style={{ display: 'flex', gap: 0 }}>
                    {/* Tree connector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0, paddingTop: 16 }}>
                      <Avatar name={postAuthorName} id={post.author?.id} size={28} />
                      {!isLast && (
                        <div style={{ flex: 1, width: 2, background: 'var(--color-border-muted)', borderRadius: 1, margin: '6px 0' }} />
                      )}
                    </div>

                    {/* Post body */}
                    <div style={{
                      flex: 1, marginLeft: 12, marginBottom: isLast ? 0 : 4,
                      background: 'var(--color-canvas-overlay)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 10, overflow: 'hidden',
                      marginTop: 8,
                    }}>
                      {/* Post meta */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--color-border-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Link href={post.author?.id ? `/profile/${post.author.id}` : '#'}
                            style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-fg-default)', textDecoration: 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-default)')}
                          >
                            {postAuthorName}
                          </Link>
                          <span style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>{timeAgo(post.createdAt)}</span>
                          {post.isEdited && <span style={{ fontSize: 11, color: 'var(--color-fg-subtle)', fontStyle: 'italic' }}>изменено</span>}
                        </div>

                        {(isPostAuthor || isAdmin) && !isEditing && (
                          <div style={{ display: 'flex', gap: 2 }}>
                            {isPostAuthor && (
                              <IconBtn onClick={() => { setEditingPostId(post.id); setEditContent(post.content); }} title="Редактировать">
                                <Pencil size={12} />
                              </IconBtn>
                            )}
                            <IconBtn onClick={() => handleDeletePost(post.id)} title="Удалить" danger>
                              <Trash2 size={12} />
                            </IconBtn>
                          </div>
                        )}
                      </div>

                      {/* Post content */}
                      <div style={{ padding: '14px 16px' }}>
                        {isEditing ? (
                          <>
                            <textarea value={editContent} onChange={e => setEditContent(e.target.value)} style={inputStyle} rows={4} autoFocus />
                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                              <button onClick={() => handleEditPost(post.id)} style={{ ...btnGreen, padding: '5px 14px', fontSize: 12 }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#2c974b')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#2da44e')}
                              >Сохранить</button>
                              <button onClick={() => { setEditingPostId(null); setEditContent(''); }} style={{ padding: '5px 14px', fontSize: 12, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}>Отмена</button>
                            </div>
                          </>
                        ) : (
                          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-default)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{post.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Reply box ──────────────────────────────────────────── */}
        {user && !topic.isClosed ? (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--color-border-muted)', background: 'rgba(47,129,247,0.03)' }}>
              <Avatar name={[user.firstName, user.lastName].filter(Boolean).join(' ') || 'Вы'} size={28} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>Написать ответ</span>
            </div>
            <form onSubmit={handleCreatePost} style={{ padding: 16 }}>
              <textarea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                style={{ ...inputStyle, minHeight: 100 }}
                placeholder="Поделитесь своими мыслями..."
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  style={{ ...btnGreen, opacity: replyContent.trim() ? 1 : 0.5 }}
                  onMouseEnter={e => replyContent.trim() && (e.currentTarget.style.background = '#2c974b')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#2da44e')}
                >
                  <Send size={13} /> Отправить
                </button>
              </div>
            </form>
          </div>
        ) : topic.isClosed ? (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Lock size={14} color="var(--color-fg-muted)" />
            <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Тема закрыта для ответов</span>
          </div>
        ) : (
          <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, padding: '18px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: 0 }}>
              <Link href="/auth" style={{ color: 'var(--color-accent-fg)', textDecoration: 'none' }}>Войдите</Link>, чтобы оставить ответ
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Micro UI ───────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Badge({ color, bg, icon, children }: { color: string; bg: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color, background: bg, padding: '2px 8px', borderRadius: 20 }}>
      {icon}{children}
    </span>
  );
}

function ActionBtn({ onClick, accent, danger, children }: { onClick: () => void; accent?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: 12, fontWeight: 500, color: danger ? '#f85149' : accent ? 'var(--color-accent-fg)' : 'var(--color-fg-muted)', background: 'var(--color-canvas-inset)', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-canvas-inset)')}
    >
      {children}
    </button>
  );
}

function IconBtn({ onClick, title, danger, children }: { onClick: () => void; title?: string; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer', color: 'var(--color-fg-subtle)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-neutral-2)'; e.currentTarget.style.color = danger ? '#f85149' : 'var(--color-fg-default)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-fg-subtle)'; }}
    >
      {children}
    </button>
  );
}
