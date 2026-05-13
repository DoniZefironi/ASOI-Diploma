'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useCourses } from '@/shared/api/admin';
import { BookOpen, Plus, Edit, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import CourseForm from './CourseForm';
import DataTableFilters from '@/features/common/DataTableFilters';

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
    default:     'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary:   'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline:     'border border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

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
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 border-b border-gray-700 pb-4">{children}</div>
);

const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>
);

const Table      = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full border border-gray-700 rounded-lg overflow-hidden ${className}`}>
    <table className="w-full">{children}</table>
  </div>
);
const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-800 border-b-2 border-b-white">{children}</thead>
);
const TableBody   = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-700">{children}</tbody>
);
const TableRow    = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`bg-gray-800 ${className}`}>{children}</tr>
);
const TableHead   = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);
const TableCell   = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-sm text-white ${className}`}>{children}</td>
);

const COURSE_TYPE_LABELS: Record<string, string> = {
  computer_science: 'Информатика',
  electronics:      'Электроника',
  english:          'Английский',
  iot:              'IoT',
};

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

  const [isDialogOpen, setIsDialogOpen]     = useState(false);
  const [editingCourse, setEditingCourse]   = useState<any>(null);
  const [deleteId, setDeleteId]             = useState<number | null>(null);

  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy]       = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredCourses = useMemo(() => {
    let result = courses ? [...courses] : [];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c: any) =>
        c.name?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    if (typeFilter) {
      result = result.filter((c: any) => c.type === typeFilter);
    }

    result.sort((a: any, b: any) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [courses, search, typeFilter, sortBy, sortOrder]);

  const handleCreate = () => { setEditingCourse(null); setIsDialogOpen(true); };
  const handleEdit   = (course: any) => { setEditingCourse(course); setIsDialogOpen(true); };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteCourse(deleteId);
      mutate();
    } catch (error) {
      console.error('Ошибка при удалении курса:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, data });
      } else {
        await createCourse(data);
      }
      mutate();
      setIsDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Ошибка при сохранении курса:', error);
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
          <h1 className="text-3xl font-bold text-gh-fg">Управление курсами</h1>
          <p className="text-gray-400">Создание и редактирование учебных курсов</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {filteredCourses.length}
            {filteredCourses.length !== (courses?.length ?? 0) && ` / ${courses?.length ?? 0}`}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Создать курс
          </Button>
        </div>
      </div>

      <DataTableFilters
        searchPlaceholder="Поиск по названию или описанию..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            label: 'Все типы',
            value: typeFilter,
            onChange: setTypeFilter,
            options: Object.entries(COURSE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
          },
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={[
          { value: 'name',     label: 'По названию' },
          { value: 'duration', label: 'По длительности' },
          { value: 'type',     label: 'По типу' },
        ]}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

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
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course: any) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gh-fg">{course.name}</span>
                      <span className="text-sm text-gray-400 line-clamp-1">{course.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{COURSE_TYPE_LABELS[course.type] ?? course.type}</Badge>
                  </TableCell>
                  <TableCell>{course.duration} недель</TableCell>
                  <TableCell>
                    <Badge variant={course.isActive ? 'default' : 'secondary'}>
                      {course.isActive ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(course)} disabled={isUpdating}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setDeleteId(course.id)}
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

          {filteredCourses.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{search || typeFilter ? 'Ничего не найдено' : 'Курсы не найдены'}</p>
              {!search && !typeFilter && (
                <>
                  <p className="text-sm mt-2">Создайте первый курс, чтобы начать работу</p>
                  <Button onClick={handleCreate} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать курс
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Модальное окно создания / редактирования */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingCourse(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {editingCourse ? 'Редактирование курса' : 'Создание курса'}
            </DialogTitle>
          </DialogHeader>
          <CourseForm
            course={editingCourse}
            onSave={handleSave}
            onCancel={() => { setIsDialogOpen(false); setEditingCourse(null); }}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Модальное окно подтверждения удаления */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-gray-800 rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 border-b border-gray-700 pb-4">
              <h3 className="text-lg font-semibold text-gh-fg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Подтверждение удаления
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Вы уверены, что хотите удалить этот курс? Это действие нельзя отменить.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={isDeleting}>
                Отмена
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
