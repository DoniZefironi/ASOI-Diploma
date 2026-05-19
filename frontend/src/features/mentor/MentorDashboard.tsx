'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { useMentorData } from '@/features/mentor/useMentorData';

export default function MentorDashboard() {
  const { user, isLoading } = useAuth();
  const { groups, courses, isLoading: isLoadingData, mentorCourseType } = useMentorData();

  useEffect(() => {
    if (!isLoading && user) {
      const isMentor = hasMentorRole(user.roles);
      const isAdmin = hasAdminRole(user.roles);

      if (!isMentor && !isAdmin) {
        window.location.href = '/profile';
      }
    }
  }, [user, isLoading]);

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gh-canvas flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  const isMentor = hasMentorRole(user?.roles || []);
  const isAdmin = hasAdminRole(user?.roles || []);

  if (!isMentor && !isAdmin) {
    return null;
  }

  // Отображение типа курса для ментора
  const courseTypeLabels: Record<string, string> = {
    'english': 'Английский язык',
    'electronics': 'Электроника',
    'computer_science': 'Информатика',
    'iot': 'IoT (Интернет вещей)',
  };

  const stats = {
    totalGroups: groups.length,
    totalStudents: groups.reduce((acc: number, group: any) => {
      return acc + (group.registrations?.filter((r: any) => r.status === 'approved').length || 0);
    }, 0),
    totalCourses: courses.length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gh-fg">Панель ментора</h1>
        {mentorCourseType && (
          <p className="text-gray-400 mt-1">
            Направление: <span className="text-blue-400 font-semibold">{courseTypeLabels[mentorCourseType]}</span>
          </p>
        )}
        <p className="text-gray-400">
          Управление учебными группами и материалами
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Мои курсы"
          value={stats.totalCourses}
          description="Курсы для преподавания"
          icon="📚"
        />
        <StatCard
          title="Мои группы"
          value={stats.totalGroups}
          description="Учебные группы"
          icon="👨‍🏫"
        />
        <StatCard
          title="Студенты"
          value={stats.totalStudents}
          description="Во всех группах"
          icon="👨‍🎓"
        />
      </div>

      {/* Быстрые действия */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="📚 Мои группы"
          description="Управление учебными группами"
          href="/mentor/groups"
        />
        <QuickActionCard
          title="📅 Расписание"
          description="Управление расписанием занятий"
          href="/mentor/schedule"
        />
        <QuickActionCard
          title="📝 Задания"
          description="Создание и проверка заданий"
          href="/mentor/assignments"
        />
        <QuickActionCard
          title="📖 Материалы"
          description="Библиотека учебных материалов"
          href="/mentor/materials"
        />
        <QuickActionCard
          title="🏆 Хакатоны"
          description="Управление хакатонами"
          href="/mentor/hackathons"
        />
        <QuickActionCard
          title="🎓 Факультативы"
          description="Управление факультативными курсами"
          href="/mentor/electives"
        />
        <QuickActionCard
          title="💬 Форум"
          description="Модерация форума студентов"
          href="/mentor/forum"
        />
        <QuickActionCard
          title="📗 Словарь"
          description="IT-термины для студентов"
          href="/mentor/vocabulary"
        />
        <QuickActionCard
          title="🏅 Олимпиады"
          description="Соревнования по программированию"
          href="/mentor/olympiads"
        />
      </div>

      {/* Мои курсы */}
      {courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Мои курсы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-white font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-400">{course.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Мои группы */}
      {groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Мои учебные группы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groups.slice(0, 5).map((group) => (
                <div key={group.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">{group.name}</h3>
                    <p className="text-sm text-gray-400">
                      {group.course?.name} • {group.year} год, {group.semester} семестр
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white">
                      {group.registrations?.filter((r: any) => r.status === 'approved').length || 0} студентов
                    </p>
                    <p className="text-sm text-gray-400">
                      {group.registrations?.filter((r: any) => r.status === 'pending').length || 0} ожидают
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {groups.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">У вас пока нет учебных групп</p>
            <p className="text-sm text-gray-500 mt-2">Обратитесь к администратору для назначения групп</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ title, value, description, icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gh-fg">{value}</div>
        <p className="text-xs text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ title, description, href }: any) {
  return (
    <Card className="hover:bg-gray-800 transition-colors cursor-pointer">
      <Link href={href}>
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">{description}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
