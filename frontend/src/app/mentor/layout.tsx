'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import { useAuthStore } from '@/shared/store/auth-store';
import { GhSidebar, SidebarItem } from '@/shared/ui/sidebar/GhSidebar';
import { LayoutDashboard, Users, Calendar, FileText, Folder, Trophy, GraduationCap } from 'lucide-react';

const DashboardIcon = () => <LayoutDashboard size={16} />;
const GroupsIcon = () => <Users size={16} />;
const CalendarIcon = () => <Calendar size={16} />;
const FileTextIcon = () => <FileText size={16} />;
const FolderIcon = () => <Folder size={16} />;
const TrophyIcon = () => <Trophy size={16} />;
const GraduationIcon = () => <GraduationCap size={16} />;

const menuItems: SidebarItem[] = [
  { href: '/mentor',              label: 'Дашборд',      icon: <DashboardIcon /> },
  { href: '/mentor/groups',       label: 'Группы',       icon: <GroupsIcon /> },
  { href: '/mentor/schedule',     label: 'Расписание',   icon: <CalendarIcon /> },
  { href: '/mentor/assignments',  label: 'Задания',      icon: <FileTextIcon /> },
  { href: '/mentor/materials',    label: 'Материалы',    icon: <FolderIcon /> },
  { href: '/mentor/hackathons',   label: 'Хакатоны',     icon: <TrophyIcon /> },
  { href: '/mentor/electives',    label: 'Факультативы', icon: <GraduationIcon /> },
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
