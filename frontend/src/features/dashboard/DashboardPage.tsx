// features/dashboard/DashboardPage.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { useUserSchedule, ScheduleItem } from '@/shared/api/admin/schedule';
import { useUserRegistrations, useGroupStudentsRating, StudentRating } from '@/shared/api/admin/course-groups';

type ScheduleItemType = 'lecture' | 'lab' | 'practice';

interface DayScheduleItem {
  id: number;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  classroom: string;
  type: ScheduleItemType;
}

interface GroupRating extends StudentRating {
  rank: number;
}

export const DashboardPage = () => {
  const { user } = useAuth();
  const { schedule: userSchedule, isLoading: isLoadingSchedule } = useUserSchedule();
  const { registrations, isLoading: isLoadingRegistrations } = useUserRegistrations();
  
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [groupRating, setGroupRating] = useState<GroupRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Получаем первую активную группу пользователя
  const userGroup = useMemo(() => {
    const approvedRegistrations = registrations?.filter(r => r.status === 'approved');
    return approvedRegistrations?.[0]?.courseGroup || null;
  }, [registrations]);

  // Загружаем рейтинг группы
  const { students: groupStudents, isLoading: isLoadingRating } = useGroupStudentsRating(
    userGroup?.id || 0
  );

  useEffect(() => {
    const loading = isLoadingSchedule || isLoadingRegistrations || isLoadingRating;
    setIsLoading(loading);
  }, [isLoadingSchedule, isLoadingRegistrations, isLoadingRating]);

  // Преобразуем расписание из API в формат для отображения
  const scheduleItems: DayScheduleItem[] = useMemo(() => {
    return userSchedule.map(item => {
      const startTime = new Date(item.startTime);
      const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      const day = dayNames[startTime.getDay()];
      
      // Определяем тип занятия
      let type: ScheduleItemType = 'practice';
      if (item.type.toLowerCase().includes('lecture')) type = 'lecture';
      else if (item.type.toLowerCase().includes('practice')) type = 'practice';
      else if (item.type.toLowerCase().includes('test') || item.type.toLowerCase().includes('lab')) type = 'lab';

      // Форматируем время
      const time = startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

      // Получаем преподавателя
      const teacher = item.instructor 
        ? `${item.instructor.firstName} ${item.instructor.lastName}`
        : 'Не указан';

      return {
        id: item.id,
        day,
        time,
        subject: item.title,
        teacher,
        classroom: item.location || 'Не указана',
        type,
      };
    });
  }, [userSchedule]);

  // Преобразуем студентов в рейтинг с рангами
  useEffect(() => {
    if (groupStudents && groupStudents.length > 0) {
      const sortedStudents = [...groupStudents].sort((a, b) => b.averageScore - a.averageScore);
      const rankedStudents = sortedStudents.map((student, index) => ({
        ...student,
        rank: index + 1,
      }));
      setGroupRating(rankedStudents);
    } else {
      setGroupRating([]);
    }
  }, [groupStudents]);

  // Установить текущий день недели
  useEffect(() => {
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const currentDay = dayNames[new Date().getDay()];
    setSelectedDay(currentDay);
  }, []);

  const getScheduleForDay = (day: string) => {
    return scheduleItems.filter(item => item.day === day);
  };

  const getScheduleDays = () => {
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days.filter(day => scheduleItems.some(item => item.day === day));
  };

  const getTypeIcon = (type: ScheduleItemType) => {
    switch (type) {
      case 'lecture': return '📖';
      case 'lab': return '🔬';
      case 'practice': return '✏️';
      default: return '📚';
    }
  };

  const getTypeLabel = (type: ScheduleItemType) => {
    switch (type) {
      case 'lecture': return 'Лекция';
      case 'lab': return 'Лабораторная';
      case 'practice': return 'Практика';
      default: return type;
    }
  };

  const getTypeColor = (type: ScheduleItemType) => {
    switch (type) {
      case 'lecture': return 'bg-blue-600';
      case 'lab': return 'bg-green-600';
      case 'practice': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: 'text-yellow-400' };
    if (rank === 2) return { icon: '🥈', color: 'text-gray-400' };
    if (rank === 3) return { icon: '🥉', color: 'text-amber-600' };
    return { icon: `#${rank}`, color: 'text-gray-500' };
  };

  const getUserRank = () => {
    if (!user) return null;
    return groupRating.find(r => 
      r.firstName.toLowerCase() === user.firstName?.toLowerCase() && 
      r.lastName.toLowerCase() === user.lastName?.toLowerCase()
    ) || null;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Доступ запрещён</h1>
          <p className="text-white mb-6">Пожалуйста, войдите в систему, чтобы просмотреть дашборд.</p>
          <Button variant="primary" onClick={() => window.location.href = '/auth'}>
            Войти
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const userRank = getUserRank();
  const scheduleDays = getScheduleDays();
  const currentDaySchedule = getScheduleForDay(selectedDay);

  // Подсчитываем активные курсы
  const activeCoursesCount = registrations?.filter(r => r.status === 'approved').length || 0;

  // Подсчитываем выполненные задания (из рейтинга)
  const completedAssignmentsCount = userRank?.completedAssignments || 0;

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Дашборд студента
          </h1>
          <p className="text-xl text-white">
            Расписание и рейтинг группы
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Расписание */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📅 Расписание занятий
              </h2>
            </div>

            {/* Выбор дня */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {scheduleDays.length > 0 ? (
                scheduleDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedDay === day
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Занятий в расписании нет</p>
              )}
            </div>

            {/* Список занятий на день */}
            {currentDaySchedule.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  {selectedDay ? `На ${selectedDay.toLowerCase()} занятий нет` : 'Выберите день'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDaySchedule.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-800 rounded-lg border-l-4 border-l-blue-500 hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getTypeColor(item.type)}`}>
                            {getTypeLabel(item.type)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {item.subject}
                        </h3>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>🕐 {item.time}</p>
                          <p>👨‍🏫 {item.teacher}</p>
                          <p>🚪 Аудитория {item.classroom}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/schedule">
                <Button variant="secondary" size="sm">
                  Показать полное расписание →
                </Button>
              </Link>
            </div>
          </Card>

          {/* Рейтинг группы */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🏆 Рейтинг группы
              </h2>
            </div>

            {!userGroup ? (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Вы не зачислены ни в одну группу
                </p>
                <Link href="/courses">
                  <Button variant="primary" className="mt-4">
                    Записаться на курс
                  </Button>
                </Link>
              </div>
            ) : groupRating.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Рейтинг группы пока пуст</p>
              </div>
            ) : (
              <>
                {/* Таблица рейтинга */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">#</th>
                        <th className="text-left py-3 px-2 text-gray-400 font-medium">Студент</th>
                        <th className="text-center py-3 px-2 text-gray-400 font-medium">Ср. балл</th>
                        <th className="text-center py-3 px-2 text-gray-400 font-medium">Задания</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupRating.map((student) => {
                        const rankBadge = getRankBadge(student.rank);
                        const isCurrentUser = userRank && student.id === userRank.id;
                        
                        return (
                          <tr
                            key={student.id}
                            className={`border-b border-gray-800 hover:bg-gray-800 transition-colors ${
                              isCurrentUser ? 'bg-blue-900/20' : ''
                            }`}
                          >
                            <td className="py-3 px-2">
                              <span className={`text-lg font-bold ${rankBadge.color}`}>
                                {rankBadge.icon}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <span className={`text-white ${isCurrentUser ? 'font-semibold text-blue-400' : ''}`}>
                                {student.lastName} {student.firstName}
                                {isCurrentUser && <span className="ml-2 text-xs text-blue-400">(Вы)</span>}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                                student.averageScore >= 4.5
                                  ? 'bg-green-600 text-white'
                                  : student.averageScore >= 4.0
                                  ? 'bg-blue-600 text-white'
                                  : student.averageScore >= 3.5
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}>
                                {student.averageScore.toFixed(1)}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="text-gray-400">{student.completedAssignments}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Информация о текущем пользователе */}
                {userRank && (
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Ваша позиция в рейтинге</p>
                        <p className="text-2xl font-bold text-white">
                          {getRankBadge(userRank.rank).icon} {userRank.rank} место
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Средний балл</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {userRank.averageScore.toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Дополнительные виджеты */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📚</span>
              <div>
                <p className="text-blue-100 text-sm">Активных курсов</p>
                <p className="text-3xl font-bold text-white">{activeCoursesCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-600 to-green-800">
            <div className="flex items-center gap-4">
              <span className="text-4xl">✅</span>
              <div>
                <p className="text-green-100 text-sm">Выполнено заданий</p>
                <p className="text-3xl font-bold text-white">{completedAssignmentsCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-800">
            <div className="flex items-center gap-4">
              <span className="text-4xl">📈</span>
              <div>
                <p className="text-purple-100 text-sm">Общий рейтинг</p>
                <p className="text-3xl font-bold text-white">{userRank?.averageScore.toFixed(1) || '0.0'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Ссылка на факультативы */}
        <div className="mt-6">
          <Link href="/electives">
            <Card className="p-5 bg-gradient-to-br from-teal-700 to-teal-900 hover:from-teal-600 hover:to-teal-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">🎓</span>
                  <div>
                    <p className="text-teal-100 text-sm">Дополнительные занятия</p>
                    <p className="text-xl font-bold text-white">Факультативы</p>
                  </div>
                </div>
                <span className="text-teal-300 text-2xl">→</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};
