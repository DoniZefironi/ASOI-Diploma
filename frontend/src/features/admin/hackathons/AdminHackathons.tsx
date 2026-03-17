// features/admin/hackathons/AdminHackathons.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useHackathons, useHackathonStats } from '@/shared/api/admin/hackathons';
import { Award, Plus, Edit, Trash2, Users, Calendar, Loader2, Eye, Trophy, Code, GitBranch } from 'lucide-react';
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
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };
  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
};

const Tabs = ({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string; icon?: any }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}) => (
  <div className="border-b border-gray-700 mb-6">
    <div className="flex gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
          }`}
        >
          {tab.icon && <tab.icon className="h-4 w-4" />}
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border border-gray-700 rounded-lg overflow-hidden">
    <table className="w-full">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-800 border-b-2 border-b-white">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-700">{children}</tbody>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="bg-gray-800 hover:bg-gray-750">{children}</tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-sm text-white ${className}`}>{children}</td>
);

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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#1C2128] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 border-b border-gray-700 pb-4">
    {children}
  </div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-white">{children}</h2>
);

export default function AdminHackathons() {
  const { hackathons, isLoading, isError, mutate } = useHackathons();
  const { stats } = useHackathonStats();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('list');

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
    const statusConfig: any = {
      draft: { label: 'Черновик', variant: 'secondary' },
      active: { label: 'Активен', variant: 'success' },
      completed: { label: 'Завершён', variant: 'default' },
      cancelled: { label: 'Отменён', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status, variant: 'secondary' };
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

  const tabs = [
    { id: 'list', label: 'Список хакатонов', icon: Award },
    { id: 'stats', label: 'Статистика', icon: Calendar },
    { id: 'teams', label: 'Команды', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление хакатонами</h1>
          <p className="text-gray-400">Создание и управление хакатонами</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Создать хакатон
        </Button>
      </div>

      {/* Вкладки */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Контент вкладок */}
      {activeTab === 'list' && (
        <>
          {/* Фильтры и поиск */}
          <DataTableFilters
            searchPlaceholder="Поиск хакатона..."
            searchValue={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOptions={[
              { value: 'name', label: 'По названию' },
              { value: 'startDate', label: 'По дате начала' },
              { value: 'endDate', label: 'По дате окончания' },
            ]}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          <Card>
            <CardContent className="p-0">
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
                          <span className="font-medium text-white">{hackathon.name}</span>
                          <span className="text-sm text-gray-400 line-clamp-1">
                            {hackathon.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white">{formatDate(hackathon.startDate)}</span>
                          <span className="text-sm text-gray-400">
                            по {formatDate(hackathon.endDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-white">{hackathon.teams?.length || 0}</TableCell>
                      <TableCell className="text-white">до {hackathon.maxTeamSize} чел.</TableCell>
                      <TableCell>{getStatusBadge(hackathon.status)}</TableCell>
                      <TableCell>
                        <Badge variant={hackathon.isPublic ? 'success' : 'secondary'}>
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
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(hackathon.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {(!filteredHackathons || filteredHackathons.length === 0) && (
                <div className="text-center py-8 text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Хакатоны не найдены</p>
                  <Button onClick={handleCreate} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Создать хакатон
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Award className="h-5 w-5 text-blue-500" />
                Всего хакатонов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{stats.totalHackathons || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Code className="h-5 w-5 text-green-500" />
                Активные
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{stats.activeHackathons || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-purple-500" />
                Участников
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{stats.totalParticipants || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <GitBranch className="h-5 w-5 text-orange-500" />
                Проектов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">{stats.totalProjects || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'teams' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Все команды</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center py-8">
              Статистика по командам будет доступна здесь
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHackathon ? 'Редактировать хакатон' : 'Создать хакатон'}
            </DialogTitle>
          </DialogHeader>
          <HackathonForm
            hackathon={editingHackathon}
            onSave={() => {
              mutate();
              setIsDialogOpen(false);
            }}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
