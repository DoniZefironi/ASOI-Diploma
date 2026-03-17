'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [rankings, setRankings] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<HackathonTeam | null>(null);
  const [teamSubmission, setTeamSubmission] = useState<any | null>(null);

  useEffect(() => {
    if (params?.hackathonId) {
      setHackathonId(parseInt(params.hackathonId as string));
    } else {
      router.push('/hackathons');
    }
  }, [params, router]);

  useEffect(() => {
    if (hackathonId) loadData();
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

      const userTeamData = userTeamsData?.find((t: any) => t.hackathonId === hackathonId);
      setUserTeam(userTeamData || null);

      if (userTeamData) {
        hackathonsApi.getTeamSubmission(userTeamData.id)
          .then(setTeamSubmission)
          .catch(() => setTeamSubmission(null));
      }
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
    } catch {
      alert('Не удалось создать команду');
    }
  };

  const handleJoinTeam = async (teamId: number) => {
    try {
      await hackathonsApi.joinTeam(teamId);
      setShowJoinModal(false);
      loadData();
      alert('Вы успешно присоединились к команде!');
    } catch {
      alert('Не удалось присоединиться к команде');
    }
  };

  const getStatusInfo = () => {
    if (!hackathon) return null;
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    const regDeadline = hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) : null;

    if (now > endDate) return { status: 'completed', text: 'Хакатон завершён', color: 'gray' };
    if (now > startDate) return { status: 'active', text: 'Хакатон идёт', color: 'green' };
    if (regDeadline && now > regDeadline) return { status: 'registration-closed', text: 'Регистрация закрыта', color: 'yellow' };
    return { status: 'registration', text: 'Открыта регистрация', color: 'blue' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center text-white">Загрузка...</div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center text-white">Хакатон не найден</div>
      </div>
    );
  }

  const statusInfo = getStatusInfo();
  const canRegister = statusInfo?.status === 'registration';
  const isLeader = userTeam && user?.id && userTeam.leaderId?.toString() === user.id;

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
              {hackathon.theme && <p className="text-blue-400 text-lg">🏷️ {hackathon.theme}</p>}
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
                {new Date(hackathon.startDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">🏁 Конец</div>
              <div className="text-white font-semibold">
                {new Date(hackathon.endDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {hackathon.registrationDeadline && (
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">⏰ Регистрация до</div>
                <div className="text-white font-semibold">
                  {new Date(hackathon.registrationDeadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
            {hackathon.prizePool && (
              <div className="bg-[#0D1117] rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">💰 Призовой фонд</div>
                <div className="text-green-400 font-semibold text-xl">{hackathon.prizePool.toLocaleString()} ₽</div>
              </div>
            )}
          </div>

          {canRegister && user && hackathonId && (
            <div className="mt-6 flex gap-4">
              <button onClick={() => setShowCreateTeamModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Создать команду
              </button>
              <button onClick={() => setShowJoinModal(true)}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Присоединиться к команде
              </button>
            </div>
          )}

          {userTeam && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <p className="text-green-400 font-semibold mb-1">✅ Вы в команде: {userTeam.name}</p>
              {userTeam.members && (
                <p className="text-sm text-gray-400">👥 Участников: {userTeam.members.length} / {hackathon.maxTeamSize || 5}</p>
              )}
            </div>
          )}

          {/* Кнопка сдачи проекта — только лидер, только во время хакатона */}
          {userTeam && statusInfo?.status === 'active' && isLeader && (
            <div className="mt-4">
              <button onClick={() => setShowSubmitModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                {teamSubmission ? 'Обновить проект' : 'Загрузить проект'}
              </button>
              {teamSubmission && (
                <p className="text-sm text-gray-400 mt-2">
                  Последняя загрузка: {new Date(teamSubmission.submittedAt).toLocaleString('ru-RU')}
                </p>
              )}
            </div>
          )}
          {userTeam && statusInfo?.status === 'active' && !isLeader && (
            <p className="mt-4 text-sm text-gray-500">Только лидер команды может сдать проект</p>
          )}
        </div>

        {/* Podium — shown only after hackathon ends */}
        {statusInfo?.status === 'completed' && rankings.length > 0 && (
          <PodiumSection rankings={rankings} />
        )}

        {/* Teams */}
        <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Команды ({teams.length})</h2>
          {teams.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Пока нет зарегистрированных команд</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/hackathons/${hackathonId}/team/${team.id}`}
                  className="bg-[#0D1117] rounded-lg p-4 border border-gray-700 hover:border-blue-600 transition-colors block"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{team.name}</h3>
                  <div className="text-sm text-gray-400 mb-2">
                    👤 Лидер: {team.members?.find(m => m.role === 'leader')?.user?.firstName || 'Неизвестно'}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    👥 Участников: {team.members?.length || 0} / {hackathon.maxTeamSize}
                  </div>
                  {team.projectName && (
                    <div className="text-sm text-blue-400">📝 {team.projectName}</div>
                  )}
                  {team.submissions && team.submissions.length > 0 && (
                    <div className="mt-2 text-xs text-green-400">✓ Работа сдана</div>
                  )}
                </Link>
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
              setShowJoinModal(false);
              if (confirm(`Присоединиться к команде "${team.name}"?`)) {
                handleJoinTeam(team.id);
              }
            }}
          />
        )}

        {showSubmitModal && userTeam && (
          <SubmitProjectModal
            team={userTeam}
            existingSubmission={teamSubmission}
            onClose={() => setShowSubmitModal(false)}
            onSuccess={() => { setShowSubmitModal(false); loadData(); }}
          />
        )}
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 5;

function PodiumSection({ rankings }: { rankings: any[] }) {
  const [page, setPage] = useState(0);
  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);
  const totalPages = Math.ceil(rest.length / ITEMS_PER_PAGE);
  const paginated = rest.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  // Visual order: 2nd place left, 1st place centre (tallest), 3rd place right
  const podiumSlots = [
    { team: top3[1], medal: '🥈', place: 2, height: 'h-28', border: 'border-gray-400', text: 'text-gray-300', bg: 'bg-gray-700/30' },
    { team: top3[0], medal: '🥇', place: 1, height: 'h-36', border: 'border-yellow-400', text: 'text-yellow-300', bg: 'bg-yellow-700/20' },
    { team: top3[2], medal: '🥉', place: 3, height: 'h-24', border: 'border-orange-400', text: 'text-orange-300', bg: 'bg-orange-700/20' },
  ];

  return (
    <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700 mb-8">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Итоги хакатона</h2>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 mb-10">
        {podiumSlots.map(({ team, medal, place, height, border, text, bg }) => {
          if (!team) return <div key={`empty-${place}`} className="flex-1 max-w-[220px]" />;
          return (
            <div key={`place-${place}`} className="flex-1 max-w-[220px] flex flex-col items-center">
              <div className="text-4xl mb-2">{medal}</div>
              <div className={`w-full rounded-t-xl border-t-2 border-x-2 ${border} ${bg} p-4 text-center`}>
                <p className={`font-bold text-base ${text} truncate`}>{team.teamName}</p>
                {team.projectName && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{team.projectName}</p>
                )}
                <p className={`text-3xl font-bold mt-3 ${text}`}>{team.totalScore}</p>
                <p className="text-xs text-gray-500 mt-0.5">баллов</p>
              </div>
              <div className={`w-full ${height} ${bg} border-x-2 border-b-2 ${border} rounded-b-lg flex items-center justify-center`}>
                <span className={`text-lg font-bold ${text} opacity-50`}>{place}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teams below 3rd place */}
      {rest.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-gray-400 mb-3 pl-1">Остальные участники</h3>
          <div className="space-y-2">
            {paginated.map((team, i) => (
              <div
                key={team.teamId}
                className="flex items-center justify-between bg-[#0D1117] rounded-lg px-4 py-3 border border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm w-5 text-right shrink-0">
                    {page * ITEMS_PER_PAGE + i + 4}
                  </span>
                  <div>
                    <p className="text-white font-medium">{team.teamName}</p>
                    {team.projectName && (
                      <p className="text-xs text-gray-500">{team.projectName}</p>
                    )}
                  </div>
                </div>
                <span className="text-green-400 font-semibold shrink-0">{team.totalScore}</span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-1.5 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Назад
              </button>
              <span className="text-gray-400 text-sm">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="px-4 py-1.5 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Вперёд →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreateTeamModal({ hackathonId, onClose, onSuccess }: {
  hackathonId: number;
  onClose: () => void;
  onSuccess: (data: CreateTeamDto) => void;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', projectName: '', projectDescription: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSuccess({
        name: formData.name,
        hackathonId,
        memberIds: user?.id ? [parseInt(user.id)] : [],
        projectName: formData.projectName || undefined,
        projectDescription: formData.projectDescription || undefined,
      });
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Название команды</label>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Название проекта</label>
            <input type="text" value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Описание проекта</label>
            <textarea value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              rows={3} />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Отмена</button>
            <button type="submit" disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JoinTeamModal({ teams, onClose, onSelectTeam }: {
  teams: HackathonTeam[];
  onClose: () => void;
  onSelectTeam: (team: HackathonTeam) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Присоединиться к команде</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {teams.map((team) => (
            <button key={team.id} onClick={() => onSelectTeam(team)}
              className="w-full p-4 bg-[#0D1117] border border-gray-700 rounded-lg hover:border-blue-600 transition-colors text-left">
              <div className="text-white font-semibold">{team.name}</div>
              <div className="text-sm text-gray-400">👥 {team.members?.length || 0} участников</div>
            </button>
          ))}
        </div>
        <button onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Отмена</button>
      </div>
    </div>
  );
}

function SubmitProjectModal({ team, existingSubmission, onClose, onSuccess }: {
  team: HackathonTeam;
  existingSubmission: any | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    sourceCodeUrl: existingSubmission?.sourceCodeUrl || '',
    archiveUrl: existingSubmission?.archiveUrl || '',
    documentationUrl: existingSubmission?.documentationUrl || '',
    presentationUrl: existingSubmission?.presentationUrl || '',
    videoDemoUrl: existingSubmission?.videoDemoUrl || '',
    submissionNote: existingSubmission?.submissionNote || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleArchiveUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const result = await hackathonsApi.uploadArchive(team.id, file);
      setFormData(prev => ({ ...prev, archiveUrl: result.archiveUrl }));
    } catch (err: any) {
      setUploadError(err.message || 'Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourceCodeUrl && !formData.archiveUrl) {
      setUploadError('Укажите ссылку на GitHub или загрузите архив проекта');
      return;
    }
    setIsLoading(true);
    setUploadError(null);
    try {
      await hackathonsApi.submitProject({ teamId: team.id, ...formData });
      onSuccess();
    } catch (err: any) {
      setUploadError(err.message || 'Не удалось загрузить проект');
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
            <p className="text-blue-400 text-sm">Проект уже загружен. Вы можете обновить ссылки или заменить архив.</p>
            <p className="text-gray-400 text-xs mt-2">
              Последняя загрузка: {new Date(existingSubmission.submittedAt).toLocaleString('ru-RU')}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ссылка на GitHub <span className="text-gray-500">(или загрузите архив ниже)</span>
            </label>
            <input type="url" value={formData.sourceCodeUrl}
              onChange={(e) => setFormData({ ...formData, sourceCodeUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://github.com/username/project" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Архив проекта (.zip, .tar, .gz, .rar, .7z — макс. 50 МБ)
            </label>
            {formData.archiveUrl ? (
              <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                <span className="text-green-300 text-sm flex-1 truncate">{formData.archiveUrl.split('/').pop()}</span>
                <button type="button" onClick={() => setFormData({ ...formData, archiveUrl: '' })}
                  className="text-gray-400 hover:text-red-400 text-xs shrink-0">Удалить</button>
              </div>
            ) : (
              <div onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <p className="text-gray-400 text-sm">{isUploading ? 'Загрузка...' : 'Нажмите для выбора файла'}</p>
                <input ref={fileInputRef} type="file" accept=".zip,.tar,.gz,.rar,.7z"
                  className="hidden" onChange={handleArchiveUpload} disabled={isUploading} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Документация</label>
            <input type="url" value={formData.documentationUrl}
              onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Презентация</label>
            <input type="url" value={formData.presentationUrl}
              onChange={(e) => setFormData({ ...formData, presentationUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Видео демо</label>
            <input type="url" value={formData.videoDemoUrl}
              onChange={(e) => setFormData({ ...formData, videoDemoUrl: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Комментарий</label>
            <textarea value={formData.submissionNote}
              onChange={(e) => setFormData({ ...formData, submissionNote: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3} placeholder="Краткое описание проекта..." />
          </div>

          {uploadError && <p className="text-red-400 text-sm">{uploadError}</p>}

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Отмена</button>
            <button type="submit" disabled={isLoading || isUploading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {isLoading ? 'Сохранение...' : existingSubmission ? 'Обновить' : 'Загрузить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
