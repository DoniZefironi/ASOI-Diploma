'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { forumApi, ForumSection } from '@/shared/api/forum';
import { useAuth } from '@/shared/lib/auth-context';

export function ForumPage() {
  const { user, hasRole } = useAuth();
  const [sections, setSections] = useState<ForumSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = hasRole('admin') || hasRole('mentor_english') || hasRole('mentor_electronics') || hasRole('mentor_computer_science') || hasRole('mentor_iot');

  useEffect(() => {
    loadSections();
  }, []);

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
    } catch (error) {
      console.error('Failed to delete section:', error);
      alert('Не удалось удалить раздел');
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

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Форум</h1>
          <p className="text-gray-400 mb-8">Обсуждайте учебные материалы и задавайте вопросы</p>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Создать раздел
            </button>
          </div>
        )}

        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              Разделов пока нет
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className="bg-[#161B22] rounded-xl p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      href={`/forum/${section.id}`}
                      className="text-xl font-semibold text-white hover:text-blue-400 transition-colors"
                    >
                      {section.title}
                    </Link>
                    {section.description && (
                      <p className="text-gray-400 mt-2">{section.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span>Тем: {section.topics?.length || 0}</span>
                      {section.course && (
                        <span>Курс: {section.course.name}</span>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Link
                        href={`/forum/sections/${section.id}/edit`}
                        className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Редактировать
                      </Link>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showCreateModal && (
          <CreateSectionModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadSections();
            }}
          />
        )}
      </div>
    </div>
  );
}

interface CreateSectionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateSectionModal({ onClose, onSuccess }: CreateSectionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    orderIndex: '0',
  });
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
    } catch (error) {
      console.error('Failed to create section:', error);
      alert('Не удалось создать раздел');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Создать раздел</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Курс ID
            </label>
            <input
              type="number"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Порядок
            </label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
