'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Создаем отображаемое имя пользователя
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

  // Инициализируем форму данными пользователя
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Проверка ролей
  const isAdmin = user?.roles?.includes('admin') || false;
  const isMentor = user?.roles?.includes('mentor') || false;
  const isStudent = user?.roles?.includes('student') || false;

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
      // Здесь должен быть API запрос для обновления профиля
      console.log('Saving profile:', editForm);
      
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Обновляем данные в контексте и localStorage
      const updatedUser = {
        ...user,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
      };
      
      // Обновляем данные в контексте
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

  // Получаем первую букву для аватара
  const getAvatarLetter = () => {
    const displayName = getDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  // Компонент для полей ввода
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
                  Member since 2024
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
              </div>

              <nav className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg bg-gray-800 text-blue-600 font-semibold">
                  👤 Profile Information
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors text-white">
                  📚 My Courses
                </button>
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
                  <Link href="/my-courses">
                    <Button variant="secondary" className="w-full p-4">
                      <span className="text-2xl mb-2">📚</span>
                      <span>My Courses</span>
                    </Button>
                  </Link>
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

            {/* Остальные карточки остаются без изменений */}
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
                <Button variant="secondary" className="p-4">
                  <span className="text-2xl mb-2">📚</span>
                  <span>My Courses</span>
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
    </div>
  );
};