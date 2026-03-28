'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole, getCourseTypeFromRole } from '@/shared/lib/auth-context';
import { NotificationBell } from '@/features/notifications/NotificationBell';

// Octicon-style SVG icons
const SearchIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
  </svg>
);

const BellIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .02.005.09.072.09h10.854l.001-.006a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
  </svg>
);

const BookIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.5 1.75C6.5.784 7.284 0 8.25 0h-.5C8.716 0 9.5.784 9.5 1.75V3h2.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5V1.75ZM8 1.5a.25.25 0 0 0-.25.25V3h.5V1.75A.25.25 0 0 0 8 1.5ZM3.5 5v7.5c0 .276.224.5.5.5h8a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H4a.5.5 0 0 0-.5.5Z" />
  </svg>
);

const TrophyIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5ZM3 4v.5c0 .832.397 1.572 1.01 2.04A3.5 3.5 0 0 1 3.5 4.5v-.5H3a.5.5 0 0 0 0 1V4ZM13 4a.5.5 0 0 0-.5-.5H12v.5c0 .744-.215 1.438-.586 2.025A2.5 2.5 0 0 0 13 4Zm-5 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
);

const TerminalIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25Zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM7.25 8a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 0 1-1.06-1.06L5.44 8 3.72 6.28a.75.75 0 0 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm1.5 1.5h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5Z" />
  </svg>
);

const CircuitIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6 1.75V3h4V1.75a.75.75 0 0 1 1.5 0V3h1.25c.966 0 1.75.784 1.75 1.75V6h1.25a.75.75 0 0 1 0 1.5H14.5v2h1.25a.75.75 0 0 1 0 1.5H14.5v1.25A1.75 1.75 0 0 1 12.75 14H11.5v1.25a.75.75 0 0 1-1.5 0V14h-4v1.25a.75.75 0 0 1-1.5 0V14H3.25A1.75 1.75 0 0 1 1.5 12.25V11H.25a.75.75 0 0 1 0-1.5H1.5v-2H.25a.75.75 0 0 1 0-1.5H1.5V4.75C1.5 3.784 2.284 3 3.25 3H4.5V1.75a.75.75 0 0 1 1.5 0ZM3.25 4.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25ZM6 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM8 9.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
  </svg>
);

const CompassIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a7.75 7.75 0 1 0 0 15.5A7.75 7.75 0 0 0 8 .25Zm0 14a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5ZM6.78 6.22a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 1 0-1.06-1.06L7.75 7.19 6.78 6.22Z" />
  </svg>
);

const ForumIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.457 1.457 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 1 1 1.06-1.06l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z" />
  </svg>
);

