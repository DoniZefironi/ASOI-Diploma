'use client';

import { useState, useEffect, useMemo } from 'react';
import { hackathonsApi, Hackathon, HackathonTeam, CreateHackathonDto } from '@/shared/api/hackathons';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Award, Plus, Edit, Trash2, Users, Calendar, Loader2, Eye, Code, GitBranch, Trophy } from 'lucide-react';
import Link from 'next/link';
import DataTableFilters from '@/features/common/DataTableFilters';

interface HackathonStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalSubmissions: number;
}

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
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
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

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
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
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [stats, setStats] = useState<HackathonStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
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
        h.title?.toLowerCase().includes(search.toLowerCase()) ||
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hackathonsData, statsData] = await Promise.all([
        hackathonsApi.getAll(),
        hackathonsApi.getStats().catch(() => null),
      ]);
      setHackathons(hackathonsData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены? Это удалит все команды и проекты.')) return;
    try {
      await hackathonsApi.delete(id);
      setHackathons(hackathons.filter(h => h.id !== id));
      loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Не удалось удалить хакатон');
    }
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
    return <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" /></div>;
  }

  const tabs = [
    { id: 'list', label: 'Список хакатонов', icon: Trophy },
    { id: 'stats', label: 'Статистика', icon: Calendar },
    { id: 'teams', label: 'Команды', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление хакатонами</h1>
          <p className="text-gray-400">Создание и управление хакатонами</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
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
              { value: 'title', label: 'По названию' },
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
                  {filteredHackathons.map((hackathon) => (
                    <TableRow key={hackathon.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{hackathon.title}</span>
                          {hackathon.theme && (
                            <span className="text-sm text-gray-400">🏷️ {hackathon.theme}</span>
                          )}
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
                      <TableCell>{getStatusBadge(hackathon.isActive ? 'active' : 'inactive')}</TableCell>
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
                            onClick={() => setEditingHackathon(hackathon)}
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
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Хакатоны не найдены</p>
                  <Button onClick={() => setShowCreateModal(true)} className="mt-4">
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
                <Trophy className="h-5 w-5 text-blue-500" />
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
              <p className="text-4xl font-bold text-white">{stats.totalSubmissions || 0}</p>
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

      {/* Модальное окно создания/редактирования */}
      <Dialog open={showCreateModal || !!editingHackathon} onClose={() => {
        setShowCreateModal(false);
        setEditingHackathon(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHackathon ? 'Редактировать хакатон' : 'Создать хакатон'}
            </DialogTitle>
          </DialogHeader>
          <HackathonFormModal
            hackathon={editingHackathon || undefined}
            onClose={() => {
              setShowCreateModal(false);
              setEditingHackathon(null);
            }}
            onSuccess={() => {
              setShowCreateModal(false);
              setEditingHackathon(null);
              loadData();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Модальное окно просмотра деталей */}
      {selectedHackathon && (
        <HackathonDetailsModal
          hackathon={selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
        />
      )}
    </div>
  );
}

interface HackathonFormModalProps {
  hackathon?: Hackathon;
  onClose: () => void;
  onSuccess: () => void;
}

function HackathonFormModal({ hackathon, onClose, onSuccess }: HackathonFormModalProps) {
  const [formData, setFormData] = useState({
    title: hackathon?.title || '',
    description: hackathon?.description || '',
    theme: hackathon?.theme || '',
    startDate: hackathon?.startDate ? new Date(hackathon.startDate).toISOString().slice(0, 16) : '',
    endDate: hackathon?.endDate ? new Date(hackathon.endDate).toISOString().slice(0, 16) : '',
    registrationDeadline: hackathon?.registrationDeadline
      ? new Date(hackathon.registrationDeadline).toISOString().slice(0, 16)
      : '',
    maxTeamSize: hackathon?.maxTeamSize?.toString() || '5',
    minTeamSize: hackathon?.minTeamSize?.toString() || '3',
    prizePool: hackathon?.prizePool?.toString() || '',
    isActive: hackathon?.isActive !== false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: Partial<CreateHackathonDto> = {
        title: formData.title,
        description: formData.description,
        theme: formData.theme || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationDeadline: formData.registrationDeadline
          ? new Date(formData.registrationDeadline).toISOString()
          : undefined,
        maxTeamSize: parseInt(formData.maxTeamSize),
        minTeamSize: parseInt(formData.minTeamSize),
        prizePool: formData.prizePool ? parseFloat(formData.prizePool) : undefined,
        isActive: formData.isActive,
      };

      if (hackathon) {
        await hackathonsApi.update(hackathon.id, data);
      } else {
        await hackathonsApi.create(data as CreateHackathonDto);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save hackathon:', error);
      alert('Не удалось сохранить хакатон');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Название</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Описание</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Тема</label>
        <input
          type="text"
          value={formData.theme}
          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Начало</label>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Конец</label>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Регистрация до</label>
        <input
          type="datetime-local"
          value={formData.registrationDeadline}
          onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Мин. команда</label>
          <input
            type="number"
            value={formData.minTeamSize}
            onChange={(e) => setFormData({ ...formData, minTeamSize: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Макс. команда</label>
          <input
            type="number"
            value={formData.maxTeamSize}
            onChange={(e) => setFormData({ ...formData, maxTeamSize: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Призовой фонд</label>
          <input
            type="number"
            value={formData.prizePool}
            onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="₽"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-300">Активен</label>
      </div>
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}

interface HackathonDetailsModalProps {
  hackathon: Hackathon;
  onClose: () => void;
}

function HackathonDetailsModal({ hackathon, onClose }: HackathonDetailsModalProps) {
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [hackathon.id]);

  const loadData = async () => {
    try {
      const [hackathonData, rankingsData] = await Promise.all([
        hackathonsApi.getOne(hackathon.id),
        hackathonsApi.getRankings(hackathon.id).catch(() => []),
      ]);
      setTeams(hackathonData?.teams || []);
      setRankings(rankingsData || []);
    } catch (error) {
      console.error('Failed to load:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{hackathon.title}: Команды и результаты</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" /></div>
          ) : rankings.length > 0 ? (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">🏆 Рейтинг</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Команда</TableHead>
                      <TableHead>Проект</TableHead>
                      <TableHead className="text-right">Баллы</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((team, i) => (
                      <TableRow key={team.teamId}>
                        <TableCell>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                        </TableCell>
                        <TableCell className="font-medium">{team.teamName}</TableCell>
                        <TableCell className="text-gray-400">{team.projectName}</TableCell>
                        <TableCell className="text-right font-semibold text-green-400">
                          {team.totalScore}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8 mb-8">Оценок пока нет</p>
          )}

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">📋 Команды ({teams.length})</h3>
            <div className="grid gap-2">
              {teams.map((team) => (
                <div key={team.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="font-medium text-white">{team.name}</div>
                  <div className="text-sm text-gray-400">
                    👥 {team.members?.length || 0} участников |
                    📝 {team.projectName || 'Нет проекта'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
