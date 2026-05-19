'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Edit, Trash2, Loader2, ClipboardList, ChevronDown, ChevronUp, Users, BarChart2, X } from 'lucide-react';
import AssignmentForm from './AssignmentForm';
import { useAssignments, type Assignment } from '@/shared/api/admin';
import { useAuth, getCourseTypeFromRole } from '@/shared/lib/auth-context';
import DataTableFilters from '@/features/common/DataTableFilters';
import {
  usePeerReviewSessions,
  useCreatePeerReviewSession,
  useAssignPeerReviewsBySession,
  useSessionStats,
  type PeerReviewSession,
  type ReviewCriterion,
} from '@/shared/api/admin/peer-reviews';

const courseTypeLabels: Record<string, string> = {
  'english': 'Английский язык',
  'electronics': 'Электроника',
  'computer_science': 'Информатика',
  'iot': 'IoT (Интернет вещей)',
}; 

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Dialog = ({ open, onClose, children }: any) =>
  !open ? null : (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );

const DialogContent = ({ children }: any) => <div className="p-6">{children}</div>;
const DialogHeader = ({ children }: any) => (
  <div className="mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">{children}</div>
);
const DialogTitle = ({ children }: any) => (
  <h3 className="text-lg font-semibold text-gh-fg">{children}</h3>
);

const getAssignmentTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    lecture: 'Лекция',
    practice: 'Практика',
    test: 'Тест',
    hackathon: 'Хакатон',
    olympiad: 'Олимпиада',
    facultative: 'Факультатив',
  };
  return types[type] || type;
};

// ---------- Peer Review Session Modal ----------

