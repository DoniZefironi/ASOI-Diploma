'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useElective, enrollElective, unenrollElective } from '@/shared/api/electives';
import { apiClient } from '@/shared/api/client';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, Users, BookOpen, MapPin, Clock, ChevronLeft, Check, FileText, Video } from 'lucide-react';

interface Props {
  id: number;
}

type Tab = 'schedule' | 'assignments';

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
    time: d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
}

const TYPE_INFO: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  lecture: { label: 'Лекция', color: 'bg-blue-600', icon: <BookOpen className="h-3 w-3" /> },
  practice: { label: 'Практика', color: 'bg-green-600', icon: <FileText className="h-3 w-3" /> },
  test: { label: 'Тест', color: 'bg-red-600', icon: <Clock className="h-3 w-3" /> },
  practice_review: { label: 'Проверка практики', color: 'bg-yellow-600', icon: <FileText className="h-3 w-3" /> },
};

function getTypeInfo(type: string) {
  return TYPE_INFO[type] ?? { label: type, color: 'bg-gray-600', icon: null };
}

export default function ElectiveDetailPage({ id }: Props) {
  const { elective, isLoading, isError, mutate } = useElective(id);
  const [activeTab, setActiveTab] = useState<Tab>('schedule');
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [assignmentsData, setAssignmentsData] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoadingContent(true);
    Promise.all([
      apiClient.get(`/electives/${id}/schedule`).catch(() => []),
      apiClient.get(`/electives/${id}/assignments`).catch(() => []),
    ]).then(([sched, asgn]) => {
      setScheduleItems(Array.isArray(sched) ? sched : []);
      setAssignmentsData(Array.isArray(asgn) ? asgn : []);
    }).finally(() => setLoadingContent(false));
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollElective(id);
      await mutate();
    } catch (err: any) {
      alert(err?.message || 'Не удалось записаться');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!confirm('Отписаться от факультатива?')) return;
    setEnrolling(true);
    try {
      await unenrollElective(id);
      await mutate();
    } catch (err: any) {
      alert(err?.message || 'Не удалось отписаться');
    } finally {
      setEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-canvas flex items-center justify-center">
        <p className="text-gray-400">Загрузка...</p>
      </div>
    );
  }

  if (isError || !elective) {
    return (
      <div className="min-h-screen bg-gh-canvas flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-red-400 text-lg mb-4">Факультатив не найден</p>
          <Link href="/electives">
            <Button variant="secondary">← Назад к факультативам</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const activeEnrollments = elective.enrollments?.filter((e: any) => e.status === 'active') ?? [];

  return (
    <div className="min-h-screen bg-gh-canvas py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back */}
        <div className="mb-6">
          <Link href="/electives">
            <Button variant="secondary" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Факультативы
            </Button>
          </Link>
        </div>

        {/* Header card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {elective.courseGroupName && (
                  <span className="px-2 py-0.5 bg-blue-900/40 border border-blue-700 text-blue-300 rounded-full text-xs">
                    {elective.courseGroupName}
                  </span>
                )}
                {(elective as any).courseGroup?.course?.name && (
                  <span className="px-2 py-0.5 bg-purple-900/40 border border-purple-700 text-purple-300 rounded-full text-xs">
                    {(elective as any).courseGroup.course.name}
                  </span>
                )}
                {!elective.isActive && (
                  <span className="px-2 py-0.5 bg-red-900/40 border border-red-700 text-red-400 rounded-full text-xs">
                    Неактивен
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gh-fg mb-3">{elective.title}</h1>

              {elective.description && (
                <p className="text-gray-400 text-sm mb-4">{elective.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                {elective.instructorName && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>{elective.instructorName}</span>
                  </div>
                )}
                {(elective.startDate || elective.endDate) && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      {elective.startDate ? formatDate(elective.startDate) : '?'}
                      {elective.endDate ? ` — ${formatDate(elective.endDate)}` : ''}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>
                    {elective.currentParticipants} участников
                    {elective.maxParticipants ? ` / ${elective.maxParticipants} мест` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Enroll button */}
            <div className="shrink-0">
              {elective.isEnrolled ? (
                <div className="flex flex-col items-end gap-2">
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 border border-green-600 text-green-400 rounded-full text-sm font-medium">
                    <Check className="h-4 w-4" />
                    Вы записаны
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={enrolling}
                    onClick={handleUnenroll}
                  >
                    {enrolling ? 'Отмена...' : 'Отписаться'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  disabled={enrolling || !elective.isActive || (elective.maxParticipants != null && elective.currentParticipants >= elective.maxParticipants)}
                  onClick={handleEnroll}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {enrolling ? 'Запись...' :
                    !elective.isActive ? 'Факультатив закрыт' :
                    (elective.maxParticipants != null && elective.currentParticipants >= elective.maxParticipants) ? 'Нет мест' :
                    'Записаться'}
                </Button>
              )}
            </div>
          </div>

          {/* Participants progress bar */}
          {elective.maxParticipants != null && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Заполненность</span>
                <span>{Math.round((elective.currentParticipants / elective.maxParticipants) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    elective.currentParticipants >= elective.maxParticipants ? 'bg-red-500' :
                    elective.currentParticipants / elective.maxParticipants >= 0.75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((elective.currentParticipants / elective.maxParticipants) * 100))}%` }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'schedule' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Расписание
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'assignments' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Задания
          </button>
        </div>

        {/* Tab content */}
        {loadingContent ? (
          <Card className="p-8 text-center">
            <p className="text-gray-400">Загрузка...</p>
          </Card>
        ) : activeTab === 'schedule' ? (
          scheduleItems.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-600" />
              <p className="text-white font-medium mb-1">Расписание пока не добавлено</p>
              <p className="text-gray-400 text-sm">Расписание появится после добавления занятий администратором</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {scheduleItems
                .slice()
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map((item: any) => {
                  const typeInfo = getTypeInfo(item.type);
                  const past = new Date(item.startTime) < new Date();
                  const { date, time } = formatDateTime(item.startTime);
                  const endTime = item.endTime ? formatDateTime(item.endTime).time : null;
                  return (
                    <Link
                      key={item.id}
                      href={`/schedule/${item.id}`}
                      className={`block p-4 rounded-lg border-l-4 transition-colors ${
                        past
                          ? 'bg-gray-800/50 border-l-gray-600 hover:bg-gray-800'
                          : 'bg-gray-800 border-l-blue-500 hover:bg-gray-750'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 ${typeInfo.color} text-white text-xs rounded-full flex items-center gap-1`}>
                              {typeInfo.icon}
                              {typeInfo.label}
                            </span>
                            {past && (
                              <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">Завершено</span>
                            )}
                          </div>
                          <h4 className="text-lg font-semibold text-gh-fg mb-2">{item.title}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{time}{endTime ? ` — ${endTime}` : ''}</span>
                            </div>
                            {item.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{item.location}</span>
                              </div>
                            )}
                            {item.meetingUrl && (
                              <div className="flex items-center gap-1">
                                <Video className="h-4 w-4" />
                                <span>Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )
        ) : (
          assignmentsData.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-600" />
              <p className="text-white font-medium mb-1">Заданий пока нет</p>
              <p className="text-gray-400 text-sm">Задания появятся после добавления администратором</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {assignmentsData
                .slice()
                .sort((a, b) => new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime())
                .map((assignment: any) => {
                  const past = assignment.deadline && new Date(assignment.deadline) < new Date();
                  const { date, time } = assignment.deadline ? formatDateTime(assignment.deadline) : { date: '—', time: '' };
                  return (
                    <Link
                      key={assignment.id}
                      href={`/assignments/${assignment.id}`}
                      className={`block p-4 rounded-lg border-l-4 transition-colors ${
                        past
                          ? 'bg-red-900/20 border-l-gray-600 hover:bg-red-900/30'
                          : 'bg-red-900/30 border-l-red-500 hover:bg-red-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Дедлайн
                            </span>
                            {past && (
                              <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">Просрочено</span>
                            )}
                          </div>
                          <h4 className="text-lg font-semibold text-gh-fg mb-2">{assignment.title}</h4>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{date}</span>
                            </div>
                            {time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {assignment.maxScore != null && (
                          <span className="text-gray-400 text-sm shrink-0 ml-4">{assignment.maxScore} баллов</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
