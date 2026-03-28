'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { hackathonsApi, Hackathon, HackathonTeam, HackathonSubmission, GradeSubmissionDto } from '@/shared/api/hackathons';
import {
  Award, Users, Calendar, GitBranch, Archive, ExternalLink,
  FileText, Video, Loader2, ArrowLeft, CheckCircle, Clock, ChevronDown, ChevronUp, Star,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904';

function GradeModal({ submission, onClose, onSuccess }: {
  submission: HackathonSubmission;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const existing = submission.grades?.[0];
  const [form, setForm] = useState({
    innovationScore: existing?.innovationScore ?? 0,
    functionalityScore: existing?.functionalityScore ?? 0,
    presentationScore: existing?.presentationScore ?? 0,
    teamworkScore: existing?.teamworkScore ?? 0,
    feedback: existing?.feedback ?? '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = (form.innovationScore || 0) + (form.functionalityScore || 0)
    + (form.presentationScore || 0) + (form.teamworkScore || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await hackathonsApi.gradeSubmission(submission.id, form as GradeSubmissionDto);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении оценки');
    } finally {
      setIsLoading(false);
    }
  };

  const scoreField = (label: string, key: keyof typeof form) => (
    <div>
      <label className="block text-sm text-gray-400 mb-1">
        {label} <span className="text-gray-500">(0-100)</span>
      </label>
      <input
        type="number" min={0} max={100}
        value={form[key] as number}
        onChange={(e) => setForm(prev => ({ ...prev, [key]: Number(e.target.value) }))}
        className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1C2128] border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-1">Оценить работу</h2>
        <p className="text-sm text-gray-500 mb-5">
          Итог:{' '}
          <span className="text-green-400 font-semibold">{total}</span>/400
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {scoreField('Инновационность', 'innovationScore')}
          {scoreField('Функциональность', 'functionalityScore')}
          {scoreField('Презентация', 'presentationScore')}
          {scoreField('Командная работа', 'teamworkScore')}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Комментарий</label>
            <textarea
              value={form.feedback}
              onChange={(e) => setForm(prev => ({ ...prev, feedback: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              placeholder="Оставьте комментарий..."
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm">
              Отмена
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
              {isLoading ? 'Сохранение...' : existing ? 'Обновить оценку' : 'Сохранить оценку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmissionBlock({ submission, canGrade, onGrade }: {
  submission: HackathonSubmission;
  canGrade?: boolean;
  onGrade?: () => void;
}) {
  return (
    <div className="mt-3 border-t border-gray-700 pt-3 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <span className="text-sm font-medium text-green-400">Проект сдан</span>
        <span className="text-xs text-gray-500 ml-auto">
          {new Date(submission.submittedAt).toLocaleString('ru-RU')}
        </span>
      </div>

      {submission.sourceCodeUrl && (
        <a href={submission.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
          <GitBranch className="h-4 w-4 shrink-0" />
          GitHub репозиторий
          <ExternalLink className="h-3 w-3 ml-auto" />
        </a>
      )}

      {submission.archiveUrl && (
        <a href={`${API_URL}${submission.archiveUrl}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
          <Archive className="h-4 w-4 shrink-0" />
          Архив проекта
          <ExternalLink className="h-3 w-3 ml-auto" />
        </a>
      )}

      {submission.documentationUrl && (
        <a href={submission.documentationUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
          <FileText className="h-4 w-4 shrink-0" />
          Документация
          <ExternalLink className="h-3 w-3 ml-auto" />
        </a>
      )}

      {submission.presentationUrl && (
        <a href={submission.presentationUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
          <FileText className="h-4 w-4 shrink-0" />
          Презентация
          <ExternalLink className="h-3 w-3 ml-auto" />
        </a>
      )}

      {submission.videoDemoUrl && (
        <a href={submission.videoDemoUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
          <Video className="h-4 w-4 shrink-0" />
          Видео демо
          <ExternalLink className="h-3 w-3 ml-auto" />
        </a>
      )}

      {submission.submissionNote && (
        <p className="text-sm text-gray-300 bg-gray-800 rounded p-2 mt-1">
          {submission.submissionNote}
        </p>
      )}

      {submission.grades && submission.grades.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Оценок: {submission.grades.length}</p>
          {submission.grades.map(g => (
            <div key={g.id} className="text-xs text-gray-300 space-y-0.5">
              <div>
                Итог:{' '}
                <span className="text-green-400 font-semibold">{g.totalScore}</span>/400
                <span className="text-gray-500 ml-2">
                  Иннов: {g.innovationScore} · Функц: {g.functionalityScore} ·
                  През: {g.presentationScore} · Команда: {g.teamworkScore}
                </span>
              </div>
              {g.feedback && (
                <p className="text-gray-400 italic">"{g.feedback}"</p>
              )}
            </div>
          ))}
        </div>
      )}

      {canGrade && onGrade && (
        <div className="pt-2 border-t border-gray-700">
          <button
            onClick={onGrade}
            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/20 border border-yellow-600 text-yellow-400 text-xs rounded-lg hover:bg-yellow-600/30 transition-colors"
          >
            <Star className="h-3 w-3" />
            {submission.grades && submission.grades.length > 0
              ? 'Изменить оценку'
              : 'Выставить оценку'}
          </button>
        </div>
      )}
    </div>
  );
}

function TeamCard({ team, isCompleted, onGrade }: {
  team: HackathonTeam;
  isCompleted: boolean;
  onGrade: (submission: HackathonSubmission) => void;
}) {
  const [open, setOpen] = useState(false);
  const submission = team.submissions?.[0] ?? null;

  return (
    <div className="border border-gray-700 rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}
      >
        <div>
          <h3 className="font-semibold text-white">{team.name}</h3>
          {team.projectName && <p className="text-sm text-gray-400">{team.projectName}</p>}
        </div>
        <div className="flex items-center gap-3">
          {submission ? (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <CheckCircle className="h-3 w-3" /> Сдано
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" /> Не сдано
            </span>
          )}
          {submission?.grades && submission.grades.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-yellow-400">
              <Star className="h-3 w-3" /> {submission.grades[0].totalScore}
            </span>
          )}
          <span className="text-xs text-gray-500">{team.members?.length || 0} уч.</span>
          {open
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </div>

      {open && (
        <div className="mt-3">
          <div className="space-y-1 mb-3">
            {team.members?.map(m => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="text-white">
                  {m.user?.firstName} {m.user?.lastName}
                  {m.role === 'leader' && (
                    <span className="ml-2 px-1.5 py-0.5 bg-yellow-600 text-white text-xs rounded-full">
                      Лидер
                    </span>
                  )}
                </span>
                <span className="text-gray-500 text-xs">{m.user?.email}</span>
              </div>
            ))}
          </div>

          {submission ? (
            <SubmissionBlock
              submission={submission}
              canGrade={isCompleted}
              onGrade={() => onGrade(submission)}
            />
          ) : (
            <p className="text-sm text-gray-500 border-t border-gray-700 pt-3">
              Работа ещё не сдана
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminHackathonDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id ? parseInt(params.id as string) : null;
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<HackathonSubmission | null>(null);

  const loadHackathon = () => {
    if (!id || isNaN(id)) return;
    setIsLoading(true);
    hackathonsApi.getOne(id)
      .then(setHackathon)
      .catch(() => setHackathon(null))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadHackathon();
  }, [id]);

  if (!id || isNaN(id)) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          <p>Неверный ID хакатона</p>
          <Button onClick={() => router.push('/admin/hackathons')} className="mt-4" variant="secondary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Назад
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          <p>Ошибка загрузки хакатона</p>
          <Button onClick={() => router.push('/admin/hackathons')} className="mt-4" variant="secondary">
            <ArrowLeft className="h-4 w-4 mr-2" /> Назад
          </Button>
        </CardContent>
      </Card>
    );
  }

  const now = new Date();
  const isCompleted = now > new Date(hackathon.endDate);
  const isActive = now >= new Date(hackathon.startDate) && now <= new Date(hackathon.endDate);
  const submittedCount = hackathon.teams?.filter(t => t.submissions && t.submissions.length > 0).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => router.push('/admin/hackathons')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Назад
        </Button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{hackathon.title}</h1>
            {hackathon.theme && <p className="text-blue-400">{hackathon.theme}</p>}
            <p className="text-gray-400 mt-1">{hackathon.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive
              ? 'bg-green-900/50 text-green-400 border border-green-700'
              : now < new Date(hackathon.startDate)
                ? 'bg-blue-900/50 text-blue-400 border border-blue-700'
                : 'bg-gray-800 text-gray-400 border border-gray-600'
          }`}>
            {isActive ? 'Идёт' : now < new Date(hackathon.startDate) ? 'Не начался' : 'Завершён'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Команд</p>
              <p className="text-2xl font-bold text-white">{hackathon.teams?.length ?? 0}</p>
            </div>
            <Users className="h-7 w-7 text-blue-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Сдали работу</p>
              <p className="text-2xl font-bold text-green-400">{submittedCount}</p>
            </div>
            <CheckCircle className="h-7 w-7 text-green-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Начало</p>
              <p className="text-sm font-semibold text-white">
                {new Date(hackathon.startDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <Calendar className="h-7 w-7 text-purple-400" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Конец</p>
              <p className="text-sm font-semibold text-white">
                {new Date(hackathon.endDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <Award className="h-7 w-7 text-orange-400" />
          </CardContent>
        </Card>
      </div>

      {isCompleted && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg px-4 py-3 text-sm text-yellow-300 flex items-center gap-2">
          <Star className="h-4 w-4 shrink-0" />
          Хакатон завершён — раскройте карточку команды чтобы выставить оценку.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Команды и сданные работы ({hackathon.teams?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hackathon.teams && hackathon.teams.length > 0 ? (
            <div className="space-y-3">
              {hackathon.teams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  isCompleted={isCompleted}
                  onGrade={(submission) => setGradingSubmission(submission)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Команды ещё не зарегистрированы</p>
            </div>
          )}
        </CardContent>
      </Card>

      {gradingSubmission && (
        <GradeModal
          submission={gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          onSuccess={() => {
            setGradingSubmission(null);
            loadHackathon();
          }}
        />
      )}
    </div>
  );
}