function SessionStatsPanel({ sessionId }: { sessionId: number }) {
  const { stats, isLoading } = useSessionStats(sessionId);
  if (isLoading) return <p className="text-gray-400 text-sm py-2">Загрузка статистики...</p>;
  if (!stats.length) return <p className="text-gray-400 text-sm py-2">Нет данных</p>;
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 text-left border-b border-gray-700">
            <th className="pb-1 pr-3">Студент</th>
            <th className="pb-1 pr-3">Проверено</th>
            <th className="pb-1 pr-3">Ср. балл</th>
            <th className="pb-1">Итог</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(s => (
            <tr key={s.submissionId} className="border-b border-gray-800">
              <td className="py-1 pr-3 text-white">{s.studentName}</td>
              <td className="py-1 pr-3 text-gray-300">{s.completedReviews}/{s.totalReviews}</td>
              <td className="py-1 pr-3 text-gray-300">{s.averageScore ?? '—'}</td>
              <td className="py-1 text-gray-300">{s.finalScore ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PeerReviewModalProps {
  assignment: Assignment;
  onClose: () => void;
}

function PeerReviewSessionModal({ assignment, onClose }: PeerReviewModalProps) {
  const { sessions, isLoading, mutate } = usePeerReviewSessions(assignment.id);
  const { createSession, isCreating } = useCreatePeerReviewSession();
  const { assignReviews, isAssigning } = useAssignPeerReviewsBySession();

  const [showForm, setShowForm] = useState(false);
  const [expandedStats, setExpandedStats] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const [criteria, setCriteria] = useState<ReviewCriterion[]>([
    { name: '', maxScore: 100 },
  ]);

  const handleAddCriterion = () => {
    setCriteria(prev => [...prev, { name: '', maxScore: 100 }]);
  };

  const handleRemoveCriterion = (idx: number) => {
    setCriteria(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCriterionChange = (idx: number, field: keyof ReviewCriterion, value: string | number) => {
    setCriteria(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleCreate = async () => {
    if (!form.title || !form.startDate || !form.endDate) {
      alert('Заполните название и даты');
      return;
    }
    const validCriteria = criteria.filter(c => c.name.trim());
    try {
      await createSession({
        ...form,
        assignmentId: assignment.id,
        courseGroupId: (assignment as any).courseGroupId,
        criteria: validCriteria.length ? validCriteria : undefined,
      });
      setShowForm(false);
      setForm({ title: '', description: '', startDate: '', endDate: '' });
      setCriteria([{ name: '', maxScore: 100 }]);
      mutate();
    } catch (e: any) {
      alert('Ошибка: ' + (e?.message || 'Неизвестная ошибка'));
    }
  };

  const handleAssign = async (session: PeerReviewSession) => {
    if (!confirm(`Распределить рецензии для сессии "${session.title}"? Старые назначения будут удалены.`)) return;
    try {
      await assignReviews({ sessionId: session.id });
      mutate();
      alert('Рецензии распределены!');
    } catch (e: any) {
      alert('Ошибка: ' + (e?.message || 'Неизвестная ошибка'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gh-fg">Peer Review — {assignment.title}</h2>
            <p className="text-sm text-gray-400 mt-0.5">Управление сессиями взаимопроверки</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Existing sessions */}
          {isLoading ? (
            <p className="text-gray-400 text-sm">Загрузка сессий...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-400 text-sm">Сессий нет. Создайте первую.</p>
          ) : (
            <div className="space-y-3">
              {sessions.map(session => (
                <div key={session.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gh-fg text-sm">{session.title}</span>
                        {session.isDistributed && (
                          <span className="text-xs px-2 py-0.5 bg-green-800 text-green-300 rounded-full">Распределено</span>
                        )}
                        {!session.isActive && (
                          <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full">Неактивно</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(session.startDate).toLocaleDateString('ru-RU')} — {new Date(session.endDate).toLocaleDateString('ru-RU')}
                        {session.isDistributed && session.reviewsPerStudent > 0 && ` · ${session.reviewsPerStudent} рец./студент`}
                      </p>
                      {session.criteria && session.criteria.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Критерии: {session.criteria.map(c => `${c.name} (${c.maxScore})`).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setExpandedStats(expandedStats === session.id ? null : session.id)}
                        className="gap-1 text-xs"
                      >
                        <BarChart2 className="h-3 w-3" />
                        Статистика
                        {expandedStats === session.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAssign(session)}
                        disabled={isAssigning}
                        className="gap-1 text-xs"
                      >
                        <Users className="h-3 w-3" />
                        {session.isDistributed ? 'Переназначить' : 'Распределить'}
                      </Button>
                    </div>
                  </div>
                  {expandedStats === session.id && (
                    <SessionStatsPanel sessionId={session.id} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create session form */}
          {showForm ? (
            <div className="border border-blue-700 rounded-lg p-4 space-y-3">
              <h3 className="text-white font-semibold text-sm">Новая сессия</h3>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">Название *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Peer Review #1"
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400">Описание</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Начало проверки *</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Конец проверки *</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-400">Критерии оценки</label>
                  <button
                    onClick={handleAddCriterion}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    + Добавить критерий
                  </button>
                </div>
                {criteria.map((c, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <input
                      value={c.name}
                      onChange={e => handleCriterionChange(idx, 'name', e.target.value)}
                      placeholder={`Критерий ${idx + 1}`}
                      className="flex-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm"
                    />
                    <input
                      type="number"
                      min={1}
                      max={400}
                      value={c.maxScore}
                      onChange={e => handleCriterionChange(idx, 'maxScore', Number(e.target.value))}
                      className="w-20 bg-gray-800 text-white px-3 py-1.5 rounded-lg border border-gray-600 text-sm"
                    />
                    {criteria.length > 1 && (
                      <button
                        onClick={() => handleRemoveCriterion(idx)}
                        className="text-red-500 hover:text-red-400 mt-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <p className="text-xs text-gray-500">Введите название и максимальный балл для каждого критерия</p>
              </div>

              <div className="flex gap-2 pt-1">
                <Button onClick={handleCreate} disabled={isCreating} className="flex-1">
                  {isCreating ? 'Создание...' : 'Создать сессию'}
                </Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowForm(true)} variant="secondary" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Создать новую сессию
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- end Peer Review Session Modal ----------

export default function AssignmentManagement() {
  const { user } = useAuth();
  const {
    assignments,
    isLoading,
    isError,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    isCreating,
    isUpdating,
    isDeleting,
    mutate
  } = useAssignments();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [peerReviewAssignment, setPeerReviewAssignment] = useState<Assignment | null>(null);
  
  // Поиск, фильтрация, сортировка
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Получаем тип курса ментора
  const userRoles = user?.roles || [];
  const mentorCourseType = getCourseTypeFromRole(userRoles);
  
  // Фильтруем задания по типу курса (если это ментор)
  const filteredAssignments = useMemo(() => {
    let result = mentorCourseType
      ? assignments?.filter((a: any) => a.courseGroup?.course?.type === mentorCourseType)
      : assignments;

    // Поиск
    if (search) {
      result = result?.filter((a: any) => 
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Фильтр по типу
    if (filterType) {
      result = result?.filter((a: any) => a.type === filterType);
    }

    // Сортировка
    if (sortBy) {
      result = result?.sort((a: any, b: any) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'deadline' || sortBy === 'startDate') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [assignments, search, filterType, sortBy, sortOrder, mentorCourseType]);

  const handleCreate = () => {
    setEditingAssignment(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить задание?')) return;
    try {
      await deleteAssignment(id);
      mutate(); // Обновляем данные после удаления
    } catch (error) {
      console.error('Ошибка при удалении задания:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const payload = {
        ...data,
        courseGroupId: Number(data.courseGroupId),
        maxScore: Number(data.maxScore),
      };
      
      if (editingAssignment) {
        await updateAssignment({ id: editingAssignment.id, data: payload });
      } else {
        await createAssignment(payload);
      }
      setIsDialogOpen(false);
      setEditingAssignment(null);
    } catch (error) {
      console.error('Ошибка при сохранении задания:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          Ошибка загрузки заданий
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gh-fg">Управление заданиями</h1>
          <p className="text-gray-400 mt-2">
            Создание и редактирование учебных заданий
          </p>
          {mentorCourseType && (
            <p className="text-sm text-blue-400 mt-1">
              📚 Направление: <span className="font-semibold">{courseTypeLabels[mentorCourseType]}</span>
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {filteredAssignments?.length || 0}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Создать задание
          </Button>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <DataTableFilters
        searchPlaceholder="Поиск задания..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            label: 'Все типы',
            value: filterType,
            onChange: setFilterType,
            options: [
              { value: 'practice', label: 'Практика' },
              { value: 'test', label: 'Тест' },
              { value: 'practice_review', label: 'Проверка практики' },
            ],
          },
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={[
          { value: 'title', label: 'По названию' },
          { value: 'deadline', label: 'По дедлайну' },
          { value: 'maxScore', label: 'По баллам' },
        ]}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Список заданий</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b-2 border-b-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Название
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Макс. балл
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Группа
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Дедлайн
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAssignments?.map((assignment: Assignment) => (
                  <tr key={assignment.id} className="bg-gray-800 border-b-2 border-b-white">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gh-fg">{assignment.title}</span>
                        <span className="text-sm text-gray-400 line-clamp-1">
                          {assignment.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">
                        {getAssignmentTypeLabel(assignment.type)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-white">{assignment.maxScore}</td>
                    <td className="px-4 py-3 text-white">
                      {assignment.courseGroup?.name || `Группа ${assignment.courseGroupId}`}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {new Date(assignment.deadline).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={assignment.isActive ? 'default' : 'secondary'}>
                        {assignment.isActive ? 'Активно' : 'Неактивно'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        {assignment.type === 'practice' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setPeerReviewAssignment(assignment)}
                            title="Peer Review"
                          >
                            <ClipboardList className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(assignment)}
                          disabled={isUpdating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(assignment.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!filteredAssignments || filteredAssignments.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <p>Задания не найдены</p>
              <p className="text-sm mt-2">
                Создайте первое задание, чтобы начать работу
              </p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Создать задание
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? 'Редактирование задания' : 'Создание задания'}
            </DialogTitle>
          </DialogHeader>
          <AssignmentForm
            assignment={editingAssignment}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      {peerReviewAssignment && (
        <PeerReviewSessionModal
          assignment={peerReviewAssignment}
          onClose={() => setPeerReviewAssignment(null)}
        />
      )}
    </div>
  );
}