export const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const userRoles = user?.roles || [];
  const isStudent = hasStudentRole(userRoles);
  const isMentor = hasMentorRole(userRoles);
  const isAdmin = hasAdminRole(userRoles);
  const userCourseType = getCourseTypeFromRole(userRoles) || (user as any)?.enrolledCourseType;

  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.email) return user.email.split('@')[0];
    return 'Пользователь';
  };

  const getAvatarLetter = () => getDisplayName().charAt(0).toUpperCase();

  // Nav items for authenticated users
  const navItems = user ? [
    { href: '/courses',        label: 'Курсы',         icon: <BookIcon /> },
    ...(isStudent || isMentor || isAdmin ? [
      { href: '/forum',          label: 'Форум',         icon: <ForumIcon /> },
    ] : []),
    ...(isStudent || isMentor ? [
      { href: '/career',         label: 'Карьера',       icon: <BriefcaseIcon /> },
      { href: '/hackathons',     label: 'Соревнования',  icon: <TrophyIcon /> },
      ...(!userCourseType || userCourseType === 'computer_science'
        ? [{ href: '/complilier', label: 'Компилятор', icon: <TerminalIcon /> }]
        : []),
      ...(!userCourseType || userCourseType === 'electronics'
        ? [{ href: '/circuit', label: 'Эмулятор', icon: <CircuitIcon /> }]
        : []),
      { href: '/prof-orientation', label: 'Ориентация', icon: <CompassIcon /> },
    ] : []),
  ] : [];

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: '#0d1117',
        borderBottom: '1px solid #21262d',
      }}
    >
      <div className="gh-container">
        <div className="flex items-center gap-4 h-14">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            style={{ color: '#e6edf3', textDecoration: 'none' }}
          >
            <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor" style={{ color: '#e6edf3' }}>
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span className="font-semibold text-base" style={{ color: '#e6edf3' }}>EduTech</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <div
              className="flex items-center w-full px-3 gap-2 h-8 rounded-md text-sm"
              style={{
                background: '#0d1117',
                border: '1px solid #30363d',
                color: '#8b949e',
                cursor: 'text',
              }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Поиск курсов, заданий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm"
                style={{ color: '#e6edf3', caretColor: '#2f81f7' }}
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {!user && (
              <>
                <NavLink href="/about">О нас</NavLink>
                <NavLink href="/courses">Курсы</NavLink>
                <NavLink href="/faq">FAQ</NavLink>
              </>
            )}
            {user && navItems.map(item => (
              <NavLink key={item.href} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {!user && (
              <>
                <Link
                  href="/auth"
                  className="hidden sm:inline-flex items-center px-3 h-8 text-sm rounded-md transition-colors"
                  style={{ color: '#e6edf3', border: '1px solid #30363d', background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Войти
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex items-center px-3 h-8 text-sm font-semibold rounded-md transition-colors"
                  style={{ background: '#2f81f7', color: '#ffffff', border: '1px solid rgba(240,246,252,0.1)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#388bfd')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#2f81f7')}
                >
                  Регистрация
                </Link>
              </>
            )}

            {user && (
              <>
                {/* Notification bell */}
                <NotificationBell />

                {/* Avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 p-1 rounded-md transition-colors"
                    style={{ background: 'transparent', border: 'none', color: '#e6edf3' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
                    onMouseLeave={e => !isDropdownOpen && (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ background: '#2f81f7', color: '#fff' }}
                    >
                      {getAvatarLetter()}
                    </div>
                    <ChevronDownIcon />
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-1 w-56 rounded-md py-1 z-50 animate-fade-in"
                      style={{
                        background: '#161b22',
                        border: '1px solid #30363d',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: '1px solid #21262d' }}>
                        <p className="text-sm font-semibold" style={{ color: '#e6edf3' }}>{getDisplayName()}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#8b949e' }}>{user.email}</p>
                      </div>

                      <div className="py-1" style={{ borderBottom: '1px solid #21262d' }}>
                        <DropdownItem href="/profile" onClick={() => setIsDropdownOpen(false)}>
                          Мой профиль
                        </DropdownItem>
                        {(isStudent || isMentor) && (
                          <DropdownItem href="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                            Дашборд
                          </DropdownItem>
                        )}
                        {(isStudent || isMentor) && (
                          <DropdownItem href="/peer-review" onClick={() => setIsDropdownOpen(false)}>
                            Peer Review
                          </DropdownItem>
                        )}
                      </div>

                      {(isMentor || isAdmin) && (
                        <div className="py-1" style={{ borderBottom: '1px solid #21262d' }}>
                          {(isMentor || isAdmin) && (
                            <DropdownItem href="/mentor" onClick={() => setIsDropdownOpen(false)}>
                              Панель ментора
                            </DropdownItem>
                          )}
                          {isAdmin && (
                            <DropdownItem href="/admin" onClick={() => setIsDropdownOpen(false)}>
                              Панель администратора
                            </DropdownItem>
                          )}
                        </div>
                      )}

                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-1.5 text-sm transition-colors"
                          style={{ color: '#f85149', background: 'transparent', border: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          Выйти
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md"
              style={{ color: '#e6edf3', background: 'transparent', border: 'none' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Меню"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <nav
            className="lg:hidden py-3 animate-fade-in"
            style={{ borderTop: '1px solid #21262d' }}
          >
            {!user && (
              <>
                <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>О нас</MobileNavLink>
                <MobileNavLink href="/courses" onClick={() => setIsMobileMenuOpen(false)}>Курсы</MobileNavLink>
                <MobileNavLink href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</MobileNavLink>
                <MobileNavLink href="/auth" onClick={() => setIsMobileMenuOpen(false)}>Войти</MobileNavLink>
              </>
            )}
            {user && navItems.map(item => (
              <MobileNavLink key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </MobileNavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

// Small sub-components

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-2 h-8 text-sm rounded-md transition-colors whitespace-nowrap"
      style={{ color: '#e6edf3', textDecoration: 'none' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#21262d';
        e.currentTarget.style.color = '#e6edf3';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = '#e6edf3';
      }}
    >
      {icon && <span style={{ color: '#8b949e' }}>{icon}</span>}
      {children}
    </Link>
  );
}

function DropdownItem({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-1.5 text-sm transition-colors"
      style={{ color: '#e6edf3', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-3 py-2 text-sm rounded-md transition-colors"
      style={{ color: '#e6edf3', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </Link>
  );
}
