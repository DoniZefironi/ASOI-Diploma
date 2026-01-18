'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useUsers } from '@/shared/api/admin';
import { useCourses } from '@/shared/api/admin';
import { useCourseGroups } from '@/shared/api/admin';

export default function AdminDashboard() {
  const { users, isLoading: usersLoading } = useUsers();
  const { courses, isLoading: coursesLoading } = useCourses();
  const { groups, isLoading: groupsLoading } = useCourseGroups();

  if (usersLoading || coursesLoading || groupsLoading) {
    return <div>Загрузка...</div>;
  }

  const stats = {
    totalUsers: users?.length || 0,
    totalCourses: courses?.length || 0,
    totalGroups: groups?.length || 0,
    pendingRegistrations: groups?.reduce((acc: number, group: any) => {
      return acc + (group.registrations?.filter((r: any) => r.status === 'pending').length || 0);
    }, 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
        <p className="text-muted-foreground">
          Обзор системы и ключевые метрики
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Пользователи"
          value={stats.totalUsers}
          description="Всего зарегистрировано"
          icon="👥"
        />
        <StatCard
          title="Курсы"
          value={stats.totalCourses}
          description="Активные курсы"
          icon="📚"
        />
        <StatCard
          title="Группы"
          value={stats.totalGroups}
          description="Учебные группы"
          icon="👨‍🏫"
        />
        <StatCard
          title="Ожидают одобрения"
          value={stats.pendingRegistrations}
          description="Заявки на курсы"
          icon="⏳"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}

function StatCard({ title, value, description, icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const activities = [
    { action: 'Создан новый курс', user: 'Администратор', time: '2 минуты назад' },
    { action: 'Одобрена заявка', user: 'Иван Петров', time: '5 минут назад' },
    { action: 'Добавлено задание', user: 'Ментор', time: '10 минут назад' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последняя активность</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-xs text-muted-foreground">
                {activity.user} • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    { href: '/admin/courses', label: 'Создать курс', description: 'Добавить новый учебный курс' },
    { href: '/admin/users', label: 'Управление пользователями', description: 'Назначение ролей' },
    { href: '/admin/groups', label: 'Создать группу', description: 'Новая учебная группа' },
    { href: '/admin/schedule', label: 'Расписание', description: 'Добавить занятие' },
    { href: '/admin/course-registrations', label: 'Новый студент?', description: 'Новая заявка в группу' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Быстрые действия</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="flex flex-col p-3 rounded-lg border transition-colors hover:bg-accent"
          >
            <span className="font-medium">{action.label}</span>
            <span className="text-sm text-muted-foreground">{action.description}</span>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}