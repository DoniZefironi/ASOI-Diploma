// src/features/profile/ProfilePage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { MyCoursesModal } from './components/MyCoursesModal';
import { useInformaticsCourseRegistration } from '@/shared/api/admin/registrations';
import { useProfessionalOrientation } from '@/shared/api/admin/professional-orientation';
import { ProfOrientationTestModal } from './components/ProfOrientationTestModal';
import { hackathonsApi, HackathonTeam, HackathonSubmission } from '@/shared/api/hackathons';

export const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [isProfOrientationModalOpen, setIsProfOrientationModalOpen] = useState(false);
  const [hackathonTeams, setHackathonTeams] = useState<HackathonTeam[]>([]);
  const [hackathonSubmissions, setHackathonSubmissions] = useState<HackathonSubmission[]>([]);
  const [isLoadingHackathons, setIsLoadingHackathons] = useState(false);

  const { data: profOrientationResult } = useProfessionalOrientation();
  
  const { 
    registration: informaticsRegistration, 
    hasAccess: hasInformaticsAccess,
    isPending: isInformaticsPending,
    isRejected: isInformaticsRejected,
    currentUserId,
    isLoading: registrationsLoading 
  } = useInformaticsCourseRegistration();

  const getDisplayName = () => {
    if (!user) return '';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'Пользователь';
  };

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const userRoles = user?.roles || [];
  const hasStudentAccess = hasStudentRole(userRoles);
  const isMentor = hasMentorRole(userRoles);
  const isAdmin = hasAdminRole(userRoles);

  const canShowProfOrientationTab = hasStudentAccess && hasInformaticsAccess && !profOrientationResult;

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      if (hasStudentAccess) {
        loadHackathons();
      }
    }
  }, [user, hasStudentAccess]);

  const loadHackathons = async () => {
    setIsLoadingHackathons(true);
    try {
      const [teams, submissions] = await Promise.all([
        hackathonsApi.getUserTeams().catch(() => []),
        hackathonsApi.getUserSubmissions().catch(() => []),
      ]);
      setHackathonTeams(teams || []);
      setHackathonSubmissions(submissions || []);
    } catch (error) {
      console.error('Failed to load hackathons:', error);
    } finally {
      setIsLoadingHackathons(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Доступ запрещён</h1>
          <p className="text-white mb-6">Пожалуйста, войдите в систему, чтобы просмотреть свой профиль.</p>
          <Button variant="primary" onClick={() => window.location.href = '/auth'}>
            Войти
          </Button>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Сохранение профиля:', editForm);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
      };

      const token = localStorage.getItem('access_token');
      if (token) {
        login(token, updatedUser);
      }
      
      setIsEditing(false);
      alert('Профиль успешно обновлён!');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      alert('Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
    });
    setIsEditing(false);
  };

  const getAvatarLetter = () => {
    const displayName = getDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const InputField = ({ label, value, onChange, type = 'text' }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 text-white px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isLoading}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Профиль пользователя
          </h1>
          <p className="text-xl text-white">
            Управление настройками и предпочтениями аккаунта
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white font-bold">
                    {getAvatarLetter()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{getDisplayName()}</h2>
                <p className="text-white">{user.email}</p>
                <div className="mt-2 text-sm text-gray-500">
                  ID пользователя: {currentUserId || 'Н/Д'}
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {user.roles?.map((role: string, index: number) => (
                    <span 
                      key={index}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : role === 'mentor'
                          ? 'bg-purple-100 text-purple-800'
                          : role === 'student'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {role.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {hasStudentAccess && informaticsRegistration && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-800">
                    <p className="text-sm font-medium text-white mb-1">
                      Курс информатики:
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      informaticsRegistration.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : informaticsRegistration.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {informaticsRegistration.status === 'approved' ? 'Одобрено' :
                       informaticsRegistration.status === 'pending' ? 'Ожидает' : 'Отклонено'}
                    </span>
                  </div>
                )}

                {registrationsLoading && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-800">
                    <p className="text-sm text-white">Загрузка данных о курсах...</p>
                  </div>
                )}

                {hasStudentAccess && !registrationsLoading && !informaticsRegistration && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-800">
                    <p className="text-sm text-white">Не зарегистрирован на курс информатики</p>
                  </div>
                )}
              </div>

              <nav className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg bg-gray-800 text-blue-600 font-semibold">
                  👤 Информация профиля
                </button>
                {/* Студенты и менторы видят эти опции */}
                {hasStudentAccess && (
                  <button
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
                    onClick={() => setIsCoursesModalOpen(true)}
                  >
                    📚 Мои курсы
                  </button>
                )}
                {hasStudentAccess && (
                  <Link
                    href="/hackathons"
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white block"
                  >
                    🏆 Мои хакатоны
                  </Link>
                )}
                {hasStudentAccess && (
                  <Link
                    href="/peer-review"
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white block"
                  >
                    🔄 Peer Review
                  </Link>
                )}
                {canShowProfOrientationTab && (
                  <button
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
                    onClick={() => setIsProfOrientationModalOpen(true)}
                  >
                    🧭 Профессиональная ориентация
                  </button>
                )}
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white">
                  🎓 Сертификаты
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white">
                  ⚙️ Настройки
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white">
                  🔒 Приватность и безопасность
                </button>
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {isAdmin && (
              <Card className="p-6 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🛡️ Панель администратора
                  </h3>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Администратор
                  </span>
                </div>
                <p className="text-white mb-4">
                  Инструменты управления и администрирования системы
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/admin">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📊</span>
                      <span>Дашборд</span>
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">👥</span>
                      <span>Пользователи</span>
                    </Button>
                  </Link>
                  <Link href="/admin/courses">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📚</span>
                      <span>Курсы</span>
                    </Button>
                  </Link>
                  <Link href="/admin/groups">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">👨‍🏫</span>
                      <span>Группы</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {isMentor && (
              <Card className="p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🎯 Панель ментора
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Ментор
                  </span>
                </div>
                <p className="text-white mb-4">
                  Инструменты управления курсами и наставничества
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/mentor">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📊</span>
                      <span>Дашборд</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/groups">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">👨‍🏫</span>
                      <span>Группы</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/schedule">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📅</span>
                      <span>Расписание</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/assignments">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📝</span>
                      <span>Задания</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/materials">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📖</span>
                      <span>Материалы</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/hackathons">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">🏆</span>
                      <span>Хакатоны</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {hasStudentAccess && (
              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🎓 Панель студента
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Студент
                  </span>
                </div>
                <p className="text-white mb-4">
                  Ваш путь обучения и прогресс по курсам
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="secondary"
                    className="w-full p-4"
                    onClick={() => setIsCoursesModalOpen(true)}
                  >
                    <span className="text-2xl mb-2">📚</span>
                    <span>Мои курсы</span>
                  </Button>
                  {canShowProfOrientationTab && (
                    <Button
                      variant="secondary"
                      className="w-full p-4"
                      onClick={() => setIsProfOrientationModalOpen(true)}
                    >
                      <span className="text-2xl mb-2">🧭</span>
                      <span>Профориентация</span>
                    </Button>
                  )}
                  <Link href="/progress">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📈</span>
                      <span>Прогресс</span>
                    </Button>
                  </Link>
                  <Link href="/assignments">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📝</span>
                      <span>Задания</span>
                    </Button>
                  </Link>
                  <Link href="/certificates">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">🏆</span>
                      <span>Сертификаты</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {hasStudentAccess && hasInformaticsAccess && !profOrientationResult && (
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🧭 Доступно тестирование
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Новая возможность
                  </span>
                </div>
                <p className="text-white mb-4">
                  Поздравляем! Вы зарегистрированы на курс информатики и можете пройти профессиональную ориентацию.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => setIsProfOrientationModalOpen(true)}
                  className="gap-2"
                >
                  <span>🧭</span>
                  <span>Пройти профориентацию</span>
                </Button>
              </Card>
            )}

            {hasStudentAccess && profOrientationResult && (
              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🧭 Результат профориентации
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Завершён
                  </span>
                </div>
                <p className="text-white">
                  Ваша рекомендуемая профессия: <strong>{profOrientationResult.recommendedProfession}</strong>
                </p>
              </Card>
            )}

            {/* Хакатоны */}
            {hasStudentAccess && (
              <Card className="p-6 border-l-4 border-l-yellow-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🏆 Мои хакатоны
                  </h3>
                  <Link href="/hackathons">
                    <Button variant="secondary" size="sm">
                      Все хакатоны →
                    </Button>
                  </Link>
                </div>

                {isLoadingHackathons ? (
                  <p className="text-white">Загрузка...</p>
                ) : hackathonTeams.length === 0 ? (
                  <p className="text-muted-foreground">
                    Вы ещё не участвуете в хакатонах.{' '}
                    <Link href="/hackathons" className="text-primary hover:underline">
                      Посмотреть доступные
                    </Link>
                  </p>
                ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {hackathonTeams.map((team) => (
                      <div key={team.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {team.hackathon?.title}
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            team.status === 'approved' ? 'bg-green-600 text-white' :
                            team.status === 'pending' ? 'bg-yellow-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {team.status === 'approved' ? 'Одобрено' :
                             team.status === 'pending' ? 'На рассмотрении' : 'Отклонено'}
                          </span>
                        </div>
                        {team.projectName && (
                          <div className="text-sm text-blue-400 mt-2">
                            📝 {team.projectName}
                          </div>
                        )}
                        {team.submissions && team.submissions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <div className="text-xs text-gray-400">
                              📬 Проект отправлен
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {hackathonSubmissions.length > 0 && hackathonSubmissions.some(s => s.grades && s.grades.length > 0) && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">🏅 Результаты</h4>
                      <div className="space-y-3">
                        {hackathonSubmissions.filter(s => s.grades && s.grades.length > 0).map((submission) => {
                          const avgScore = submission.grades 
                                          ? submission.grades.reduce((sum, g) => sum + (g.totalScore || 0), 0) / submission.grades.length
                                          : 0;
                          return (
                            <div key={submission.id} className="p-4 bg-gray-800 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-white">
                                    {submission.team?.hackathon?.title}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {submission.team?.name}
                                  </div>
                                </div>
                                <div className="text-2xl font-bold text-green-400">
                                  {avgScore.toFixed(1)}
                                </div>
                              </div>
                              {submission.grades && submission.grades.length > 0 && submission.grades[0].feedback && (
                                <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400">
                                  💬 {submission.grades[0].feedback}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              </Card>
            )}

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Информация профиля</h3>
                {!isEditing && (
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    Редактировать профиль
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Имя"
                      value={editForm.firstName}
                      onChange={(value) => setEditForm(prev => ({ ...prev, firstName: value }))}
                    />
                    <InputField
                      label="Фамилия"
                      value={editForm.lastName}
                      onChange={(value) => setEditForm(prev => ({ ...prev, lastName: value }))}
                    />
                  </div>
                  <InputField
                    label="Электронная почта"
                    value={editForm.email}
                    onChange={(value) => setEditForm(prev => ({ ...prev, email: value }))}
                    type="email"
                  />
                  <div className="flex space-x-4">
                    <Button 
                      variant="primary" 
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Отображаемое имя
                      </label>
                      <p className="text-lg font-semibold text-white">{getDisplayName()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Электронная почта
                      </label>
                      <p className="text-lg font-semibold text-white">{user.email}</p>
                    </div>
                  </div>
                  {(user.firstName || user.lastName) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.firstName && (
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">
                            Имя
                          </label>
                          <p className="text-lg font-semibold text-white">{user.firstName}</p>
                        </div>
                      )}
                      {user.lastName && (
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">
                            Фамилия
                          </label>
                          <p className="text-lg font-semibold text-white">{user.lastName}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        ID пользователя
                      </label>
                      <p className="text-lg font-semibold text-white">{user.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Статус
                      </label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Активен
                      </span>
                    </div>
                  </div>
                  {user.roles && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Роли
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role: string, index: number) => (
                          <span 
                            key={index}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              role === 'admin' 
                                ? 'bg-red-100 text-red-800' 
                                : role === 'mentor'
                                ? 'bg-purple-100 text-purple-800'
                                : role === 'student'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {role.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Статистика обучения</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                  <div className="text-sm text-white">Записано курсов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                  <div className="text-sm text-white">Завершено курсов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">45ч</div>
                  <div className="text-sm text-white">Время обучения</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                  <div className="text-sm text-white">Сертификаты</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Быстрые действия</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {canShowProfOrientationTab && (
                  <Button 
                    variant="secondary" 
                    className="p-4"
                    onClick={() => setIsProfOrientationModalOpen(true)}
                  >
                    <span className="text-2xl mb-2">🧭</span>
                    <span>Профориентация</span>
                  </Button>
                )}
                  <Button 
                    variant="secondary" 
                    className="p-4"
                    onClick={() => setIsProfOrientationModalOpen(true)}
                  >
                    <span className="text-2xl mb-2">🧭</span>
                    <span>Профориентация</span>
                  </Button>
                <Button variant="secondary" className="p-4">
                  <span className="text-2xl mb-2">🔒</span>
                  <span>Приватность</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <MyCoursesModal 
        isOpen={isCoursesModalOpen}
        onClose={() => setIsCoursesModalOpen(false)}
      />
      
      <ProfOrientationTestModal 
        isOpen={isProfOrientationModalOpen}
        onClose={() => setIsProfOrientationModalOpen(false)}
      />
    </div>
  );
};