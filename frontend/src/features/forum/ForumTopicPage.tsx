'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumTopic, ForumPost, CreatePostDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';

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

  // Получаем ID из params
  useEffect(() => {
    if (params?.id) {
      setTopicId(parseInt(params.id as string));
    } else {
      router.push('/forum');
    }
  }, [params, router]);

  // Загружаем данные только когда есть ID
  useEffect(() => {
    if (topicId) {
      loadData();
    }
  }, [topicId]);

  useEffect(() => {
    if (topic) {
      setEditTopicData({ title: topic.title, content: topic.content });
    }
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
      const data: CreatePostDto = {
        topicId,
        content: replyContent,
      };
      await forumApi.createPost(data);
      setReplyContent('');
      loadData();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Не удалось создать сообщение');
    }
  };

  const handleEditPost = async (postId: number) => {
    if (!topicId) return;
    
    try {
      await forumApi.updatePost(postId, editContent);
      setEditingPostId(null);
      setEditContent('');
      loadData();
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Не удалось обновить сообщение');
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!topicId) return;
    if (!confirm('Вы уверены, что хотите удалить это сообщение?')) return;
    
    try {
      await forumApi.deletePost(postId);
      loadData();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Не удалось удалить сообщение');
    }
  };

  const handleTogglePinned = async () => {
    if (!topicId) return;
    
    try {
      await forumApi.toggleTopicPinned(topicId);
      loadData();
    } catch (error) {
      console.error('Failed to toggle pinned:', error);
    }
  };

  const handleToggleClosed = async () => {
    if (!topicId) return;
    
    try {
      await forumApi.toggleTopicClosed(topicId);
      loadData();
    } catch (error) {
      console.error('Failed to toggle closed:', error);
    }
  };

  const handleEditTopic = async () => {
    if (!topicId) return;
    
    try {
      await forumApi.updateTopic(topicId, editTopicData);
      setEditingTopic(false);
      loadData();
    } catch (error) {
      console.error('Failed to update topic:', error);
      alert('Не удалось обновить тему');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Тема не найдена</div>
        </div>
      </div>
    );
  }

  const firstPost = posts[0];
  const topicContent = topic.content;

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            href={`/forum/${topic.sectionId}`}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Назад к разделу
          </Link>
        </div>

        <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700 mb-8">
          {editingTopic ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={editTopicData.title}
                  onChange={(e) => setEditTopicData({ ...editTopicData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Содержание
                </label>
                <textarea
                  value={editTopicData.content}
                  onChange={(e) => setEditTopicData({ ...editTopicData, content: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEditTopic}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingTopic(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {topic.isPinned && <span className="text-blue-400 mr-2">📌</span>}
                  {topic.isClosed && <span className="text-red-400 mr-2">🔒</span>}
                  {topic.title}
                </h1>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>Автор: {topic.author?.firstName || 'Аноним'}</span>
                  <span>Просмотров: {topic.viewsCount}</span>
                  <span>
                    Создано: {new Date(topic.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {isTopicAuthor && (
                  <button
                    onClick={() => setEditingTopic(true)}
                    className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Редактировать
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button
                      onClick={handleTogglePinned}
                      className={`px-4 py-2 text-sm rounded transition-colors ${
                        topic.isPinned
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {topic.isPinned ? 'Открепить' : 'Закрепить'}
                    </button>
                    <button
                      onClick={handleToggleClosed}
                      className={`px-4 py-2 text-sm rounded transition-colors ${
                        topic.isClosed
                          ? 'bg-gray-600 text-white hover:bg-gray-500'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {topic.isClosed ? 'Открыть' : 'Закрыть'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
          {topicContent && !editingTopic && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-300 whitespace-pre-wrap">{topicContent}</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Ответы ({posts.length})
          </h2>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-[#161B22] rounded-xl p-6 border border-gray-700"
            >
              {editingPostId === post.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        setEditingPostId(null);
                        setEditContent('');
                      }}
                      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-500">
                      <span>
                        {post.author?.firstName || 'Аноним'}{' '}
                        {post.author?.lastName || ''}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      {post.isEdited && (
                        <span className="ml-2 text-gray-600">(изменено)</span>
                      )}
                    </div>
                    {user && user.id === post.authorId?.toString() && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingPostId(post.id);
                            setEditContent(post.content);
                          }}
                          className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    )}
                    {isAdmin && user && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {user && !topic.isClosed && (
          <div className="mt-8 bg-[#161B22] rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Оставить ответ
            </h3>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Напишите ваш ответ..."
                rows={4}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Отправить
                </button>
              </div>
            </form>
          </div>
        )}

        {topic.isClosed && (
          <div className="mt-8 text-center text-gray-400 bg-[#161B22] rounded-xl p-6 border border-gray-700">
            Эта тема закрыта для ответов
          </div>
        )}
      </div>
    </div>
  );
}