'use client';

import { useState, useEffect } from 'react';
import { forumApi, ForumSection, ForumTopic, ForumPost } from '@/shared/api/forum';
import { useCourses, Course } from '@/shared/api/admin/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface ForumStats {
  totalSections: number;
  totalTopics: number;
  totalPosts: number;
}

export default function AdminForum() {
  const [sections, setSections] = useState<ForumSection[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [stats, setStats] = useState<ForumStats>({
    totalSections: 0,
    totalTopics: 0,
    totalPosts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSection, setEditingSection] = useState<ForumSection | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const sectionsData = await forumApi.getSections();
      setSections(sectionsData || []);
      setStats({
        totalSections: sectionsData?.length || 0,
        totalTopics: sectionsData?.reduce((acc, s) => acc + (s.topics?.length || 0), 0) || 0,
        totalPosts: 0,
      });
    } catch (error) {
      console.error('Failed to load forum data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopicsForSection = async (sectionId: number) => {
    try {
      const topicsData = await forumApi.getTopicsBySection(sectionId);
      setTopics(topicsData || []);
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!confirm('Вы уверены? Это удалит все темы и сообщения в этом разделе.')) return;
    try {
      await forumApi.deleteSection(id);
      setSections(sections.filter(s => s.id !== id));
      setStats(prev => ({ ...prev, totalSections: prev.totalSections - 1 }));
    } catch (error) {
      console.error('Failed to delete section:', error);
      alert('Не удалось удалить раздел');
    }
  };

  const handleDeleteTopic = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту тему?')) return;
    try {
      await forumApi.deleteTopic(id);
      setTopics(topics.filter(t => t.id !== id));
      loadData();
    } catch (error) {
      console.error('Failed to delete topic:', error);
      alert('Не удалось удалить тему');
    }
  };

  const handleTogglePinned = async (topicId: number) => {
    try {
      await forumApi.toggleTopicPinned(topicId);
      loadTopicsForSection(selectedSection!);
    } catch (error) {
      console.error('Failed to toggle pinned:', error);
    }
  };

  const handleToggleClosed = async (topicId: number) => {
    try {
      await forumApi.toggleTopicClosed(topicId);
      loadTopicsForSection(selectedSection!);
    } catch (error) {
      console.error('Failed to toggle closed:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление форумом</h1>
          <p className="text-muted-foreground">
            Управление разделами и темами форума
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Создать раздел
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Разделы"
          value={stats.totalSections}
          icon="📁"
        />
        <StatCard
          title="Темы"
          value={stats.totalTopics}
          icon="📝"
        />
        <StatCard
          title="Сообщения"
          value={stats.totalPosts}
          icon="💬"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Разделы форума</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sections.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Разделов пока нет
                </p>
              ) : (
                sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSection === section.id
                        ? 'bg-accent border-primary'
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => {
                      setSelectedSection(section.id);
                      loadTopicsForSection(section.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{section.title}</h3>
                          {section.orderIndex === 0 && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                              Общий
                            </span>
                          )}
                        </div>
                        {section.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {section.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Тем: {section.topics?.length || 0}</span>
                          <span>Курс ID: {section.courseId || '—'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSection(section);
                          }}
                          className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}
                          className="px-3 py-1 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Темы {selectedSection ? `выбранного раздела` : '(выберите раздел)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSection ? (
              <div className="space-y-2">
                {topics.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Тем в этом разделе пока нет
                  </p>
                ) : (
                  topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {topic.isPinned && (
                              <span className="text-blue-500">📌</span>
                            )}
                            {topic.isClosed && (
                              <span className="text-red-500">🔒</span>
                            )}
                            <h3 className="font-semibold">{topic.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Автор: {topic.author?.firstName || 'Аноним'}</span>
                            <span>Просмотров: {topic.viewsCount}</span>
                            <span>
                              Создано: {new Date(topic.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTogglePinned(topic.id)}
                            className={`px-3 py-1 text-sm rounded ${
                              topic.isPinned
                                ? 'bg-secondary hover:bg-secondary/80'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                            title={topic.isPinned ? 'Открепить' : 'Закрепить'}
                          >
                            {topic.isPinned ? '📌' : '📍'}
                          </button>
                          <button
                            onClick={() => handleToggleClosed(topic.id)}
                            className={`px-3 py-1 text-sm rounded ${
                              topic.isClosed
                                ? 'bg-secondary hover:bg-secondary/80'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                            title={topic.isClosed ? 'Открыть' : 'Закрыть'}
                          >
                            {topic.isClosed ? '🔓' : '🔒'}
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="px-3 py-1 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">
                Выберите раздел слева для просмотра тем
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {showCreateModal && (
        <CreateSectionModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}

      {editingSection && (
        <EditSectionModal
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSuccess={() => {
            setEditingSection(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

interface CreateSectionModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateSectionModal({ onClose, onSuccess }: CreateSectionModalProps) {
  const { courses, isLoading: coursesLoading } = useCourses();
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
        courseId: formData.courseId ? parseInt(formData.courseId) : undefined,
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
      <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4 border">
        <h2 className="text-2xl font-bold mb-6">Создать раздел</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Курс
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
            >
              <option value="">— Общий раздел (без привязки к курсу) —</option>
              {coursesLoading ? (
                <option value="">Загрузка...</option>
              ) : (
                courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Порядок отображения
            </label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditSectionModalProps {
  section: ForumSection;
  onClose: () => void;
  onSuccess: () => void;
}

function EditSectionModal({ section, onClose, onSuccess }: EditSectionModalProps) {
  const { courses, isLoading: coursesLoading } = useCourses();
  const [formData, setFormData] = useState({
    title: section.title,
    description: section.description || '',
    courseId: section.courseId?.toString() || '',
    orderIndex: section.orderIndex.toString(),
    isActive: section.isActive,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forumApi.updateSection(section.id, {
        title: formData.title,
        description: formData.description || undefined,
        courseId: formData.courseId ? parseInt(formData.courseId) : undefined,
        orderIndex: parseInt(formData.orderIndex),
        isActive: formData.isActive,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to update section:', error);
      alert('Не удалось обновить раздел');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4 border">
        <h2 className="text-2xl font-bold mb-6">Редактировать раздел</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Курс
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
            >
              <option value="">— Общий раздел (без привязки к курсу) —</option>
              {coursesLoading ? (
                <option value="">Загрузка...</option>
              ) : (
                courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Порядок отображения
            </label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Активен
            </label>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
