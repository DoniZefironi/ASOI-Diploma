'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import AssignmentForm from './AssignmentForm';
import { useAssignments } from '@/shared/api/admin';

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
  <h3 className="text-lg font-semibold text-white">{children}</h3>
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

interface Assignment {
  id: number;
  title: string;
  description: string;
  type: string;
  maxScore: number;
  deadline: string;
  isActive: boolean;
  courseGroupId: number;
  courseGroup?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export default function AssignmentManagement() {
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
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingAssignment) {
        await updateAssignment({ id: editingAssignment.id, data });
      } else {
        await createAssignment(data);
      }
      setIsDialogOpen(false);
      setEditingAssignment(null);
    } catch (error) {
      console.error('Error saving assignment:', error);
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
          <h1 className="text-3xl font-bold text-white">Управление заданиями</h1>
          <p className="text-gray-400 mt-2">
            Создание и редактирование учебных заданий
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {assignments?.length || 0}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> 
            Создать задание
          </Button>
        </div>
      </div>

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
                    ID
                  </th>
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
                {(assignments as Assignment[]).map((assignment: Assignment) => (
                  <tr key={assignment.id} className="bg-gray-800 border-b-2 border-b-white">
                    <td className="px-4 py-3 text-sm text-white">{assignment.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{assignment.title}</span>
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

          {(!assignments || assignments.length === 0) && (
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
    </div>
  );
}