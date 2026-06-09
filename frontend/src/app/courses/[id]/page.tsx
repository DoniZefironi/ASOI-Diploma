'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { useAuth } from '@/shared/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { TechVocabulary } from '@/features/english/TechVocabulary';

interface Course {
  id: number;
  name: string;
  type: string;
  description: string;
  duration: number;
  imageUrl: string;
  isActive: boolean;
}

interface CourseGroup {
  id: number;
  name: string;
  year: number;
  semester: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  courseId: number;
  course?: Course;
  registrations?: CourseRegistration[];
  scheduleItems?: ScheduleItem[];
}

interface CourseRegistration {
  id: number;
  userId: number;
  status: 'pending' | 'approved' | 'rejected';
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  dateTime: string;
  type: 'lecture' | 'practice' | 'lab' | 'test';
  courseGroupId: number;
}

interface StudentRating {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  averageScore: number;
  completedAssignments: number;
}

export default function CoursePage() {
  const params = useParams();
  const { user } = useAuth();
  const courseId = parseInt(params?.id as string);

  const [course, setCourse] = useState<Course | null>(null);
  const [groups, setGroups] = useState<CourseGroup[]>([]);
  const [userGroup, setUserGroup] = useState<CourseGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'vocab'>('overview');

  useEffect(() => {
    loadData();
  }, [courseId]);

  const loadData = async () => {
    try {
      const [courseData, groupsData] = await Promise.all([
        apiClient.get(`/courses/${courseId}`),
        apiClient.get(`/course-groups/course/${courseId}`),
      ]);

      setCourse(courseData);
      setGroups(groupsData || []);

      // Найти группу пользователя
      if (user) {
        const userRegistrations = await apiClient.get(`/course-groups/user/registrations`);
        const approvedRegs = userRegistrations?.filter((r: any) => r.status === 'approved') || [];

        for (const group of groupsData || []) {
          const hasRegistration = approvedRegs.some(
            (reg: any) => reg.courseGroupId === group.id
          );
          if (hasRegistration) {
            // Загрузить полную информацию о группе
            const fullGroup = await apiClient.get(`/course-groups/${group.id}`);
            setUserGroup(fullGroup);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (groupId: number) => {
    setIsRegistering(true);
    try {
      await apiClient.post('/course-groups/register', { courseGroupId: groupId });
      alert('Вы успешно записались на курс!');
      loadData();
    } catch (error: any) {
      alert(error.message || 'Не удалось записаться на курс');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Курс не найден</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <Link href="/courses" className="text-blue-400 hover:text-blue-300">
            ← Назад к курсам
          </Link>
          {course?.type === 'english' && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                📋 Курс
              </button>
              <button
                onClick={() => setActiveTab('vocab')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'vocab' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                📖 Tech Vocabulary
              </button>
            </div>
          )}
        </div>

        {/* Вкладка словаря для английских курсов */}
        {course?.type === 'english' && activeTab === 'vocab' && (
          <TechVocabulary />
        )}

        {(course?.type !== 'english' || activeTab === 'overview') && (
        <>

        {/* Информация о курсе */}
        <div className="bg-gh-canvas-overlay rounded-xl p-8 border border-gray-700 mb-8">
          <h1 className="text-3xl font-bold text-gh-fg mb-4">{course.name}</h1>
          <p className="text-gray-300 text-lg mb-6">{course.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gh-canvas rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">📚 Тип</div>
              <div className="text-white font-semibold capitalize">{course.type}</div>
            </div>
            <div className="bg-gh-canvas rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">⏱️ Длительность</div>
              <div className="text-white font-semibold">{course.duration} недель</div>
            </div>
            <div className="bg-gh-canvas rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">📊 Статус</div>
              <div className={`font-semibold ${course.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                {course.isActive ? 'Активен' : 'Неактивен'}
              </div>
            </div>
            <div className="bg-gh-canvas rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">👥 Групп</div>
              <div className="text-white font-semibold">{groups.length}</div>
            </div>
          </div>
        </div>

        {/* Группа пользователя */}
        {userGroup && (
          <div className="bg-gh-canvas-overlay rounded-xl p-8 border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gh-fg">📖 Моя группа</h2>
              <span className="px-4 py-2 bg-green-600 text-white text-sm rounded-full">
                Вы записаны
              </span>
            </div>

            <div className="mb-6">
              <div className="text-xl font-semibold text-gh-fg mb-2">{userGroup.name}</div>
              <div className="text-gray-400 text-sm">
                {new Date(userGroup.startDate).toLocaleDateString('ru-RU')} - {new Date(userGroup.endDate).toLocaleDateString('ru-RU')}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Рейтинг студентов */}
              <div>
                <h3 className="text-lg font-semibold text-gh-fg mb-4">🏆 Рейтинг группы</h3>
                <StudentRatingList groupId={userGroup.id} />
              </div>

              {/* Расписание */}
              <div>
                <h3 className="text-lg font-semibold text-gh-fg mb-4">📅 Расписание</h3>
                <ScheduleList groupId={userGroup.id} />
              </div>
            </div>
          </div>
        )}

        {/* Доступные группы для записи */}
        <div className="bg-gh-canvas-overlay rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-gh-fg mb-6">📋 Доступные группы</h2>
          
          {groups.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Групп пока нет</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((group) => {
                const isUserInGroup = userGroup?.id === group.id;
                const availableSpots = group.maxStudents - (group.registrations?.filter(r => r.status === 'approved').length || 0);

                return (
                  <div key={group.id} className="bg-gh-canvas rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gh-fg">{group.name}</h3>
                        <div className="text-sm text-gray-400 mt-1">
                          {group.year} год, {group.semester} семестр
                        </div>
                      </div>
                      {isUserInGroup ? (
                        <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                          Вы здесь
                        </span>
                      ) : availableSpots === 0 ? (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full">
                          Нет мест
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                          {availableSpots} мест
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-500 mb-4">
                      <div>📅 {new Date(group.startDate).toLocaleDateString('ru-RU')} - {new Date(group.endDate).toLocaleDateString('ru-RU')}</div>
                    </div>

                    {isUserInGroup ? (
                      <Link href={`/courses/${courseId}/group/${group.id}`}>
                        <Button variant="secondary" className="w-full">
                          Перейти к группе
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleRegister(group.id)}
                        disabled={isRegistering || availableSpots === 0}
                      >
                        {isRegistering ? 'Запись...' : 'Записаться'}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}

// Компонент рейтинга студентов
function StudentRatingList({ groupId }: { groupId: number }) {
  const [students, setStudents] = useState<StudentRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/course-groups/${groupId}/students/rating`)
      .then(data => setStudents(data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [groupId]);

  if (isLoading) {
    return <div className="text-gray-400 text-sm">Загрузка...</div>;
  }

  if (students.length === 0) {
    return <div className="text-gray-400 text-sm">Нет данных</div>;
  }

  return (
    <div className="space-y-2">
      {students.slice(0, 5).map((student, index) => (
        <div key={student.id} className="flex justify-between items-center p-3 bg-gh-canvas rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-400 w-6">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
            </span>
            <span className="text-white">{student.firstName} {student.lastName}</span>
          </div>
          <div className="text-green-400 font-semibold">{student.averageScore?.toFixed(1) || 0}</div>
        </div>
      ))}
    </div>
  );
}

// Компонент расписания
function ScheduleList({ groupId }: { groupId: number }) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/schedule/course-group/${groupId}`)
      .then(data => setSchedule(data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [groupId]);

  if (isLoading) {
    return <div className="text-gray-400 text-sm">Загрузка...</div>;
  }

  if (schedule.length === 0) {
    return <div className="text-gray-400 text-sm">Нет занятий</div>;
  }

  return (
    <div className="space-y-2">
      {schedule.slice(0, 5).map((item) => (
        <Link
          key={item.id}
          href={`/schedule/${item.id}`}
          className="block p-3 bg-gh-canvas rounded-lg hover:bg-white-800 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-white font-medium">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(item.dateTime).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded ${
              item.type === 'lecture' ? 'bg-blue-600 text-white' :
              item.type === 'practice' ? 'bg-green-600 text-white' :
              item.type === 'lab' ? 'bg-purple-600 text-white' :
              'bg-yellow-600 text-white'
            }`}>
              {item.type === 'lecture' ? 'Лекция' :
               item.type === 'practice' ? 'Практика' :
               item.type === 'lab' ? 'Лабораторная' : 'Тест'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
