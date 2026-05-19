'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useHackathons, useHackathonStats } from '@/shared/api/admin/hackathons';
import { hackathonsApi } from '@/shared/api/hackathons';
import { Award, Plus, Edit, Trash2, Users, Calendar, Loader2, Eye } from 'lucide-react';
import HackathonForm from './HackathonForm';
import Link from 'next/link';
import DataTableFilters from '@/features/common/DataTableFilters';

const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
  className?: string;
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
  <thead className="bg-gray-800 border-b-2 border-b-white">{children}</thead>
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
}) => <tr className={`bg-gray-800 ${className}`}>{children}</tr>;
const TableHead = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
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

export default function HackathonManagement() {
  const { hackathons, isLoading, isError, mutate } = useHackathons();
  const { stats } = useHackathonStats();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<any>(null);
  
  // Поиск, сортировка
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Фильтрация и сортировка
  const filteredHackathons = useMemo(() => {
    let result = hackathons;

    // Поиск
    if (search) {
      result = result?.filter((h: any) =>
        h.name?.toLowerCase().includes(search.toLowerCase()) ||
        h.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Сортировка
    if (sortBy) {
      result = result?.sort((a: any, b: any) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'startDate' || sortBy === 'endDate' || sortBy === 'registrationDeadline') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [hackathons, search, sortBy, sortOrder]);

  const handleCreate = () => {
    setEditingHackathon(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (hackathon: any) => {
    setEditingHackathon(hackathon);
    setIsDialogOpen(true);
  };

  const handleDelete = async (hackathonId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот хакатон?')) return;
    console.log('Delete hackathon:', hackathonId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Ожидание', variant: 'secondary' as const },
      active: { label: 'Активен', variant: 'success' as const },
      completed: { label: 'Завершен', variant: 'default' as const },
      cancelled: { label: 'Отменен', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
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
          <div className="text-center text-red-500">Ошибка загрузки хакатонов</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gh-fg">Управление хакатонами</h1>
          <p className="text-gray-400">Создание и управление хакатонами</p>
        </div>
        <div className="flex items-center space-x-2">
          {stats && (
            <Badge variant="secondary" className="text-sm">
              Всего: {stats.totalHackathons || 0}
            </Badge>
          )}
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Создать хакатон
          </Button>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <DataTableFilters
        searchPlaceholder="Поиск хакатона..."
        searchValue={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={[
          { value: 'title', label: 'По названию' },
          { value: 'startDate', label: 'По дате начала' },
          { value: 'endDate', label: 'По дате окончания' },
        ]}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Всего хакатонов</p>
                <p className="text-2xl font-bold text-gh-fg">{stats?.totalHackathons || 0}</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Активные</p>
                <p className="text-2xl font-bold text-gh-fg">{stats?.activeHackathons || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Участников</p>
                <p className="text-2xl font-bold text-gh-fg">{stats?.totalParticipants || 0}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Проектов</p>
                <p className="text-2xl font-bold text-gh-fg">{stats?.totalProjects || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Award className="h-5 w-5" />
            Список хакатонов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Даты проведения</TableHead>
                <TableHead>Команд</TableHead>
                <TableHead>Размер команды</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Доступ</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHackathons?.map((hackathon: any) => (
                <TableRow key={hackathon.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gh-fg">{hackathon.name}</span>
                      <span className="text-sm text-gray-400 line-clamp-1">
                        {hackathon.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white">{formatDate(hackathon.startDate)}</span>
                      <span className="text-sm text-gray-400">по {formatDate(hackathon.endDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {hackathon.teams?.length || 0}
                  </TableCell>
                  <TableCell className="text-white">
                    до {hackathon.maxTeamSize} чел.
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(hackathon.status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={hackathon.isPublic ? 'default' : 'secondary'}>
                      {hackathon.isPublic ? 'Публичный' : 'Закрытый'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/admin/hackathons/${hackathon.id}`}>
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(hackathon)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleDelete(hackathon.id)}
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

          {(!hackathons || hackathons.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Хакатоны не найдены</p>
              <p className="text-sm mt-2">Создайте первый хакатон, чтобы начать работу</p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Создать хакатон
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <HackathonDialog
        hackathon={editingHackathon}
        isOpen={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setEditingHackathon(null); }}
        onSave={async (data: any) => {
          if (editingHackathon?.id) {
            await hackathonsApi.update(editingHackathon.id, data);
          } else {
            await hackathonsApi.create(data);
          }
          setIsDialogOpen(false);
          setEditingHackathon(null);
          mutate();
        }}
      />
    </div>
  );
}

function HackathonDialog({ hackathon, isOpen, onClose, onSave }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {hackathon ? 'Редактирование хакатона' : 'Создание хакатона'}
          </DialogTitle>
        </DialogHeader>
        <HackathonForm
          hackathon={hackathon}
          onSave={async (data: any) => {
            setIsSubmitting(true);
            try { await onSave(data); } finally { setIsSubmitting(false); }
          }}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}