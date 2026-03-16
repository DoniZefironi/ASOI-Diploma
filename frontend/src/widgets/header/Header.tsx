'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole, getCourseTypeFromRole } from '@/shared/lib/auth-context';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  // Проверяем роли пользователя
  const userRoles = user?.roles || [];
  const isStudent = hasStudentRole(userRoles);
  const isMentor = hasMentorRole(userRoles);
  const isAdmin = hasAdminRole(userRoles);
  const userCourseType = getCourseTypeFromRole(userRoles) || (user as any)?.enrolledCourseType;

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

  const getAvatarLetter = () => {
    const displayName = getDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-[#010409] text-white shadow-sm sticky top-0 z-50 border-b border-[#353C45]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EduTech
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Главная</Link>
            {!user && (
              <>
                <Link href="/about" className="hover:text-blue-600 transition-colors">О нас</Link>
                <Link href="/contacts" className="hover:text-blue-600 transition-colors">Контакты</Link>
                <Link href="/faq" className="hover:text-blue-600 transition-colors">Частые вопросы</Link>
              </>
            )}
            {user && (
              <>
                <Link href="/courses" className="hover:text-blue-600 transition-colors">Курсы</Link>
                {/* Студенты и менторы видят эти страницы */}
                {(isStudent || isMentor) && (
                  <>
                    <Link href="/hackathons" className="hover:text-blue-600 transition-colors">Хакатоны</Link>
                    <Link href="/career" className="hover:text-blue-600 transition-colors">Карьера</Link>
                    <Link href="/forum" className="hover:text-blue-600 transition-colors">Форум</Link>
                    {/* Показываем компилятор только для информатики */}
                    {(!userCourseType || userCourseType === 'computer_science') && (
                      <Link href="/complilier" className="hover:text-blue-600 transition-colors">Компилятор</Link>
                    )}
                    {/* Показываем эмулятор только для электроники */}
                    {(!userCourseType || userCourseType === 'electronics') && (
                      <Link href="/circuit" className="hover:text-blue-600 transition-colors">Эмулятор</Link>
                    )}
                  </>
                )}
                {/* Менторы и админы видят панель ментора */}
                {(isMentor || isAdmin) && (
                  <Link href="/mentor" className="hover:text-blue-600 transition-colors">Панель ментора</Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Link
                  href="/courses"
                  className="text-gray-300 hover:text-blue-600 transition-colors hidden lg:block"
                >
                  Курсы
                </Link>
                <Link
                  href="/auth"
                  className="text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Войти
                </Link>
                <Link
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#1C2128] transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {getAvatarLetter()}
                    </span>
                  </div>
                  <span className="hidden md:block">{getDisplayName()}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1C2128] border border-[#353C45] rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#353C45]">
                      <p className="text-sm font-semibold">{getDisplayName()}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 Мой профиль
                    </Link>

                    {/* Менторы и админы видят панель ментора */}
                    {(isMentor || isAdmin) && (
                      <Link
                        href="/mentor"
                        className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        🎯 Панель ментора
                      </Link>
                    )}

                    {/* Админы видят админ панель */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        🛡️ Панель администратора
                      </Link>
                    )}

                    {/* Студенты и менторы видят дашборд */}
                    {(isStudent || isMentor) && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        📊 Дашборд
                      </Link>
                    )}

                    {/* Студенты и менторы видят настройки */}
                    {(isStudent || isMentor) && (
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        ⚙️ Настройки
                      </Link>
                    )}

                    {/* Студенты и менторы видят peer review */}
                    {(isStudent || isMentor) && (
                      <Link
                        href="/peer-review"
                        className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        🔄 Peer Review
                      </Link>
                    )}

                    <div className="border-t border-[#353C45] my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2D333B] transition-colors"
                    >
                      🚪 Выйти
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};