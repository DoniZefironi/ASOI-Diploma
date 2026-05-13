// features/groups/GroupDetailPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { apiClient } from '@/shared/api/client';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, TrendingUp, Award, FileText, Clock } from 'lucide-react';

interface CourseGroup {
  id: number;
  name: string;
  courseId: number;
  year: number;
  semester: number;
  isActive: boolean;
  maxStudents: number;
  startDate: string;
  endDate: string;
  course?: {
    id: number;
    name: string;
    type: string;
  };
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  averageScore?: number;
  completedAssignments?: number;
}

interface ScheduleItem {
  id: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
}

interface Assignment {
  id: number;
  title: string;
  type: string;
  maxScore: number;
  deadline: string;
  startDate: string;
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const groupId = parseInt(params?.id as string);

  const [group, setGroup] = useState<CourseGroup | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'schedule' | 'performance'>('students');

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      setIsLoading(true);
      const [groupData, studentsData, scheduleData, assignmentsData] = await Promise.all([
        apiClient.get(`/course-groups/${groupId}`),
        apiClient.get(`/course-groups/${groupId}/students`),
        apiClient.get(`/schedule/course-group/${groupId}`),
        apiClient.get(`/assignments/course-group/${groupId}`),
      ]);

      setGroup(groupData);
      setStudents(studentsData || []);
      setSchedule(scheduleData || []);
      setAssignments(assignmentsData || []);
    } catch (error) {
      console.error('Failed to load group data:', error);
      alert('Ошибка загрузки данных группы');
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gh-fg mb-4">Группа не найдена</h1>
            <Link href="/mentor/groups">
              <Button variant="secondary">← Назад к группам</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const avgGroupScore = students.length > 0
    ? students.reduce((sum, s) => sum + (s.averageScore || 0), 0) / students.length
    : 0;

  const avgCompletedAssignments = students.length > 0
    ? students.reduce((sum, s) => sum + (s.completedAssignments || 0), 0) / students.length
    : 0;

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        {/* Навигация */}
        <div className="mb-6">
          <Link href="/mentor/groups">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к группам
            </Button>
          </Link>
        </div>

        {/* Заголовок группы */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{group.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">📚 Курс</p>
                <p className="text-white font-semibold">{group.course?.name || 'Не указан'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">📅 Год</p>
                <p className="text-white font-semibold">{group.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">📊 Семестр</p>
                <p className="text-white font-semibold">{group.semester}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">👥 Студентов</p>
                <p className="text-white font-semibold">{students.length} / {group.maxStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Вкладки */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <Button
            variant={activeTab === 'students' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('students')}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Студенты ({students.length})
          </Button>
          <Button
            variant={activeTab === 'schedule' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('schedule')}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Расписание ({schedule.length})
          </Button>
          <Button
            variant={activeTab === 'performance' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('performance')}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Успеваемость
          </Button>
        </div>

        {/* Контент вкладок */}
        {activeTab === 'students' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Список студентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-gray-400 text-center py-8">В группе пока нет студентов</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400">ID</th>
                        <th className="text-left py-3 px-4 text-gray-400">ФИО</th>
                        <th className="text-left py-3 px-4 text-gray-400">Email</th>
                        <th className="text-center py-3 px-4 text-gray-400">Ср. балл</th>
                        <th className="text-center py-3 px-4 text-gray-400">Заданий выполнено</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4 text-white">{student.id}</td>
                          <td className="py-3 px-4 text-white">
                            {student.lastName} {student.firstName}
                          </td>
                          <td className="py-3 px-4 text-gray-400">{student.email}</td>
                          <td className="py-3 px-4 text-center">
                            {student.averageScore !== undefined ? (
                              <span className={`px-2 py-1 rounded text-sm font-semibold ${
                                student.averageScore >= 80 ? 'bg-green-600 text-white' :
                                student.averageScore >= 60 ? 'bg-blue-600 text-white' :
                                student.averageScore >= 40 ? 'bg-yellow-600 text-white' :
                                'bg-red-600 text-white'
                              }`}>
                                {Math.round(student.averageScore)}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-white">
                            {student.completedAssignments || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'schedule' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Расписание группы
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedule.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Расписание пустое</p>
              ) : (
                <div className="space-y-3">
                  {schedule
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((item) => {
                      const { date, time } = formatDateTime(item.startTime);
                      const endTime = formatDateTime(item.endTime).time;
                      
                      return (
                        <div key={item.id} className="p-4 bg-gray-800 rounded-lg border-l-4 border-l-blue-500">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gh-fg mb-2">{item.title}</h4>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{time} - {endTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="h-4 w-4" />
                                  <span className="capitalize">{item.type}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  <span>{item.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Общая статистика */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-400">Средний балл группы</p>
                      <p className="text-2xl font-bold text-gh-fg">{Math.round(avgGroupScore)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-400">Среднее выполнение</p>
                      <p className="text-2xl font-bold text-gh-fg">{Math.round(avgCompletedAssignments)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Award className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-400">Заданий всего</p>
                      <p className="text-2xl font-bold text-gh-fg">{assignments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Список заданий */}
            <Card>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Задания группы
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Заданий пока нет</p>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((assignment) => {
                      const { date: startDate } = formatDateTime(assignment.startDate);
                      const { date: deadlineDate, time } = formatDateTime(assignment.deadline);
                      
                      return (
                        <div key={assignment.id} className="p-4 bg-gray-800 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gh-fg mb-2">{assignment.title}</h4>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Начало: {startDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="h-4 w-4" />
                                  <span>Дедлайн: {deadlineDate} {time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>Макс. балл: {assignment.maxScore}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
