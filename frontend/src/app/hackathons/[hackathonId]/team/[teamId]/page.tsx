'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { hackathonsApi, HackathonTeam, HackathonSubmission, Hackathon } from '@/shared/api/hackathons';
import { useAuth } from '@/shared/lib/auth-context';
import { Users, Github, ExternalLink, Upload, Archive, User, Clock } from 'lucide-react';

type HackathonWindow = 'before' | 'active' | 'ended';

function getHackathonWindow(hackathon: Hackathon): HackathonWindow {
  const now = new Date();
  if (now < new Date(hackathon.startDate)) return 'before';
  if (now > new Date(hackathon.endDate)) return 'ended';
  return 'active';
}

export default function TeamDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const hackathonId = parseInt(params?.hackathonId as string);
  const teamId = parseInt(params?.teamId as string);

  const [team, setTeam] = useState<HackathonTeam | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [submission, setSubmission] = useState<HackathonSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingArchive, setIsUploadingArchive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sourceCodeUrl: '',
    documentationUrl: '',
    presentationUrl: '',
    videoDemoUrl: '',
    archiveUrl: '',
    submissionNote: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, [teamId, hackathonId]);

  const loadData = async () => {
    try {
      const [teamData, hackathonData, submissionData] = await Promise.all([
        hackathonsApi.getTeam(teamId).catch(() => null),
        hackathonsApi.getOne(hackathonId).catch(() => null),
        hackathonsApi.getTeamSubmission(teamId).catch(() => null),
      ]);

      setTeam(teamData);
      setHackathon(hackathonData);
      setSubmission(submissionData);

      if (submissionData) {
        setFormData({
          sourceCodeUrl: submissionData.sourceCodeUrl || '',
          documentationUrl: submissionData.documentationUrl || '',
          presentationUrl: submissionData.presentationUrl || '',
          videoDemoUrl: submissionData.videoDemoUrl || '',
          archiveUrl: submissionData.archiveUrl || '',
          submissionNote: submissionData.submissionNote || '',
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingArchive(true);
    setUploadError(null);

    try {
      const result = await hackathonsApi.uploadArchive(teamId, file);
      setFormData(prev => ({ ...prev, archiveUrl: result.archiveUrl }));
    } catch (err: any) {
      setUploadError(err.message || 'Ошибка загрузки файла');
    } finally {
      setIsUploadingArchive(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourceCodeUrl && !formData.archiveUrl) {
      setUploadError('Укажите ссылку на GitHub или загрузите архив проекта');
      return;
    }
    setIsSubmitting(true);
    setUploadError(null);

    try {
      await hackathonsApi.submitProject({ teamId, ...formData });
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      setUploadError(err.message || 'Не удалось сохранить проект');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center text-white">Загрузка...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center text-white">
          Команда не найдена
          <br />
          <Link href="/hackathons" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            ← Назад к хакатонам
          </Link>
        </div>
      </div>
    );
  }

  const isLeader = Boolean(user?.id && team.leaderId?.toString() === user.id);
  const window: HackathonWindow = hackathon ? getHackathonWindow(hackathon) : 'before';
  const canSubmit = isLeader && window === 'active';

  const windowBanner = {
    before: { text: `Хакатон начнётся ${hackathon ? new Date(hackathon.startDate).toLocaleString('ru-RU') : ''}`, color: 'bg-blue-900/40 border-blue-700 text-blue-300' },
    active: { text: `Хакатон идёт — приём работ до ${hackathon ? new Date(hackathon.endDate).toLocaleString('ru-RU') : ''}`, color: 'bg-green-900/40 border-green-700 text-green-300' },
    ended: { text: `Хакатон завершился ${hackathon ? new Date(hackathon.endDate).toLocaleString('ru-RU') : ''}`, color: 'bg-gray-800 border-gray-600 text-gray-400' },
  }[window];

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Link href={`/hackathons/${hackathonId}`} className="text-blue-400 hover:text-blue-300">
            ← Назад к хакатону
          </Link>
        </div>

        {/* Баннер временного окна */}
        <div className={`mb-6 px-4 py-3 rounded-lg border flex items-center gap-2 text-sm ${windowBanner.color}`}>
          <Clock className="h-4 w-4 shrink-0" />
          {windowBanner.text}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Информация о команде */}
          <div className="space-y-6">
            <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700">
              <h1 className="text-3xl font-bold text-white mb-4">{team.name}</h1>

              {team.projectName && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Проект</p>
                  <p className="text-white text-lg">{team.projectName}</p>
                </div>
              )}

              {team.projectDescription && (
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Описание</p>
                  <p className="text-gray-300">{team.projectDescription}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="h-4 w-4" />
                <span>{team.members?.length || 0} участников</span>
              </div>
            </div>

            {/* Участники */}
            <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Участники</h2>
              <div className="space-y-3">
                {team.members?.map((member) => {
                  const isCurrentUser = member.userId?.toString() === user?.id;
                  return (
                    <div
                      key={member.id}
                      className={`p-4 rounded-lg border flex items-center justify-between ${
                        isCurrentUser ? 'bg-blue-900/20 border-blue-700' : 'bg-gray-800 border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-white font-medium">
                          {member.user?.firstName} {member.user?.lastName}
                          {isCurrentUser && <span className="ml-2 text-xs text-blue-400">(Вы)</span>}
                        </p>
                      </div>
                      {member.role === 'leader' && (
                        <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">Лидер</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Проект */}
          <div className="space-y-6">
            <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Проект команды</h2>

              {submission ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
                    <p className="text-green-400 text-sm">Проект загружен</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Обновлён: {new Date(submission.submittedAt).toLocaleString('ru-RU')}
                    </p>
                  </div>

                  {submission.sourceCodeUrl && (
                    <a href={submission.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <Github className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">GitHub репозиторий</span>
                      <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                    </a>
                  )}

                  {submission.archiveUrl && (
                    <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904'}${submission.archiveUrl}`}
                      className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <Archive className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">Архив проекта</span>
                      <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                    </a>
                  )}

                  {submission.documentationUrl && (
                    <a href={submission.documentationUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <span className="text-white text-sm">Документация</span>
                      <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                    </a>
                  )}

                  {submission.presentationUrl && (
                    <a href={submission.presentationUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <span className="text-white text-sm">Презентация</span>
                      <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                    </a>
                  )}

                  {submission.videoDemoUrl && (
                    <a href={submission.videoDemoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <span className="text-white text-sm">Видео демо</span>
                      <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                    </a>
                  )}

                  {submission.submissionNote && (
                    <p className="text-gray-300 text-sm p-3 bg-gray-800 rounded-lg">{submission.submissionNote}</p>
                  )}

                  {canSubmit && (
                    <button onClick={() => setIsEditing(true)}
                      className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Редактировать проект
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4 text-sm">Проект ещё не загружен</p>
                  {canSubmit && (
                    <button onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Загрузить проект
                    </button>
                  )}
                  {!canSubmit && window !== 'active' && (
                    <p className="text-gray-500 text-xs">
                      {window === 'before' ? 'Загрузка откроется после старта хакатона' : 'Приём работ завершён'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Форма */}
            {isEditing && canSubmit && (
              <div className="bg-[#161B22] rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-5">
                  {submission ? 'Редактировать проект' : 'Загрузить проект'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Ссылка на GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.sourceCodeUrl}
                      onChange={(e) => setFormData({ ...formData, sourceCodeUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  {/* Архив */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Архив проекта (.zip, .tar, .gz, .rar, .7z, макс. 50 МБ)
                    </label>
                    {formData.archiveUrl ? (
                      <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700 rounded-lg">
                        <Archive className="h-4 w-4 text-green-400" />
                        <span className="text-green-300 text-sm flex-1 truncate">{formData.archiveUrl.split('/').pop()}</span>
                        <button type="button" onClick={() => setFormData({ ...formData, archiveUrl: '' })}
                          className="text-gray-400 hover:text-red-400 text-xs">
                          Удалить
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <Upload className="h-6 w-6 text-gray-400 mb-2" />
                        <p className="text-gray-400 text-sm">
                          {isUploadingArchive ? 'Загрузка...' : 'Нажмите для выбора файла'}
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".zip,.tar,.gz,.rar,.7z"
                          className="hidden"
                          onChange={handleArchiveUpload}
                          disabled={isUploadingArchive}
                        />
                      </div>
                    )}
                  </div>

                  {/* Дополнительные ссылки */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Документация</label>
                    <input type="url" value={formData.documentationUrl}
                      onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Презентация</label>
                    <input type="url" value={formData.presentationUrl}
                      onChange={(e) => setFormData({ ...formData, presentationUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Видео демо</label>
                    <input type="url" value={formData.videoDemoUrl}
                      onChange={(e) => setFormData({ ...formData, videoDemoUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://youtube.com/..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Комментарий</label>
                    <textarea value={formData.submissionNote}
                      onChange={(e) => setFormData({ ...formData, submissionNote: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={3} placeholder="Краткое описание..." />
                  </div>

                  {uploadError && (
                    <p className="text-red-400 text-sm">{uploadError}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setIsEditing(false); setUploadError(null); }}
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm">
                      Отмена
                    </button>
                    <button type="submit" disabled={isSubmitting || isUploadingArchive}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm">
                      {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
