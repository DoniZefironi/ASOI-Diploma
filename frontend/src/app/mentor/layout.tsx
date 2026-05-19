'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import { useAuthStore } from '@/shared/store/auth-store';
import { GhSidebar, SidebarItem } from '@/shared/ui/sidebar/GhSidebar';
import { LayoutDashboard, Users, Calendar, FileText, Folder, Trophy, GraduationCap, MessageSquare, BookMarked, Medal } from 'lucide-react';

const menuItems: SidebarItem[] = [
  { href: '/mentor',              label: 'Дашборд',      icon: <LayoutDashboard size={16} /> },
  { href: '/mentor/groups',       label: 'Группы',       icon: <Users           size={16} /> },
  { href: '/mentor/schedule',     label: 'Расписание',   icon: <Calendar        size={16} /> },
  { href: '/mentor/assignments',  label: 'Задания',      icon: <FileText        size={16} /> },
  { href: '/mentor/materials',    label: 'Материалы',    icon: <Folder          size={16} /> },
  { href: '/mentor/hackathons',   label: 'Хакатоны',     icon: <Trophy          size={16} /> },
  { href: '/mentor/electives',    label: 'Факультативы', icon: <GraduationCap   size={16} /> },
  { href: '/mentor/forum',        label: 'Форум',        icon: <MessageSquare   size={16} /> },
  { href: '/mentor/vocabulary',   label: 'Словарь',      icon: <BookMarked      size={16} /> },
  { href: '/mentor/olympiads',    label: 'Олимпиады',    icon: <Medal           size={16} /> },
];

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user) {
      const isMentor = hasMentorRole(user.roles);
      const isAdmin = hasAdminRole(user.roles);
      if (!isMentor && !isAdmin) {
        router.push('/profile');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Загрузка...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isMentor = hasMentorRole(user?.roles || []);
  const isAdmin = hasAdminRole(user?.roles || []);
  if (!isMentor && !isAdmin) return null;

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-canvas-default)' }}>
      <GhSidebar
        title="Панель ментора"
        subtitle="Ментор"
        items={menuItems}
        onLogout={handleLogout}
      />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
