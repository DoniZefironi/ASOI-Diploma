'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useCourses } from '@/shared/api/admin';
import { BookOpen, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import CourseForm from './CourseForm';

// Badge — визуальный ярлык
const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}) => {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default:
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary:
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline:
      'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    destructive:
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Простой диалог
const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
    {children}
  </div>
);

const DialogTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

// Таблица
const Table = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
    <table className="w-full">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
);
const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
);
const TableRow = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}>{children}</tr>;
const TableHead = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);
const TableCell = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`px-4 py-3 text-sm text-gray-900 dark:text-white ${className}`}>
    {children}
  </td>
);

export default function CourseManagement() {
  const {
    courses,
    isLoading,
    isError,
    createCourse,
    updateCourse,
    deleteCourse,
    isCreating,
    isUpdating,
    isDeleting,
    mutate,
  } = useCourses();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const handleCreate = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;
    try {
      await deleteCourse(courseId);
      mutate(); // обновляем список после удаления
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, data });
      } else {
        await createCourse(data);
      }
      mutate(); // обновляем список
      setIsDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const getCourseTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      computer_science: 'Информатика',
      electronics: 'Электроника',
      english: 'Английский',
      iot: 'IoT',
    };
    return types[type] || type;
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
        <CardContent className="p-6">
          <div className="text-center text-red-500">Ошибка загрузки курсов</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление курсами</h1>
          <p className="text-gray-400">Создание и редактирование учебных курсов</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {courses?.length || 0}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Создать курс
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="h-5 w-5" />
            Список курсов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.map((course: any) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium text-white">{course.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{course.name}</span>
                      <span className="text-sm text-gray-400 line-clamp-1">{course.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCourseTypeLabel(course.type)}</Badge>
                  </TableCell>
                  <TableCell className="text-white">{course.duration} недель</TableCell>
                  <TableCell>
                    <Badge variant={course.isActive ? 'default' : 'secondary'}>
                      {course.isActive ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(course)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleDelete(course.id)}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(!courses || courses.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Курсы не найдены</p>
              <p className="text-sm mt-2">Создайте первый курс, чтобы начать работу</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Создать курс
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CourseDialog
        course={editingCourse}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSave}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}

// Диалог создания/редактирования курса
function CourseDialog({
  course,
  isOpen,
  onClose,
  onSave,
  isSubmitting,
}: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course ? 'Редактирование курса' : 'Создание курса'}
          </DialogTitle>
        </DialogHeader>

        <CourseForm
          course={course}
          onSave={onSave}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
