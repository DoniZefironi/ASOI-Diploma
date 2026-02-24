'use client';

import { useState, useEffect } from 'react';
import { hackathonsApi, Hackathon, HackathonTeam, CreateHackathonDto } from '@/shared/api/hackathons';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface HackathonStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalSubmissions: number;
}

export default function AdminHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [stats, setStats] = useState<HackathonStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);

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

  if (isLoading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление хакатонами</h1>
          <p className="text-muted-foreground">
            Создание и управление хакатонами
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Создать хакатон
        </button>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard title="Всего хакатонов" value={stats.totalHackathons} icon="🏆" />
          <StatCard title="Активные" value={stats.activeHackathons} icon="🔥" />
          <StatCard title="Участников" value={stats.totalParticipants} icon="👥" />
          <StatCard title="Проектов" value={stats.totalSubmissions} icon="📁" />
        </div>
      )}

      <div className="grid gap-6">
        {hackathons.map((hackathon) => (
          <Card key={hackathon.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                  {hackathon.theme && (
                    <p className="text-muted-foreground">🏷️ {hackathon.theme}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingHackathon(hackathon)}
                    className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(hackathon.id)}
                    className="px-3 py-1 text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Начало</div>
                  <div className="font-medium">
                    {new Date(hackathon.startDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Конец</div>
                  <div className="font-medium">
                    {new Date(hackathon.endDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Команды</div>
                  <div className="font-medium">{hackathon.teams?.length || 0}</div>
                </div>
                {hackathon.prizePool && (
                  <div>
                    <div className="text-sm text-muted-foreground">Призовой фонд</div>
                    <div className="font-medium text-green-600">
                      {hackathon.prizePool.toLocaleString()} ₽
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{hackathon.description}</p>
              <button
                onClick={() => setSelectedHackathon(hackathon)}
                className="text-sm text-primary hover:underline"
              >
                Показать команды и результаты →
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <HackathonFormModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}

      {editingHackathon && (
        <HackathonFormModal
          hackathon={editingHackathon}
          onClose={() => setEditingHackathon(null)}
          onSuccess={() => {
            setEditingHackathon(null);
            loadData();
          }}
        />
      )}

      {selectedHackathon && (
        <HackathonDetailsModal
          hackathon={selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-8 max-w-2xl w-full mx-4 border max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {hackathon ? 'Редактировать хакатон' : 'Создать хакатон'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Тема</label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Начало</label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Конец</label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Регистрация до</label>
            <input
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Мин. команда</label>
              <input
                type="number"
                value={formData.minTeamSize}
                onChange={(e) => setFormData({ ...formData, minTeamSize: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Макс. команда</label>
              <input
                type="number"
                value={formData.maxTeamSize}
                onChange={(e) => setFormData({ ...formData, maxTeamSize: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Призовой фонд</label>
              <input
                type="number"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background"
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
            <label htmlFor="isActive" className="text-sm font-medium">Активен</label>
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-8 max-w-4xl w-full mx-4 border max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{hackathon.title}: Команды и результаты</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Загрузка...</div>
        ) : rankings.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">🏆 Рейтинг</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">Команда</th>
                    <th className="text-left py-2">Проект</th>
                    <th className="text-right py-2">Баллы</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((team, i) => (
                    <tr key={team.teamId} className="border-b">
                      <td className="py-2">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                      </td>
                      <td className="py-2 font-medium">{team.teamName}</td>
                      <td className="py-2 text-muted-foreground">{team.projectName}</td>
                      <td className="text-right py-2 font-semibold text-green-600">
                        {team.totalScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8 mb-8">
            Оценок пока нет
          </p>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4">📋 Команды ({teams.length})</h3>
          <div className="grid gap-2">
            {teams.map((team) => (
              <div key={team.id} className="p-4 border rounded-lg">
                <div className="font-medium">{team.name}</div>
                <div className="text-sm text-muted-foreground">
                  👥 {team.members?.length || 0} участников |
                  📝 {team.projectName || 'Нет проекта'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
