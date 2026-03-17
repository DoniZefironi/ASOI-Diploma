'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useCourseGroups } from '@/shared/api/admin';
import { useAuth, getCourseTypeFromRole } from '@/shared/lib/auth-context';
import { Plus, Users2, Edit, Trash2, Loader2, BookOpen } from 'lucide-react';
import GroupForm from './GroupForm';
import Link from 'next/link';
import DataTableFilters from '@/features/common/DataTableFilters';

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
  const base =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline:
      'border border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Dialog = ({ open, onOpenChange, children }: any) =>
  !open ? null : (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );

const DialogContent = ({ children }: any) => <div className="p-6">{children}</div>;
const DialogHeader = ({ children }: any) => (
  <div className="mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
    {children}
  </div>
);
const DialogTitle = ({ children }: any) => (
  <h3 className="text-lg font-semibold text-white">{children}</h3>
);

const Table = ({ children }: any) => (
  <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <table className="w-full">{children}</table>
  </div>
);
const TableHeader = ({ children }: any) => (
  <thead className="bg-gray-800 border-b-2 border-b-white">{children}</thead>
);
const TableBody = ({ children }: any) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
    {children}
  </tbody>
);
const TableRow = ({ children }: any) => (
  <tr className="bg-gray-800">{children}</tr>
);
const TableHead = ({ children }: any) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
    {children}
  </th>
);
const TableCell = ({ children }: any) => (
  <td className="px-4 py-3 text-sm text-white">{children}</td>
);

export default function GroupManagement() {
  const { user } = useAuth();
  const { groups, isLoading, isError, createGroup, updateGroup, deleteGroup, mutate } =
    useCourseGroups();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  
  // Поиск, фильтрация, сортировка
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Получаем тип курса ментора
  const userRoles = user?.roles || [];
  const mentorCourseType = getCourseTypeFromRole(userRoles);

  // Поиск, фильтрация, сортировка
  const filteredGroups = useMemo(() => {
    let result = mentorCourseType
      ? groups?.filter((g: any) => g.course?.type === mentorCourseType)
      : groups;

    // Поиск по названию или курсу
    if (search) {
      result = result?.filter((g: any) => 
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.course?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Фильтр по курсу
    if (filterCourse) {
      result = result?.filter((g: any) => g.courseId.toString() === filterCourse);
    }

    // Фильтр по году
    if (filterYear) {
      result = result?.filter((g: any) => g.year.toString() === filterYear);
    }

    // Сортировка
    if (sortBy) {
      result = result?.sort((a: any, b: any) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        // Для вложенных полей (course.name)
        if (sortBy.includes('.')) {
          const [parent, child] = sortBy.split('.');
          aVal = a[parent]?.[child];
          bVal = b[parent]?.[child];
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [groups, search, filterCourse, filterYear, sortBy, sortOrder, mentorCourseType]);

  const handleCreate = () => {
    setEditingGroup(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (group: any) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить группу?')) return;
    await deleteGroup(id);
    mutate();
  };

    const handleSave = async (data: any) => {
    const payload = {
        ...data,
        courseId: Number(data.courseId),
        year: Number(data.year),
        semester: Number(data.semester),
        maxStudents: Number(data.maxStudents),
    };

    if (editingGroup) await updateGroup({ id: editingGroup.id, data: payload });
    else await createGroup(payload);

    mutate();
    setIsDialogOpen(false);
    setEditingGroup(null);
    };


  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );

  if (isError)
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          Ошибка загрузки групп
        </CardContent>
      </Card>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление группами</h1>
          <p className="text-gray-400">Создание и редактирование учебных групп</p>
          {mentorCourseType && (
            <p className="text-sm text-blue-400 mt-1">
              📚 Направление: <span className="font-semibold">{courseTypeLabels[mentorCourseType]}</span>
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Всего: {filteredGroups?.length || 0}</Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Создать группу
          </Button>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <DataTableFilters
        searchPlaceholder="Поиск группы..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            label: 'Все курсы',
            value: filterCourse,
            onChange: setFilterCourse,
            options: Array.from(new Set(groups?.map((g: any) => g.course).filter(Boolean))).map((course: any) => ({
              value: course.id.toString(),
              label: course.name,
            })),
          },
          {
            label: 'Все годы',
            value: filterYear,
            onChange: setFilterYear,
            options: [
              { value: '2024', label: '2024' },
              { value: '2025', label: '2025' },
              { value: '2026', label: '2026' },
            ],
          },
        ]}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={[
          { value: 'name', label: 'По названию' },
          { value: 'year', label: 'По году' },
          { value: 'semester', label: 'По семестру' },
          { value: 'course.name', label: 'По курсу' },
        ]}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users2 className="h-5 w-5" />
            Список групп
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Курс</TableHead>
                <TableHead>Год</TableHead>
                <TableHead>Семестр</TableHead>
                <TableHead>Студенты</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups?.map((g: any) => (
                <TableRow key={g.id}>
                  <TableCell>{g.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/mentor/groups/${g.id}`}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      {g.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      {g.course?.name || '—'}
                    </div>
                  </TableCell>
                  <TableCell>{g.year}</TableCell>
                  <TableCell>{g.semester}</TableCell>
                  <TableCell>{g.registrations?.length || 0}</TableCell>
                  <TableCell>
                    <Badge variant={g.isActive ? 'default' : 'secondary'}>
                      {g.isActive ? 'Активна' : 'Неактивна'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(g)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(g.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(!filteredGroups || filteredGroups.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <Users2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Группы не найдены</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Создать группу
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <GroupDialog
        group={editingGroup}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}

function GroupDialog({ group, isOpen, onClose, onSave }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {group ? 'Редактирование группы' : 'Создание группы'}
          </DialogTitle>
        </DialogHeader>
        <GroupForm group={group} onSave={onSave} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
