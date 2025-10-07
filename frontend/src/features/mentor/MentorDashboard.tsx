// components/mentor/MentorDashboard.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyGroups } from '@/lib/api/mentor';
import { Users2, FileText, Calendar, BarChart3, Loader2 } from 'lucide-react';

export default function MentorDashboard() {
  const { groups, isLoading, isError } = useMyGroups();
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Ошибка загрузки данных
          </div>
        </CardContent>
      </Card>
    );
  }

  // Статистика
  const stats = {
    totalGroups: groups?.length || 0,
    totalStudents: groups?.reduce((acc: number, group: any) => {
      return acc + (group.registrations?.filter((r: any) => r.status === 'approved').length || 0);
    }, 0) || 0,
    activeAssignments: 0, // Можно добавить API для этого
    upcomingClasses: 0, // Можно добавить API для этого
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Панель ментора</h1>
        <p className="text-muted-foreground">
          Обзор ваших групп и активности студентов
        </p>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Мои группы"
          value={stats.totalGroups}
          description="Всего групп"
          icon={Users2}
        />
        <StatCard
          title="Студенты"
          value={stats.totalStudents}
          description="Всего студентов"
          icon={Users2}
        />
        <StatCard
          title="Активные задания"
          value={stats.activeAssignments}
          description="Требуют проверки"
          icon={FileText}
        />
        <StatCard
          title="Ближайшие занятия"
          value={stats.upcomingClasses}
          description="На этой неделе"
          icon={Calendar}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Мои группы */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              Мои группы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groups?.map((group: any) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {group.course?.name} • {group.registrations?.filter((r: any) => r.status === 'approved').length} студентов
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedGroup(group)}
                >
                  Подробнее
                </Button>
              </div>
            ))}

            {(!groups || groups.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Users2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>У вас пока нет групп</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Быстрые действия */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Быстрые действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              href="/mentor/assignments"
              title="Создать задание"
              description="Добавить новое задание для студентов"
              icon={FileText}
            />
            <QuickAction
              href="/mentor/schedule"
              title="Расписание"
              description="Посмотреть и управлять расписанием"
              icon={Calendar}
            />
            <QuickAction
              href="/mentor/grades"
              title="Оценки"
              description="Просмотр и управление оценками"
              icon={BarChart3}
            />
            <QuickAction
              href="/mentor/analytics"
              title="Аналитика"
              description="Статистика успеваемости"
              icon={BarChart3}
            />
          </CardContent>
        </Card>
      </div>

      {/* Последняя активность */}
      <Card>
        <CardHeader>
          <CardTitle>Последние отправленные работы</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentSubmissions />
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, description, icon: Icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickAction({ href, title, description, icon: Icon }: any) {
  return (
    <a
      href={href}
      className="flex items-center space-x-4 p-3 rounded-lg border transition-colors hover:bg-accent"
    >
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
    </a>
  );
}

function RecentSubmissions() {
  const submissions = [
    { student: 'Иван Петров', assignment: 'Функции в JavaScript', score: 85, time: '2 часа назад' },
    { student: 'Ольга Сидорова', assignment: 'Работа с массивами', score: 92, time: '5 часов назад' },
    { student: 'Алексей Иванов', assignment: 'Основы ООП', score: 78, time: '1 день назад' },
  ];

  return (
    <div className="space-y-4">
      {submissions.map((submission, index) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex-1">
            <p className="font-medium">{submission.student}</p>
            <p className="text-sm text-muted-foreground">{submission.assignment}</p>
            <p className="text-xs text-muted-foreground">{submission.time}</p>
          </div>
          <Badge variant={submission.score >= 80 ? "default" : "secondary"}>
            {submission.score}%
          </Badge>
        </div>
      ))}
    </div>
  );
}