'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { hackathonsApi, Hackathon, HackathonTeam, CreateTeamDto } from '@/shared/api/hackathons';
import { useAuth } from '@/shared/lib/auth-context';

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const hackathonId = parseInt(params.id as string);

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<HackathonTeam | null>(null);

  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [hackathonId]);

  const loadData = async () => {
    try {
      const [hackathonData, rankingsData] = await Promise.all([
        hackathonsApi.getOne(hackathonId),
        hackathonsApi.getRankings(hackathonId).catch(() => []),
      ]);
      setHackathon(hackathonData);
      setTeams(hackathonData?.teams || []);
      setRankings(rankingsData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (data: CreateTeamDto) => {
    try {
      await hackathonsApi.createTeam(data);
      setShowCreateTeamModal(false);
      loadData();
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Не удалось создать команду');
    }
  };

  const handleJoinTeam = async (teamId: number) => {
    try {
      await hackathonsApi.joinTeam(teamId);
      setShowJoinModal(false);
      setSelectedTeam(null);
      loadData();
      alert('Вы успешно присоединились к команде!');
    } catch (error) {
      console.error('Failed to join team:', error);
      alert('Не удалось присоединиться к команде');
    }
  };

  const getStatusInfo = () => {
    if (!hackathon) return null;
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    const regDeadline = hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) : null;

    if (now > endDate) {
      return { status: 'completed', text: 'Хакатон завершён', color: 'gray' };
    }
    if (now > startDate) {
      return { status: 'active', text: 'Хакатон идёт', color: 'green' };
    }
    if (regDeadline && now > regDeadline) {
      return { status: 'registration-closed', text: 'Регистрация закрыта', color: 'yellow' };
    }
    return { status: 'registration', text: 'Открыта регистрация', color: 'blue' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Хакатон не найден</div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const canRegister = statusInfo?.status === 'registration';

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/hackathons" className="text-blue-400 hover:text-blue-300">
            ← Назад к хакатонам
          </Link>
        </div>

        {/* Header */}
        <div className="bg-[#161B22] rounded-xl p-8 border border-gray-700 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{hackathon.title}</h1>
              {hackathon.theme && (
                <p className="text-blue-400 text-lg">🏷️ {hackathon.theme}</p>
              )}
            </div>
            {statusInfo && (
              <span className={`px-4 py-2 bg-${statusInfo.color}-600 text-white text-sm rounded-full`}>
                {statusInfo.text}
              </span>
            )}
          </div>

          <p className="text-gray-300 text-lg mb-6">{hackathon.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">📅 Начало</div>
              <div className="text-white font-semibold">
                {new Date(hackathon.startDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">🏁 Конец</div>
              <div className="text-white font-semibold">
                {new Date(hackathon.endDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            {hackathon.registrationDeadline && (
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">⏰ Регистрация до</div>
                <div className="text-white font-semibold">
                  {new Date(hackathon.registrationDeadline).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}
            {hackathon.prizePool && (
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">💰 Призовой фонд</div>
                <div className="text-green-400 font-semibold text-xl">
                  {hackathon.prizePool.toLocaleString()} ₽
                </div>
              </div>
            )}
          </div>

          {canRegister && user && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Создать команду
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Присоединиться к команде
              </button>
            </div>
          )}
        </div>

        {/* Rankings */}
        {rankings.length > 0 && (
          <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">🏆 Рейтинг команд</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400">#</th>
                    <th className="text-left py-3 px-4 text-gray-400">Команда</th>
                    <th className="text-left py-3 px-4 text-gray-400">Проект</th>
                    <th className="text-right py-3 px-4 text-gray-400">Баллы</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((team, index) => (
                    <tr key={team.teamId} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-white">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </td>
                      <td className="py-3 px-4 text-white font-medium">{team.teamName}</td>
                      <td className="py-3 px-4 text-gray-400">{team.projectName}</td>
                      <td className="text-right py-3 px-4 text-green-400 font-semibold">
                        {team.totalScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Teams */}
        <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">
            Команды ({teams.length})
          </h2>
          {teams.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Пока нет зарегистрированных команд
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-[#0D1117] rounded-lg p-4 border border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{team.name}</h3>
                  <div className="text-sm text-gray-400 mb-3">
                    👤 Лидер: {team.members?.find(m => m.role === 'leader')?.user?.firstName || 'Неизвестно'}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    👥 Участников: {team.members?.length || 0} / {hackathon.maxTeamSize}
                  </div>
                  {team.projectName && (
                    <div className="text-sm text-blue-400 mb-3">
                      📝 Проект: {team.projectName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modals */}
        {showCreateTeamModal && (
          <CreateTeamModal
            hackathonId={hackathonId}
            onClose={() => setShowCreateTeamModal(false)}
            onSuccess={handleCreateTeam}
          />
        )}

        {showJoinModal && (
          <JoinTeamModal
            teams={teams}
            onClose={() => setShowJoinModal(false)}
            onSelectTeam={(team) => {
              setSelectedTeam(team);
              setShowJoinModal(false);
              if (confirm(`Присоединиться к команде "${team.name}"?`)) {
                handleJoinTeam(team.id);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

interface CreateTeamModalProps {
  hackathonId: number;
  onClose: () => void;
  onSuccess: (data: CreateTeamDto) => void;
}

function CreateTeamModal({ hackathonId, onClose, onSuccess }: CreateTeamModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    projectName: '',
    projectDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: CreateTeamDto = {
        name: formData.name,
        hackathonId,
        memberIds: [], // Will be populated by backend with current user
        projectName: formData.projectName || undefined,
        projectDescription: formData.projectDescription || undefined,
      };
      await onSuccess(data);
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Не удалось создать команду');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Создать команду</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название команды
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название проекта
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание проекта
            </label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface JoinTeamModalProps {
  teams: HackathonTeam[];
  onClose: () => void;
  onSelectTeam: (team: HackathonTeam) => void;
}

function JoinTeamModal({ teams, onClose, onSelectTeam }: JoinTeamModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Присоединиться к команде</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team)}
              className="w-full p-4 bg-[#0D1117] border border-gray-700 rounded-lg hover:border-blue-600 transition-colors text-left"
            >
              <div className="text-white font-semibold">{team.name}</div>
              <div className="text-sm text-gray-400">
                👥 {team.members?.length || 0} участников
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
