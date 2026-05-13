// features/schedule/SchedulePage.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, getCourseTypeFromRole } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { Calendar, Clock, MapPin, Video, Filter, BookOpen, FileText, Trophy, ChevronDown, ChevronRight, Star, CheckCircle, Loader2 } from 'lucide-react';
import { usePeerReviewsToReview, useMyReceivedReviews, type ReceivedReviewGroup } from '@/shared/api/admin/peer-reviews';

interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingUrl?: string;
  courseGroupId: number;
  courseGroup?: {
    id: number;
    name: string;
    course?: {
      id: number;
      name: string;
      type: string;
    };
  };
  instructor?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  courseGroupId: number;
  courseGroup?: {
    id: number;
    name: string;
    course?: {
      id: number;
      name: string;
    };
  };
}

interface Hackathon {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
}

interface ElectiveItem {
  id: number;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  courseGroupName?: string;
  courseName?: string;
}

interface WeekGroup {
  weekStart: Date;
  weekEnd: Date;
  scheduleItems: ScheduleItem[];
  assignments: Assignment[];
  hackathons: Hackathon[];
  electives: ElectiveItem[];
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [enrolledElectives, setEnrolledElectives] = useState<ElectiveItem[]>([]);
  const [userGroupIds, setUserGroupIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>('all');
  const [showPast, setShowPast] = useState(false);
  const [showFuture, setShowFuture] = useState(true);
  const [activeTab, setActiveTab] = useState<'schedule' | 'peer_review'>('schedule');

  const { reviews: toReview, isLoading: isLoadingToReview } = usePeerReviewsToReview();
  const { received, isLoading: isLoadingReceived } = useMyReceivedReviews();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [scheduleData, assignmentsData, hackathonsData, registrationsData, electivesData] = await Promise.all([
        apiClient.get('/schedule'),
        apiClient.get('/assignments'),
        apiClient.get('/hackathons'),
        apiClient.get('/course-groups/user/registrations'),
        apiClient.get('/electives').catch(() => []),
      ]);

      // Получаем ID групп пользователя
      const approvedRegistrations = registrationsData?.filter((r: any) => r.status === 'approved') || [];
      const groupIds = approvedRegistrations.map((r: any) => r.courseGroupId);
      setUserGroupIds(groupIds);

      // Фильтруем расписание по группам пользователя
      const userSchedule = scheduleData?.filter((item: any) => 
        groupIds.includes(item.courseGroupId)
      ) || [];
      setSchedule(userSchedule);

      // Фильтруем задания по группам пользователя
      const userAssignments = assignmentsData?.filter((a: any) => 
        groupIds.includes(a.courseGroupId)
      ) || [];
      setAssignments(userAssignments);

      setHackathons(hackathonsData || []);

      // Фильтруем факультативы: только те, на которые записан
      const myElectives = (electivesData || []).filter((e: any) => e.isEnrolled);
      setEnrolledElectives(myElectives);

      // Развернуть первые 2 недели
      const weeks = groupByWeek(userSchedule, userAssignments, hackathonsData || [], myElectives);
      const initialExpanded = new Set<string>();
      weeks.slice(0, 2).forEach(week => {
        initialExpanded.add(week.weekStart.toISOString());
      });
      setExpandedWeeks(initialExpanded);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupByWeek = (scheduleItems: ScheduleItem[], assignments: Assignment[], hackathons: Hackathon[], electives: ElectiveItem[] = []): WeekGroup[] => {
    const weeks = new Map<string, WeekGroup>();
    const now = new Date();

    // Добавляем занятия
    scheduleItems.forEach(item => {
      const date = new Date(item.startTime);
      const weekStart = getWeekStart(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const key = weekStart.toISOString();

      if (!weeks.has(key)) {
        weeks.set(key, {
          weekStart,
          weekEnd,
          scheduleItems: [],
          assignments: [],
          hackathons: [],
          electives: [],
        });
      }

      weeks.get(key)!.scheduleItems.push(item);
    });

    // Добавляем задания
    assignments.forEach(assignment => {
      const date = new Date(assignment.deadline);
      const weekStart = getWeekStart(date);
      const key = weekStart.toISOString();

      if (!weeks.has(key)) {
        weeks.set(key, {
          weekStart,
          weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
          scheduleItems: [],
          assignments: [],
          hackathons: [],
          electives: [],
        });
      }

      weeks.get(key)!.assignments.push(assignment);
    });

    // Добавляем хакатоны
    hackathons.forEach(hackathon => {
      const date = new Date(hackathon.startDate);
      const weekStart = getWeekStart(date);
      const key = weekStart.toISOString();

      if (!weeks.has(key)) {
        weeks.set(key, {
          weekStart,
          weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
          scheduleItems: [],
          assignments: [],
          hackathons: [],
          electives: [],
        });
      }

      weeks.get(key)!.hackathons.push(hackathon);
    });

    // Добавляем факультативы (по дате начала)
    electives.forEach(elective => {
      if (!elective.startDate) return;
      const date = new Date(elective.startDate);
      const weekStart = getWeekStart(date);
      const key = weekStart.toISOString();

      if (!weeks.has(key)) {
        weeks.set(key, {
          weekStart,
          weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000),
          scheduleItems: [],
          assignments: [],
          hackathons: [],
          electives: [],
        });
      }

      weeks.get(key)!.electives.push(elective);
    });

    return Array.from(weeks.values())
      .sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());
  };

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filteredWeeks = useMemo(() => {
    const now = new Date();
    let weeks = groupByWeek(schedule, assignments, hackathons, enrolledElectives);

    // Фильтр по типу
    if (filterType === 'assignments') {
      weeks = weeks.filter(w => w.assignments.length > 0);
    } else if (filterType === 'hackathons') {
      weeks = weeks.filter(w => w.hackathons.length > 0);
    } else if (filterType === 'schedule') {
      weeks = weeks.filter(w => w.scheduleItems.length > 0);
    } else if (filterType === 'electives') {
      weeks = weeks.filter(w => w.electives.length > 0);
    }

    // Фильтр по времени
    if (!showPast && !showFuture) {
      return [];
    }

    if (!showPast) {
      weeks = weeks.filter(w => w.weekEnd >= now);
    }

    if (!showFuture) {
      weeks = weeks.filter(w => w.weekStart <= now);
    }

    return weeks;
  }, [schedule, assignments, hackathons, filterType, showPast, showFuture]);

