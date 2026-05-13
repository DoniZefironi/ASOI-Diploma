'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Edit, Trash2, Users, Loader2, BookOpen, Settings } from 'lucide-react';

interface Elective {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  courseGroupId: number;
  courseGroup?: { id: number; name: string; course?: { name: string } };
  instructorId?: number;
  instructor?: { id: number; firstName: string; lastName: string };
  startDate?: string;
  endDate?: string;
  maxParticipants?: number;
  isActive: boolean;
  enrollments?: any[];
  createdAt: string;
}

interface CourseGroup {
  id: number;
  name: string;
  course?: { name: string };
}

interface ElectiveFormData {
  title: string;
  description: string;
  imageUrl: string;
  courseGroupId: number | '';
  instructorId: number | '';
  startDate: string;
  endDate: string;
  maxParticipants: string;
  isActive: boolean;
}

const defaultForm: ElectiveFormData = {
  title: '',
  description: '',
  imageUrl: '',
  courseGroupId: '',
  instructorId: '',
  startDate: '',
  endDate: '',
  maxParticipants: '',
  isActive: true,
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

const Dialog = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1C2128] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {children}
      </div>
    </div>
  );
};

interface ElectiveFormProps {
  elective?: Elective;
  courseGroups: CourseGroup[];
  onClose: () => void;
  onSuccess: () => void;
}

