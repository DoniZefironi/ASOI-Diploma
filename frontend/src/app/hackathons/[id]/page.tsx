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
  
  const [hackathonId, setHackathonId] = useState<number | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<HackathonTeam | null>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<HackathonTeam | null>(null);
  const [teamSubmission, setTeamSubmission] = useState<any | null>(null);

  // Получаем ID из params
  useEffect(() => {
    if (params?.id) {
      setHackathonId(parseInt(params?.id as string));
    } else {
      router.push('/hackathons');
    }
  }, [params, router]);

  // Загружаем данные только когда есть ID
  useEffect(() => {
    if (hackathonId) {
      loadData();
    }
  }, [hackathonId]);

  const loadData = async () => {
    if (!hackathonId) return;

    try {
      const [hackathonData, rankingsData, userTeamsData] = await Promise.all([
        hackathonsApi.getOne(hackathonId),
        hackathonsApi.getRankings(hackathonId).catch(() => []),
        hackathonsApi.getUserTeams().catch(() => []),
      ]);
      setHackathon(hackathonData);
      setTeams(hackathonData?.teams || []);
      setRankings(rankingsData || []);
      
      console.log('User teams:', userTeamsData);
      
      // Находим команду пользователя в этом хакатоне
      const userTeamData = userTeamsData?.find((t: any) => t.hackathonId === hackathonId);
      console.log('User team for this hackathon:', userTeamData);
      setUserTeam(userTeamData || null);
      
      // Загружаем submission если есть команда
      if (userTeamData) {
        try {
          const submission = await hackathonsApi.getTeamSubmission(userTeamData.id);
          console.log('Team submission:', submission);
          setTeamSubmission(submission);
        } catch (err) {
          console.log('No submission yet:', err);
          setTeamSubmission(null);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTeam = async (data: CreateTeamDto) => {
    if (!hackathonId) return;
    
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
    if (!hackathonId) return;
    
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

          {canRegister && user && hackathonId && (
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

          {/* Информация о команде пользователя */}
          {userTeam && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <p className="text-green-400 font-semibold mb-2">
                ✅ Вы в команде: {userTeam.name}
              </p>
              {userTeam.members && (
                <p className="text-sm text-gray-400">
                  👥 Участников: {userTeam.members.length} / {hackathon?.maxTeamSize || 5}
                </p>
              )}
            </div>
          )}

          {/* Загрузка проекта (если хакатон идёт и пользователь в команде) */}
          {userTeam && statusInfo?.status === 'active' && (
            <div className="mt-6">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {teamSubmission ? 'Обновить проект' : 'Загрузить проект'}
              </button>
              {teamSubmission && (
                <p className="text-sm text-gray-400 mt-2">
                  Последняя загрузка: {new Date(teamSubmission.submittedAt).toLocaleString('ru-RU')}
                </p>
              )}
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
        {showCreateTeamModal && hackathonId && (
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

        {/* Модальное окно загрузки проекта */}
        {showSubmitModal && userTeam && (
          <SubmitProjectModal
            team={userTeam}
            existingSubmission={teamSubmission}
            onClose={() => setShowSubmitModal(false)}
            onSuccess={() => {
              setShowSubmitModal(false);
              loadData();
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
  const { user } = useAuth();
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
        memberIds: user?.id ? [parseInt(user.id)] : [], // Лидер (создатель) в команде
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

interface SubmitProjectModalProps {
  team: HackathonTeam;
  existingSubmission: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

function SubmitProjectModal({ team, existingSubmission, onClose, onSuccess }: SubmitProjectModalProps) {
  const [formData, setFormData] = useState({
    documentationUrl: existingSubmission?.documentationUrl || '',
    presentationUrl: existingSubmission?.presentationUrl || '',
    videoDemoUrl: existingSubmission?.videoDemoUrl || '',
    sourceCodeUrl: existingSubmission?.sourceCodeUrl || '',
    submissionNote: existingSubmission?.submissionNote || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        teamId: team.id,
        ...formData,
      };
      await hackathonsApi.submitProject(data);
      onSuccess();
      alert('Проект успешно загружен!');
    } catch (error) {
      console.error('Failed to submit project:', error);
      alert('Не удалось загрузить проект');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-[#161B22] rounded-xl p-8 max-w-2xl w-full mx-4 my-8 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">Загрузка проекта</h2>
        <p className="text-gray-400 mb-6">Команда: {team.name}</p>
        
        {existingSubmission && (
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-blue-400 text-sm">
              📝 Проект уже загружен. Вы можете обновить ссылки или добавить новые.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Последняя загрузка: {new Date(existingSubmission.submittedAt).toLocaleString('ru-RU')}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📄 Документация (ссылка)
            </label>
            <input
              type="url"
              value={formData.documentationUrl}
              onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📊 Презентация (ссылка)
            </label>
            <input
              type="url"
              value={formData.presentationUrl}
              onChange={(e) => setFormData({ ...formData, presentationUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🎥 Видео демо (ссылка)
            </label>
            <input
              type="url"
              value={formData.videoDemoUrl}
              onChange={(e) => setFormData({ ...formData, videoDemoUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              💻 Исходный код (ссылка)
            </label>
            <input
              type="url"
              value={formData.sourceCodeUrl}
              onChange={(e) => setFormData({ ...formData, sourceCodeUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📝 Комментарий к проекту
            </label>
            <textarea
              value={formData.submissionNote}
              onChange={(e) => setFormData({ ...formData, submissionNote: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Краткое описание проекта..."
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Загрузка...' : (existingSubmission ? 'Обновить' : 'Загрузить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}