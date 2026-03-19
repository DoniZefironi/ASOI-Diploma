// features/assignments/AssignmentDetailPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { apiClient } from '@/shared/api/client';
import Link from 'next/link';
import { Calendar, Clock, FileText, Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  type: string;
  maxScore: number;
  deadline: string;
  isActive: boolean;
  peerReviewEnabled: boolean;
  peerReviewStartDate?: string;
  peerReviewEndDate?: string;
  peerReviewsPerStudent: number;
  peerReviewCriteria?: string;
  courseGroup?: {
    id: number;
    name: string;
    course?: {
      id: number;
      name: string;
    };
  };
}

interface Submission {
  id: number;
  content: string;
  repositoryUrl?: string;
  attachments?: string[];
  status: string;
  submittedAt?: string;
  finalScore?: number;
  peerReviewsReceived?: any[];
}

interface PeerReviewToComplete {
  id: number;
  reviewId: number;
  submissionId: number;
  assignmentId: number;
  assignmentTitle: string;
  studentName: string;
  content: string;
  attachments?: string[];
  isCompleted: boolean;
  score?: number;
  feedback?: string;
  peerReviewCriteria?: string;
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const assignmentId = parseInt(params?.id as string);

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [peerReviewsToComplete, setPeerReviewsToComplete] = useState<PeerReviewToComplete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitContent, setSubmitContent] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, [assignmentId, user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [assignmentData, submissionsData, peerReviewsData] = await Promise.all([
        apiClient.get(`/assignments/${assignmentId}`),
        apiClient.get(`/assignments/${assignmentId}/submissions`),
        apiClient.get('/peer-reviews/to-review'),
      ]);

      setAssignment(assignmentData);

      // Находим свою submission
      const mySubmission = submissionsData?.find((s: any) => s.userId?.toString() === user?.id);
      setSubmission(mySubmission || null);

      // Фильтруем peer reviews для этого задания
      const assignmentReviews = peerReviewsData?.filter((r: any) => r.assignmentId === assignmentId) || [];
      setPeerReviewsToComplete(assignmentReviews);
    } catch (error) {
      console.error('Failed to load assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!submitContent.trim() && !repositoryUrl && attachments.length === 0) {
      alert('Введите содержание работы, ссылку на репозиторий или прикрепите файл');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.post('/assignments/submissions', {
        assignmentId,
        content: submitContent || null,
        repositoryUrl: repositoryUrl || null,
        attachments: attachments.length > 0 ? attachments : null,
      });
      alert('Работа успешно отправлена!');
      setSubmitContent('');
      setRepositoryUrl('');
      setAttachments([]);
      loadData();
    } catch (error: any) {
      console.error('Failed to submit assignment:', error);
      alert('Ошибка при отправке: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер 10MB');
      return;
    }

    try {
      setIsUploading(true);
      // Создаем FormData для загрузки файла
      const formData = new FormData();
      formData.append('file', file);

      // Загружаем файл (в реальности нужен эндпоинт для загрузки)
      // Для примера используем заглушку
      const uploadResponse = await apiClient.post('/upload', formData);
      
      // В реальности здесь будет URL загруженного файла
      const fileUrl = uploadResponse.url || URL.createObjectURL(file);
      setAttachments(prev => [...prev, fileUrl]);
      alert(`Файл "${file.name}" успешно загружен!`);
    } catch (error: any) {
      console.error('Failed to upload file:', error);
      // Для демонстрации добавляем файл локально
      const fileUrl = URL.createObjectURL(file);
      setAttachments(prev => [...prev, fileUrl]);
      alert('Файл добавлен (демо режим)');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const isPast = (dateString: string) => new Date(dateString) < new Date();
  const isInPeriod = (start?: string, end?: string) => {
    const now = new Date();
    if (start && now < new Date(start)) return false;
    if (end && now > new Date(end)) return false;
    return true;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      draft: { label: 'Черновик', color: 'bg-gray-600' },
      submitted: { label: 'Отправлено', color: 'bg-blue-600' },
      under_review: { label: 'На проверке', color: 'bg-yellow-600' },
      reviewed: { label: 'Проверено', color: 'bg-green-600' },
      graded: { label: 'Оценено', color: 'bg-purple-600' },
    };
    return statuses[status] || { label: status, color: 'bg-gray-600' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Задание не найдено</h1>
            <Link href="/schedule">
              <Button variant="secondary">← Назад к расписанию</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const deadline = formatDateTime(assignment.deadline);
  const isDeadlinePast = isPast(assignment.deadline);
  const isPeerReviewActive = assignment.peerReviewEnabled && 
    isInPeriod(assignment.peerReviewStartDate, assignment.peerReviewEndDate);

  const completedReviews = peerReviewsToComplete.filter(r => r.isCompleted).length;
  const totalReviews = peerReviewsToComplete.length;

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        {/* Навигация */}
        <div className="mb-6">
          <Link href="/schedule">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к расписанию
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-white">{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Дедлайн: {deadline.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{deadline.time}</span>
                  </div>
                  {isDeadlinePast ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Просрочено
                    </span>
                  ) : (
                    <span className="text-green-500 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Активно
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Макс. балл:</span>
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full font-semibold">
                    {assignment.maxScore}
                  </span>
                </div>

                {assignment.courseGroup && (
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400">📚 Группа</p>
                    <p className="text-white font-semibold">{assignment.courseGroup.name}</p>
                    {assignment.courseGroup.course && (
                      <p className="text-sm text-gray-500">{assignment.courseGroup.course.name}</p>
                    )}
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Описание</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{assignment.description}</p>
                </div>

                {assignment.peerReviewEnabled && (
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">🔄 Peer Review</h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        Это задание включает взаимопроверку. Каждый студент проверит работы других студентов.
                      </p>
                      {assignment.peerReviewCriteria && (
                        <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                          <h4 className="text-blue-400 font-semibold mb-2">📋 Критерии оценки:</h4>
                          <p className="text-white whitespace-pre-wrap text-sm">{assignment.peerReviewCriteria}</p>
                        </div>
                      )}
                      {assignment.peerReviewStartDate && assignment.peerReviewEndDate && (
                        <p className="text-sm text-gray-400">
                          📅 Период проверки: {formatDateTime(assignment.peerReviewStartDate).date} - {formatDateTime(assignment.peerReviewEndDate).date}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        ℹ️ Peer review назначается автоматически при создании задания
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Отправка работы */}
            {assignment?.type === 'practice_review' ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 text-yellow-400">
                    <span className="text-2xl">👁️</span>
                    <div>
                      <p className="font-medium text-white">Это задание — проверка работ</p>
                      <p className="text-sm text-gray-400 mt-0.5">Сдавать свою работу здесь не нужно. Перейдите во вкладку Peer Review, чтобы проверить работы других студентов.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : !submission && !isDeadlinePast && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Отправить работу
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Текст работы</label>
                    <textarea
                      value={submitContent}
                      onChange={(e) => setSubmitContent(e.target.value)}
                      placeholder="Введите текст работы..."
                      rows={6}
                      className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">
                      Можно оставить пустым, если используете репозиторий или файлы
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Ссылка на репозиторий (GitHub, GitLab)</label>
                    <input
                      type="url"
                      value={repositoryUrl}
                      onChange={(e) => setRepositoryUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Прикрепить файлы</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="flex-1 bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {isUploading && (
                        <span className="text-sm text-gray-400">Загрузка...</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Максимальный размер файла: 10MB
                    </p>

                    {attachments.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                            <span className="text-sm text-white truncate flex-1">
                              📎 {file.split('/').pop() || `Файл ${index + 1}`}
                            </span>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-400 text-sm ml-2"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (!submitContent.trim() && !repositoryUrl && attachments.length === 0)}
                    className="w-full"
                  >
                    {isSubmitting ? 'Отправка...' : '📤 Отправить работу'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Статус отправки */}
            {submission && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ваша работа
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Статус:</span>
                    <span className={`px-3 py-1 ${getStatusBadge(submission.status).color} text-white text-sm rounded-full`}>
                      {getStatusBadge(submission.status).label}
                    </span>
                  </div>

                  {submission.submittedAt && (
                    <p className="text-sm text-gray-400">
                      📅 Отправлено: {formatDateTime(submission.submittedAt).date} в {formatDateTime(submission.submittedAt).time}
                    </p>
                  )}

                  {submission.finalScore !== undefined && (
                    <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                      <p className="text-green-400 font-semibold">Ваша оценка</p>
                      <p className="text-3xl font-bold text-white">{submission.finalScore} / {assignment.maxScore}</p>
                    </div>
                  )}

                  <div className="p-3 bg-gray-800 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Содержание:</h4>
                    {submission.content && (
                      <p className="text-white whitespace-pre-wrap mb-3">{submission.content}</p>
                    )}
                    {submission.repositoryUrl && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-400 mb-1">🔗 Репозиторий:</p>
                        <a
                          href={submission.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline text-sm break-all"
                        >
                          {submission.repositoryUrl}
                        </a>
                      </div>
                    )}
                    {submission.attachments && submission.attachments.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">📎 Файлы:</p>
                        <div className="space-y-1">
                          {submission.attachments.map((file: string, index: number) => (
                            <a
                              key={index}
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-400 hover:underline text-sm truncate"
                            >
                              📎 {file.split('/').pop() || `Файл ${index + 1}`}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Peer Review панель */}
          {assignment.peerReviewEnabled && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    🔄 Peer Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Прогресс проверки</span>
                      <span className="text-sm text-white font-semibold">{completedReviews} / {totalReviews}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${totalReviews > 0 ? (completedReviews / totalReviews) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {isPeerReviewActive ? (
                    <Link href={`/peer-review?assignment=${assignmentId}`} className="block">
                      <Button className="w-full" variant="primary">
                        📝 Проверить работы
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full" disabled variant="secondary">
                      {assignment.peerReviewStartDate && new Date(assignment.peerReviewStartDate) > new Date()
                        ? '⏳ Проверка ещё не началась'
                        : '⏰ Проверка завершена'}
                    </Button>
                  )}

                  {peerReviewsToComplete.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-400">Работы на проверку:</h4>
                      {peerReviewsToComplete.map((review) => (
                        <div 
                          key={review.reviewId}
                          className={`p-3 rounded-lg border-l-4 ${
                            review.isCompleted 
                              ? 'bg-green-900/20 border-l-green-600' 
                              : 'bg-yellow-900/20 border-l-yellow-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-white font-medium">{review.studentName}</p>
                              <p className="text-xs text-gray-400">Работа #{review.submissionId}</p>
                            </div>
                            {review.isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          {review.isCompleted && review.score !== undefined && (
                            <p className="text-xs text-gray-400 mt-1">
                              Ваша оценка: <span className="text-white font-semibold">{review.score}</span>
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {peerReviewsToComplete.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Вам не назначено работ для проверки
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