function ElectiveForm({ elective, courseGroups, onClose, onSuccess }: ElectiveFormProps) {
  const [form, setForm] = useState<ElectiveFormData>(
    elective
      ? {
          title: elective.title,
          description: elective.description || '',
          imageUrl: elective.imageUrl || '',
          courseGroupId: elective.courseGroupId,
          instructorId: elective.instructorId || '',
          startDate: elective.startDate ? new Date(elective.startDate).toISOString().slice(0, 16) : '',
          endDate: elective.endDate ? new Date(elective.endDate).toISOString().slice(0, 16) : '',
          maxParticipants: elective.maxParticipants?.toString() || '',
          isActive: elective.isActive,
        }
      : defaultForm
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.courseGroupId) {
      alert('Заполните обязательные поля: Название и Группа');
      return;
    }
    setIsLoading(true);
    try {
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        courseGroupId: Number(form.courseGroupId),
        instructorId: form.instructorId !== '' ? Number(form.instructorId) : undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        isActive: form.isActive,
      };

      if (elective) {
        await apiClient.put(`/electives/${elective.id}`, payload);
      } else {
        await apiClient.post('/electives', payload);
      }
      onSuccess();
    } catch (err: any) {
      alert(err?.message || 'Не удалось сохранить факультатив');
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';
  const labelCls = 'block text-sm font-medium text-gray-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gh-fg">
          {elective ? 'Редактировать факультатив' : 'Создать факультатив'}
        </h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">&times;</button>
      </div>

      <div>
        <label className={labelCls}>Название <span className="text-red-400">*</span></label>
        <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} required />
      </div>

      <div>
        <label className={labelCls}>Описание</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} rows={3} />
      </div>

      <div>
        <label className={labelCls}>Группа курса <span className="text-red-400">*</span></label>
        <select
          value={form.courseGroupId}
          onChange={e => setForm({ ...form, courseGroupId: e.target.value ? Number(e.target.value) : '' })}
          className={inputCls}
          required
        >
          <option value="">Выберите группу...</option>
          {courseGroups.map(g => (
            <option key={g.id} value={g.id}>
              {g.name}{g.course?.name ? ` — ${g.course.name}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Дата начала</label>
          <input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Дата окончания</label>
          <input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Макс. участников</label>
        <input
          type="number"
          min="1"
          value={form.maxParticipants}
          onChange={e => setForm({ ...form, maxParticipants: e.target.value })}
          className={inputCls}
          placeholder="Без ограничений"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActiveCheck"
          checked={form.isActive}
          onChange={e => setForm({ ...form, isActive: e.target.checked })}
          className="w-4 h-4 rounded border-gray-600 bg-gray-800"
        />
        <label htmlFor="isActiveCheck" className="text-sm text-gray-300">Активен</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white text-sm">
          Отмена
        </button>
        <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}

export default function AdminElectivesPage() {
  const [electives, setElectives] = useState<Elective[]>([]);
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingElective, setEditingElective] = useState<Elective | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [electivesData, groupsData] = await Promise.all([
        apiClient.get('/electives/admin/all'),
        apiClient.get('/course-groups'),
      ]);
      setElectives(electivesData || []);
      setCourseGroups(groupsData || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить факультатив? Все записи студентов будут удалены.')) return;
    try {
      await apiClient.delete(`/electives/${id}`);
      setElectives(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Не удалось удалить');
    }
  };

  const handleToggleActive = async (elective: Elective) => {
    try {
      await apiClient.put(`/electives/${elective.id}`, { isActive: !elective.isActive });
      setElectives(prev => prev.map(e => e.id === elective.id ? { ...e, isActive: !e.isActive } : e));
    } catch (err: any) {
      alert(err?.message || 'Не удалось обновить');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gh-fg">Управление факультативами</h1>
          <p className="text-gray-400 text-sm mt-1">Создание и управление факультативами для групп</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Создать факультатив
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-gray-400 text-sm">Всего факультативов</p>
          <p className="text-3xl font-bold text-gh-fg mt-1">{electives.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-400 text-sm">Активных</p>
          <p className="text-3xl font-bold text-green-400 mt-1">{electives.filter(e => e.isActive).length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-400 text-sm">Всего записей</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">
            {electives.reduce((acc, e) => acc + (e.enrollments?.filter((en: any) => en.status === 'active').length ?? 0), 0)}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {electives.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-600" />
              <p className="text-gray-400">Факультативов пока нет</p>
              <Button onClick={() => setShowCreate(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Создать первый
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-800">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Название</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Группа</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Даты</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase">Участников</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-400 uppercase">Статус</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {electives.map(elective => {
                    const activeCount = elective.enrollments?.filter((en: any) => en.status === 'active').length ?? 0;
                    return (
                      <tr key={elective.id} className="bg-gray-800 hover:bg-gray-750 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white font-medium text-sm">{elective.title}</p>
                            {elective.description && (
                              <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{elective.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-white">{elective.courseGroup?.name || `Группа #${elective.courseGroupId}`}</div>
                          {elective.courseGroup?.course?.name && (
                            <div className="text-xs text-gray-400">{elective.courseGroup.course.name}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-400">
                          <div>{formatDate(elective.startDate)}</div>
                          {elective.endDate && <div className="text-xs">— {formatDate(elective.endDate)}</div>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="flex items-center justify-center gap-1 text-sm text-white">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            {activeCount}
                            {elective.maxParticipants != null && <span className="text-gray-400">/{elective.maxParticipants}</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleActive(elective)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              elective.isActive
                                ? 'bg-green-600/20 border border-green-600 text-green-400 hover:bg-green-600/30'
                                : 'bg-gray-700 border border-gray-600 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            {elective.isActive ? 'Активен' : 'Неактивен'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/electives/${elective.id}`}>
                              <Button size="sm" variant="primary" title="Управление занятиями">
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingElective(elective)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600/20 border border-red-700 text-red-400 hover:bg-red-600/30"
                              onClick={() => handleDelete(elective.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit modal */}
      <Dialog open={showCreate || !!editingElective} onClose={() => { setShowCreate(false); setEditingElective(null); }}>
        <ElectiveForm
          elective={editingElective || undefined}
          courseGroups={courseGroups}
          onClose={() => { setShowCreate(false); setEditingElective(null); }}
          onSuccess={() => { setShowCreate(false); setEditingElective(null); loadData(); }}
        />
      </Dialog>
    </div>
  );
}
