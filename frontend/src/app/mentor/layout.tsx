'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import { useAuthStore } from '@/shared/store/auth-store';
import { GhSidebar, SidebarItem } from '@/shared/ui/sidebar/GhSidebar';

const DashboardIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>;
const GroupsIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 12.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2.5V5.5a1 1 0 0 0-1-1H10V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1.5H5.5a1 1 0 0 0-1 1V7H2a1 1 0 0 0-1 1Z"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Z"/></svg>;
const FileTextIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z"/></svg>;
const FolderIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1Z"/></svg>;
const TrophyIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5Z"/></svg>;
const GraduationIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.693 1.066a.75.75 0 0 1 .614 0l7.25 3.25a.75.75 0 0 1 0 1.368L13 6.831V10a1 1 0 0 1 .37.217l2 1.75a1 1 0 0 1-1.34 1.483L12 11.968V13.5a.75.75 0 0 1-1.5 0v-2.034l-2.807-2.456A.75.75 0 0 1 7 8.25V6.831L4.193 5.618 8 3.99l3.25 1.458L8 6.906 4.75 5.448l-3.443 1.25L8 9.013l3.25-1.463V8.25a.75.75 0 0 1-.263.573L8.5 11.052V13.5a.75.75 0 0 1-1.5 0v-2.448L4.013 8.823A.75.75 0 0 1 3.75 8.25V6.831L.443 5.684a.75.75 0 0 1 0-1.368Z"/></svg>;

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
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#8b949e', fontSize: 14 }}>Загрузка...</p>
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1117' }}>
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
