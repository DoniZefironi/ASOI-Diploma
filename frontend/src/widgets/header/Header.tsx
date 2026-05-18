'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sun, Moon, ChevronDown,
  BookOpen, Briefcase, Trophy, Terminal, Cpu,
  Library, Compass, MessageSquare, Radio,
} from 'lucide-react';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole, getCourseTypeFromRole } from '@/shared/lib/auth-context';
import { NotificationBell } from '@/features/notifications/NotificationBell';
import { useTheme } from '@/shared/lib/theme';

const SunIcon    = () => <Sun    size={16} />;
const MoonIcon   = () => <Moon   size={16} />;

const ChevronDownIcon  = () => <ChevronDown  size={16} />;
const BookIcon         = () => <BookOpen     size={16} />;
const BriefcaseIcon    = () => <Briefcase    size={16} />;
const TrophyIcon       = () => <Trophy       size={16} />;
const TerminalIcon     = () => <Terminal     size={16} />;
const CircuitIcon      = () => <Cpu          size={16} />;
const LibraryNavIcon   = () => <Library      size={16} />;
const CompassIcon      = () => <Compass      size={16} />;
const ForumIcon        = () => <MessageSquare size={16} />;
const IoTIcon          = () => <Radio        size={16} />;

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { href: '/courses',  label: 'Курсы',      icon: <BookIcon /> },
    // Библиотека — только для студентов, менторов и администраторов
    ...(isStudent || isMentor || isAdmin ? [
      { href: '/library', label: 'Библиотека', icon: <LibraryNavIcon /> },
    ] : []),
    // Только для студентов, менторов и администраторов
    ...(isStudent || isMentor || isAdmin ? [
      { href: '/forum',             label: 'Форум',        icon: <ForumIcon /> },
      { href: '/rooms',             label: 'Комнаты',      icon: <CircuitIcon /> },
      { href: '/career',            label: 'Карьера',      icon: <BriefcaseIcon /> },
      { href: '/hackathons',        label: 'Соревнования', icon: <TrophyIcon /> },
      { href: '/prof-orientation',  label: 'Ориентация',   icon: <CompassIcon /> },
    ] : []),
    // Компилятор — только computer_science или admin
    ...(isAdmin || (!userCourseType || userCourseType === 'computer_science') && (isStudent || isMentor)
      ? [{ href: '/complilier', label: 'Компилятор', icon: <TerminalIcon /> }] : []),
    // Эмулятор схем — только electronics или admin
    ...(isAdmin || (!userCourseType || userCourseType === 'electronics') && (isStudent || isMentor)
      ? [{ href: '/circuit', label: 'Эмулятор', icon: <CircuitIcon /> }] : []),
    // IoT-симулятор — только iot или admin
    ...(isAdmin || (!userCourseType || userCourseType === 'iot') && (isStudent || isMentor)
      ? [
          { href: '/shematic',     label: 'IoT',          icon: <IoTIcon /> },
          { href: '/mqtt-expert',  label: 'MQTT Expert',  icon: <IoTIcon /> },
        ] : []),
  ] : [];

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'var(--color-canvas-default)',
        borderBottom: '1px solid var(--color-border-muted)',
      }}
    >
      <div className="gh-container">
        <div className="flex items-center gap-4 h-14">

          {/* Logo — замени src на путь к своему изображению (например /logo.png) */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            style={{ textDecoration: 'none' }}
          >
            <img
              src="/logo.png"
              alt="Логотип"
              width={96}
              height={96}
              style={{ borderRadius: 8, objectFit: 'contain' }}
            />
          </Link>

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
                  style={{ color: 'var(--color-fg-default)', border: '1px solid var(--color-border-default)', background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  Войти
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex items-center px-3 h-8 text-sm font-semibold rounded-md transition-colors"
                  style={{ background: 'var(--color-accent-emphasis)', color: '#ffffff', border: '1px solid var(--color-border-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent-emphasis)')}
                >
                  Регистрация
                </Link>
              </>
            )}

            {user && (
              <>
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
                  className="p-2 rounded-md transition-colors"
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--color-fg-muted)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-fg-default)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
                >
                  {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>

                {/* Notification bell */}
                <NotificationBell />

                {/* Avatar dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 p-1 rounded-md transition-colors"
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-fg-default)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
                    onMouseLeave={e => !isDropdownOpen && (e.currentTarget.style.background = 'transparent')}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Аватар"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        style={{ border: '1px solid var(--color-border-default)' }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                        style={{ background: 'var(--color-accent-emphasis)', color: '#fff' }}
                      >
                        {getAvatarLetter()}
                      </div>
                    )}
                    <ChevronDownIcon />
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-1 w-56 rounded-md py-1 z-50 animate-fade-in"
                      style={{
                        background: 'var(--color-canvas-overlay)',
                        border: '1px solid var(--color-border-default)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: '1px solid #21262d' }}>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-fg-default)' }}>{getDisplayName()}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-fg-muted)' }}>{user.email}</p>
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
                          style={{ color: 'var(--color-danger-fg)', background: 'transparent', border: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
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
              style={{ color: 'var(--color-fg-default)', background: 'transparent', border: 'none' }}
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
      style={{ color: 'var(--color-fg-default)', textDecoration: 'none' }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--color-neutral-2)';
        e.currentTarget.style.color = 'var(--color-fg-default)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'var(--color-fg-default)';
      }}
    >
      {icon && <span style={{ color: 'var(--color-fg-muted)' }}>{icon}</span>}
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
      style={{ color: 'var(--color-fg-default)', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
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
      style={{ color: 'var(--color-fg-default)', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </Link>
  );
}
