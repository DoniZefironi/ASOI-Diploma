'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { forumApi, ForumSection, ForumTopic, CreateTopicDto } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';

export function ForumSectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [sectionId, setSectionId] = useState<number | null>(null);
  const [section, setSection] = useState<ForumSection | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Получаем ID из params
  useEffect(() => {
    if (params?.id) {
      setSectionId(parseInt(params.id as string));
    } else {
      router.push('/forum');
    }
  }, [params, router]);

  // Загружаем данные только когда есть ID
  useEffect(() => {
    if (sectionId) {
      loadData();
    }
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
    } catch (error) {
      console.error('Failed to delete topic:', error);
      alert('Не удалось удалить тему');
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

  if (!section) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Раздел не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/forum" className="text-blue-400 hover:text-blue-300">
            ← Назад к форуму
          </Link>
        </div>

        <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700 mb-8">
          <h1 className="text-3xl font-bold text-white">{section.title}</h1>
          {section.description && (
            <p className="text-gray-400 mt-2">{section.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span>Тем: {topics.length}</span>
            {section.course && (
              <span>Курс: {section.course.name}</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Темы</h2>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Создать тему
            </button>
          )}
        </div>

        <div className="space-y-4">
          {topics.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-[#161B22] rounded-xl border border-gray-700">
              Тем пока нет. Будьте первым!
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-[#161B22] rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      href={`/forum/topic/${topic.id}`}
                      className="text-lg font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {topic.isPinned && <span className="text-blue-400 mr-2">📌</span>}
                      {topic.isClosed && <span className="text-red-400 mr-2">🔒</span>}
                      {topic.title}
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Автор: {topic.author?.firstName || 'Аноним'}</span>
                      <span>Просмотров: {topic.viewsCount}</span>
                      {topic.lastPostAt && (
                        <span>
                          Последний пост:{' '}
                          {new Date(topic.lastPostAt).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/forum/topic/${topic.id}`}
                      className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Открыть
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showCreateModal && sectionId && (
          <CreateTopicModal
            sectionId={sectionId}
            onClose={() => setShowCreateModal(false)}
            onSuccess={(topic) => {
              setShowCreateModal(false);
              router.push(`/forum/topic/${topic.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface CreateTopicModalProps {
  sectionId: number;
  onClose: () => void;
  onSuccess: (topic: ForumTopic) => void;
}

function CreateTopicModal({ sectionId, onClose, onSuccess }: CreateTopicModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: CreateTopicDto = {
        sectionId,
        title: formData.title,
        content: formData.content,
      };
      const topic = await forumApi.createTopic(data);
      onSuccess(topic);
    } catch (error) {
      console.error('Failed to create topic:', error);
      alert('Не удалось создать тему');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-xl p-8 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Создать тему</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите заголовок темы"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Содержание
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Опишите вашу тему"
              rows={6}
              required
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}