  const toggleWeek = (weekStart: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekStart)) {
      newExpanded.delete(weekStart);
    } else {
      newExpanded.add(weekStart);
    }
    setExpandedWeeks(newExpanded);
  };

  const expandAll = () => {
    setExpandedWeeks(new Set(filteredWeeks.map(w => w.weekStart.toISOString())));
  };

  const collapseAll = () => {
    setExpandedWeeks(new Set());
  };

  const getTypeInfo = (type: string) => {
    const types: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      lecture: { 
        label: 'Лекция', 
        color: 'bg-blue-600',
        icon: <BookOpen className="h-3 w-3" />
      },
      practice: { 
        label: 'Практика', 
        color: 'bg-green-600',
        icon: <FileText className="h-3 w-3" />
      },
      test: { 
        label: 'Тест/Дедлайн', 
        color: 'bg-red-600',
        icon: <Clock className="h-3 w-3" />
      },
      hackathon: { 
        label: 'Хакатон', 
        color: 'bg-purple-600',
        icon: <Trophy className="h-3 w-3" />
      },
    };
    return types[type] || { label: type, color: 'bg-gray-600', icon: null };
  };

  const isPast = (dateString: string) => new Date(dateString) < new Date();
  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

  const formatWeekRange = (week: WeekGroup) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = week.weekStart.toLocaleDateString('ru-RU', options);
    const endStr = week.weekEnd.toLocaleDateString('ru-RU', options);
    return `${startStr} - ${endStr}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gh-fg">Загрузка расписания...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gh-canvas flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gh-fg mb-4">Доступ запрещён</h1>
          <p className="text-gh-fg mb-6">Пожалуйста, войдите в систему, чтобы просмотреть расписание.</p>
          <Button variant="primary" onClick={() => window.location.href = '/auth'}>
            Войти
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gh-fg mb-2">📅 Расписание</h1>
              <p className="text-gray-400">Занятия, задания и хакатоны для ваших групп</p>
            </div>
            <Link href="/dashboard">
              <Button variant="secondary">
                ← Дашборд
              </Button>
            </Link>
          </div>

          {/* Вкладки */}
          <div className="flex gap-2 mb-4 border-b border-gray-700 pb-3">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Расписание
            </button>
            <button
              onClick={() => setActiveTab('peer_review')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'peer_review'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Star className="h-4 w-4" />
              Peer Review
              {toReview.filter(r => !r.isCompleted).length > 0 && (
                <span className="ml-1 bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {toReview.filter(r => !r.isCompleted).length}
                </span>
              )}
            </button>
          </div>

          {/* Фильтры (только для расписания) */}
          {activeTab === 'schedule' && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filterType === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Все
            </Button>
            <Button
              variant={filterType === 'schedule' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('schedule')}
            >
              📚 Занятия
            </Button>
            <Button
              variant={filterType === 'assignments' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('assignments')}
            >
              📝 Задания
            </Button>
            <Button
              variant={filterType === 'hackathons' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('hackathons')}
            >
              🏆 Хакатоны
            </Button>
            <Button
              variant={filterType === 'electives' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilterType('electives')}
            >
              🎓 Факультативы
            </Button>
          </div>
          )}

          {/* Переключатели времени (только для расписания) */}
          {activeTab === 'schedule' && <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showPast}
                onChange={(e) => setShowPast(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800"
              />
              Прошедшие
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showFuture}
                onChange={(e) => setShowFuture(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800"
              />
              Будущие
            </label>
            <div className="flex gap-2 ml-auto">
              <Button variant="secondary" size="sm" onClick={expandAll}>
                Развернуть все
              </Button>
              <Button variant="secondary" size="sm" onClick={collapseAll}>
                Свернуть все
              </Button>
            </div>
          </div>}

          {/* Информация о группах */}
          {activeTab === 'schedule' && userGroupIds.length > 0 && (
            <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-400">
                📚 Показаны данные для {userGroupIds.length} группы(п)
              </p>
            </div>
          )}
        </div>

        {/* Peer Review вкладка */}
        {activeTab === 'peer_review' && (
          <PeerReviewTab
            toReview={toReview}
            received={received}
            isLoadingToReview={isLoadingToReview}
            isLoadingReceived={isLoadingReceived}
          />
        )}

        {/* Дерево расписания */}
        {activeTab === 'schedule' && <div className="space-y-4">
          {filteredWeeks.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Нет данных для отображения</p>
              {userGroupIds.length === 0 && (
                <p className="text-sm text-yellow-500 mt-2">
                  ⚠️ Вы не записаны ни в одну группу
                </p>
              )}
            </Card>
          ) : (
            filteredWeeks.map((week) => {
              const isExpanded = expandedWeeks.has(week.weekStart.toISOString());
              const weekIsToday = isToday(week.weekStart) || isToday(week.weekEnd);
              const totalItems = week.scheduleItems.length + week.assignments.length + week.hackathons.length + week.electives.length;

              return (
                <Card key={week.weekStart.toISOString()} className={`border ${weekIsToday ? 'border-blue-500' : 'border-gray-700'}`}>
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={() => toggleWeek(week.weekStart.toISOString())}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gh-fg">
                          Неделя {formatWeekRange(week)}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {totalItems} событий
                        </p>
                      </div>
                    </div>
                    {weekIsToday && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                        Эта неделя
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-700">
                      {/* Занятия */}
                      {week.scheduleItems.length > 0 && (
                        <div className="p-4 space-y-3">
                          <h4 className="text-sm font-semibold text-gray-400 uppercase">Занятия</h4>
                          {week.scheduleItems
                            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                            .map((item) => {
                              const typeInfo = getTypeInfo(item.type);
                              const past = isPast(item.startTime);

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
                                          <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                                            Завершено
                                          </span>
                                        )}
                                        {!past && isToday(new Date(item.startTime)) && (
                                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full animate-pulse">
                                            Сегодня
                                          </span>
                                        )}
                                      </div>

                                      <h4 className="text-lg font-semibold text-gh-fg mb-2">
                                        {item.title}
                                      </h4>

                                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>{formatDateTime(item.startTime).date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          <span>{formatDateTime(item.startTime).time}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-4 w-4" />
                                          <span>{item.location}</span>
                                        </div>
                                        {item.instructor && (
                                          <div className="flex items-center gap-1">
                                            <Video className="h-4 w-4" />
                                            <span>{item.instructor.firstName} {item.instructor.lastName}</span>
                                          </div>
                                        )}
                                      </div>

                                      {item.courseGroup && (
                                        <p className="text-xs text-gray-500 mt-2">
                                          📚 {item.courseGroup.name}
                                          {item.courseGroup.course && ` • ${item.courseGroup.course.name}`}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                        </div>
                      )}

                      {/* Задания */}
                      {week.assignments.length > 0 && (
                        <div className="p-4 space-y-3 bg-red-900/10">
                          <h4 className="text-sm font-semibold text-red-400 uppercase">📝 Задания (дедлайны)</h4>
                          {week.assignments
                            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                            .map((assignment) => {
                              const past = isPast(assignment.deadline);
                              const { date, time } = formatDateTime(assignment.deadline);

                              return (
                                <Link
                                  key={assignment.id}
                                  href={`/assignments/${assignment.id}`}
                                  className={`block p-4 rounded-lg border-l-4 transition-colors ${
                                    past 
                                      ? 'bg-red-900/20 border-l-gray-600' 
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
                                          <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                                            Просрочено
                                          </span>
                                        )}
                                        {!past && isToday(new Date(assignment.deadline)) && (
                                          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
                                            Сегодня!
                                          </span>
                                        )}
                                      </div>

                                      <h4 className="text-lg font-semibold text-gh-fg mb-2">
                                        {assignment.title}
                                      </h4>

                                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>{date}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          <span>{time}</span>
                                        </div>
                                      </div>

                                      {assignment.courseGroup && (
                                        <p className="text-xs text-gray-500 mt-2">
                                          📚 {assignment.courseGroup.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                        </div>
                      )}

                      {/* Хакатоны */}
                      {week.hackathons.length > 0 && (
                        <div className="p-4 space-y-3 bg-purple-900/10">
                          <h4 className="text-sm font-semibold text-purple-400 uppercase">🏆 Хакатоны</h4>
                          {week.hackathons.map((hackathon) => {
                            const { date: startDate } = formatDateTime(hackathon.startDate);
                            const { date: endDate } = formatDateTime(hackathon.endDate);

                            return (
                              <Link
                                key={hackathon.id}
                                href={`/hackathons/${hackathon.id}`}
                                className="block p-4 rounded-lg border-l-4 border-l-purple-500 bg-purple-900/20 hover:bg-purple-900/30 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center gap-1">
                                        <Trophy className="h-3 w-3" />
                                        Хакатон
                                      </span>
                                    </div>

                                    <h4 className="text-lg font-semibold text-gh-fg mb-2">
                                      {hackathon.title}
                                    </h4>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{startDate} - {endDate}</span>
                                      </div>
                                    </div>

                                    {hackathon.registrationDeadline && (
                                      <p className="text-xs text-yellow-500 mt-2">
                                        ⏰ Регистрация до: {formatDateTime(hackathon.registrationDeadline).date}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}

                      {/* Факультативы */}
                      {week.electives.length > 0 && (
                        <div className="p-4 space-y-3 bg-teal-900/10">
                          <h4 className="text-sm font-semibold text-teal-400 uppercase">🎓 Факультативы</h4>
                          {week.electives.map((elective) => {
                            const startDateStr = elective.startDate ? formatDateTime(elective.startDate).date : null;
                            const endDateStr = elective.endDate ? formatDateTime(elective.endDate).date : null;

                            return (
                              <Link
                                key={elective.id}
                                href={`/electives/${elective.id}`}
                                className="block p-4 rounded-lg border-l-4 border-l-teal-500 bg-teal-900/20 hover:bg-teal-900/30 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="px-2 py-1 bg-teal-600 text-white text-xs rounded-full flex items-center gap-1">
                                        <BookOpen className="h-3 w-3" />
                                        Факультатив
                                      </span>
                                    </div>

                                    <h4 className="text-lg font-semibold text-gh-fg mb-2">
                                      {elective.title}
                                    </h4>

                                    {(startDateStr || endDateStr) && (
                                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>
                                            {startDateStr}{endDateStr ? ` - ${endDateStr}` : ''}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {elective.courseGroupName && (
                                      <p className="text-xs text-gray-500 mt-2">
                                        📚 {elective.courseGroupName}
                                        {elective.courseName ? ` • ${elective.courseName}` : ''}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>}
      </div>
    </div>
  );
}

// ---- Peer Review Tab ----

function PeerReviewTab({
  toReview,
  received,
  isLoadingToReview,
  isLoadingReceived,
}: {
  toReview: any[];
  received: ReceivedReviewGroup[];
  isLoadingToReview: boolean;
  isLoadingReceived: boolean;
}) {
  const [section, setSection] = useState<'to_review' | 'received'>('to_review');
  const pending = toReview.filter(r => !r.isCompleted);
  const done = toReview.filter(r => r.isCompleted);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setSection('to_review')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            section === 'to_review' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Нужно проверить
          {pending.length > 0 && (
            <span className="ml-1.5 bg-white text-yellow-700 text-xs font-bold px-1.5 rounded-full">{pending.length}</span>
          )}
        </button>
        <button
          onClick={() => setSection('received')}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            section === 'received' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Мои оценки
        </button>
      </div>

      {section === 'to_review' && (
        <div className="space-y-3">
          {isLoadingToReview ? (
            <Card className="p-6 text-center text-gray-400">Загрузка...</Card>
          ) : pending.length === 0 && done.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-500" />
              <p className="text-gh-fg">Нет работ для проверки</p>
            </Card>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wide">Ожидают проверки</p>
                  {pending.map(r => (
                    <Link key={r.reviewId ?? r.id} href="/peer-review">
                      <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg hover:bg-yellow-900/30 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gh-fg font-medium">{r.assignmentTitle}</p>
                            <p className="text-sm text-gray-400 mt-0.5">Студент: {r.studentName}</p>
                          </div>
                          <span className="text-yellow-400 text-sm flex items-center gap-1">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Проверить
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {done.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Проверено</p>
                  {done.map(r => (
                    <div key={r.reviewId ?? r.id} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gh-fg font-medium">{r.assignmentTitle}</p>
                          <p className="text-sm text-gray-400 mt-0.5">Студент: {r.studentName}</p>
                        </div>
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          {r.score !== undefined && r.score !== null ? `${r.score} баллов` : 'Оценено'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {section === 'received' && (
        <div className="space-y-3">
          {isLoadingReceived ? (
            <Card className="p-6 text-center text-gray-400">Загрузка...</Card>
          ) : received.length === 0 ? (
            <Card className="p-8 text-center">
              <Star className="h-10 w-10 mx-auto mb-3 text-gray-600" />
              <p className="text-gh-fg">Никто ещё не проверил ваши работы</p>
              <p className="text-sm text-gray-400 mt-1">Оценки появятся здесь после проверки</p>
            </Card>
          ) : (
            received.map(group => (
              <Card key={group.submissionId} className="overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gh-fg font-semibold">{group.assignmentTitle ?? `Задание #${group.assignmentId}`}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Проверок: {group.completedReviews} из {group.totalReviews}
                      </p>
                    </div>
                    {group.finalScore !== null && group.finalScore !== undefined ? (
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Итоговая оценка</p>
                        <p className="text-2xl font-bold text-gh-fg">{group.finalScore}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Ожидается...</span>
                    )}
                  </div>
                </div>
                {group.reviews.length > 0 && (
                  <div className="divide-y divide-gray-800">
                    {group.reviews.map((review, idx) => (
                      <div key={review.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Рецензент #{idx + 1}</span>
                          {review.score !== null && (
                            <span className="text-gh-fg font-bold text-sm">{review.score} баллов</span>
                          )}
                        </div>
                        {review.criteriaScores && review.criteriaScores.length > 0 && (
                          <div className="space-y-1 mb-2">
                            {review.criteriaScores.map(cs => (
                              <div key={cs.name} className="flex items-center justify-between text-xs">
                                <span className="text-gray-400">{cs.name}:</span>
                                <span className="text-gray-300">{cs.score} / {cs.maxScore}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {review.feedback && (
                          <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{review.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
