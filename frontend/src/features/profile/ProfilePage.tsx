// src/features/profile/ProfilePage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { MyCoursesModal } from './components/MyCoursesModal';
import { useInformaticsCourseRegistration } from '@/shared/api/admin/registrations';
import { useProfessionalOrientation } from '@/shared/api/admin/professional-orientation';
import { ProfOrientationTestModal } from './components/ProfOrientationTestModal';

export const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [isProfOrientationModalOpen, setIsProfOrientationModalOpen] = useState(false);

  // Используем хуки
  const { data: profOrientationResult } = useProfessionalOrientation();
  
  // Проверяем регистрацию на курс информатики
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
    
    return 'User';
  };

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const isAdmin = user?.roles?.includes('admin') || false;
  const isMentor = user?.roles?.includes('mentor') || false;
  const isStudent = user?.roles?.includes('student') || false;

  // Проверяем, может ли пользователь пройти профориентацию
  const canShowProfOrientationTab = isStudent && hasInformaticsAccess && !profOrientationResult;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white mb-6">Please log in to view your profile.</p>
          <Button variant="primary" onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving profile:', editForm);

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
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
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
            User Profile
          </h1>
          <p className="text-xl text-white">
            Manage your account settings and preferences
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
                  User ID: {currentUserId || 'N/A'}
                </div>
                
                {/* Бейджи ролей */}
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

                {/* Статус регистрации на информатику */}
                {isStudent && informaticsRegistration && (
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

                {/* Показываем загрузку */}
                {registrationsLoading && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-800">
                    <p className="text-sm text-white">Загрузка данных о курсах...</p>
                  </div>
                )}

                {/* Сообщение если нет заявки на информатику */}
                {isStudent && !registrationsLoading && !informaticsRegistration && (
                  <div className="mt-4 p-3 rounded-lg bg-gray-800">
                    <p className="text-sm text-white">Не зарегистрирован на курс информатики</p>
                  </div>
                )}
              </div>

              <nav className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg bg-gray-800 text-blue-600 font-semibold">
                  👤 Profile Information
                </button>
                <button 
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
                  onClick={() => setIsCoursesModalOpen(true)}
                >
                  📚 My Courses
                </button>
                {canShowProfOrientationTab && (
                  <button 
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
                    onClick={() => setIsProfOrientationModalOpen(true)}
                  >
                    🧭 Профессиональная ориентация
                  </button>
                )}
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white">
                  🎓 Certificates
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white">
                  ⚙️ Settings
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white">
                  🔒 Privacy & Security
                </button>
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Админ панель */}
            {isAdmin && (
              <Card className="p-6 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🛡️ Admin Panel
                  </h3>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Administrator
                  </span>
                </div>
                <p className="text-white mb-4">
                  System administration and management tools
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/admin">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📊</span>
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">👥</span>
                      <span>Users</span>
                    </Button>
                  </Link>
                  <Link href="/admin/courses">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📚</span>
                      <span>Courses</span>
                    </Button>
                  </Link>
                  <Link href="/admin/groups">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">👨‍🏫</span>
                      <span>Groups</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Ментор панель */}
            {isMentor && (
              <Card className="p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🎯 Mentor Panel
                  </h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Mentor
                  </span>
                </div>
                <p className="text-white mb-4">
                  Course management and student mentoring tools
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/mentor">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📊</span>
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/courses">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📚</span>
                      <span>My Courses</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/students">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">👨‍🎓</span>
                      <span>Students</span>
                    </Button>
                  </Link>
                  <Link href="/mentor/assignments">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📝</span>
                      <span>Assignments</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Студент панель */}
            {isStudent && (
              <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    🎓 Student Panel
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Student
                  </span>
                </div>
                <p className="text-white mb-4">
                  Your learning journey and course progress
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="secondary" 
                    className="w-full p-4"
                    onClick={() => setIsCoursesModalOpen(true)}
                  >
                    <span className="text-2xl mb-2">📚</span>
                    <span>My Courses</span>
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
                      <span>Progress</span>
                    </Button>
                  </Link>
                  <Link href="/assignments">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📝</span>
                      <span>Assignments</span>
                    </Button>
                  </Link>
                  <Link href="/certificates">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">🏆</span>
                      <span>Certificates</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Панель профориентации */}
            {isStudent && hasInformaticsAccess && !profOrientationResult && (
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

            {isStudent && profOrientationResult && (
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

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Profile Information</h3>
                {!isEditing && (
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      value={editForm.firstName}
                      onChange={(value) => setEditForm(prev => ({ ...prev, firstName: value }))}
                    />
                    <InputField
                      label="Last Name"
                      value={editForm.lastName}
                      onChange={(value) => setEditForm(prev => ({ ...prev, lastName: value }))}
                    />
                  </div>
                  <InputField
                    label="Email"
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
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Display Name
                      </label>
                      <p className="text-lg font-semibold text-white">{getDisplayName()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Email
                      </label>
                      <p className="text-lg font-semibold text-white">{user.email}</p>
                    </div>
                  </div>
                  {(user.firstName || user.lastName) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.firstName && (
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">
                            First Name
                          </label>
                          <p className="text-lg font-semibold text-white">{user.firstName}</p>
                        </div>
                      )}
                      {user.lastName && (
                        <div>
                          <label className="block text-sm font-medium text-white mb-1">
                            Last Name
                          </label>
                          <p className="text-lg font-semibold text-white">{user.lastName}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        User ID
                      </label>
                      <p className="text-lg font-semibold text-white">{user.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Status
                      </label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                  {user.roles && (
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Roles
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
              <h3 className="text-2xl font-bold text-white mb-6">Learning Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                  <div className="text-sm text-white">Courses Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                  <div className="text-sm text-white">Courses Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">45h</div>
                  <div className="text-sm text-white">Learning Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                  <div className="text-sm text-white">Certificates</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">📚</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Completed: Python Basics</p>
                    <p className="text-sm text-white">2 days ago</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Completed
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">🎯</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Started: Web Development</p>
                    <p className="text-sm text-white">1 week ago</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">📜</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Earned Certificate: JavaScript</p>
                    <p className="text-sm text-white">2 weeks ago</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Certificate
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="secondary" 
                  className="p-4"
                  onClick={() => setIsCoursesModalOpen(true)}
                >
                  <span className="text-2xl mb-2">📚</span>
                  <span>My Courses</span>
                </Button>
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
                  <span className="text-2xl mb-2">🎓</span>
                  <span>Certificates</span>
                </Button>
                <Button variant="secondary" className="p-4">
                  <span className="text-2xl mb-2">⚙️</span>
                  <span>Settings</span>
                </Button>
                <Button variant="secondary" className="p-4">
                  <span className="text-2xl mb-2">🔒</span>
                  <span>Privacy</span>
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