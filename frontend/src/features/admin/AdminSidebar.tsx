'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth-store';
import { GhSidebar, SidebarItem } from '@/shared/ui/sidebar/GhSidebar';

// Octicon-style icons
const DashboardIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/></svg>;
const UsersIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z"/></svg>;
const BookIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Z"/></svg>;
const GroupsIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 12.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2.5V5.5a1 1 0 0 0-1-1H10V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1.5H5.5a1 1 0 0 0-1 1V7H2a1 1 0 0 0-1 1Z"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Z"/></svg>;
const FileTextIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z"/></svg>;
const FolderIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1Z"/></svg>;
const ChatIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1Z"/></svg>;
const TrophyIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5Z"/></svg>;
const BriefcaseIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 1.75C6.5.784 7.284 0 8.25 0h-.5C8.716 0 9.5.784 9.5 1.75V3h2.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5V1.75ZM8 1.5a.25.25 0 0 0-.25.25V3h.5V1.75A.25.25 0 0 0 8 1.5ZM3.5 5v7.5c0 .276.224.5.5.5h8a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H4a.5.5 0 0 0-.5.5Z"/></svg>;
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14ZM7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.97a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.779a.749.749 0 1 1 1.06-1.06Z"/></svg>;
const BarChartIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"/></svg>;
const GraduationIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.693 1.066a.75.75 0 0 1 .614 0l7.25 3.25a.75.75 0 0 1 0 1.368L13 6.831V10a1 1 0 0 1 .37.217l2 1.75a1 1 0 0 1-1.34 1.483L12 11.968V13.5a.75.75 0 0 1-1.5 0v-2.034l-2.807-2.456A.75.75 0 0 1 7 8.25V6.831L4.193 5.618 8 3.99l3.25 1.458L8 6.906 4.75 5.448l-3.443 1.25L8 9.013l3.25-1.463V8.25a.75.75 0 0 1-.263.573L8.5 11.052V13.5a.75.75 0 0 1-1.5 0v-2.448L4.013 8.823A.75.75 0 0 1 3.75 8.25V6.831L.443 5.684a.75.75 0 0 1 0-1.368Z"/></svg>;
const PulseIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 2a.75.75 0 0 1 .696.471L10 10.731l1.304-3.26A.75.75 0 0 1 12 7h3.25a.75.75 0 0 1 0 1.5h-2.742l-1.812 4.528a.75.75 0 0 1-1.392 0L6 4.77 4.696 8.028A.75.75 0 0 1 4 8.5H.75a.75.75 0 0 1 0-1.5h2.742l1.812-4.528A.75.75 0 0 1 6 2Z"/></svg>;

const menuItems: SidebarItem[] = [
  { href: '/admin',                          label: 'Дашборд',              icon: <DashboardIcon /> },
  { href: '/admin/users',                    label: 'Пользователи',         icon: <UsersIcon /> },
  { href: '/admin/courses',                  label: 'Курсы',                icon: <BookIcon /> },
  { href: '/admin/groups',                   label: 'Группы',               icon: <GroupsIcon /> },
  { href: '/admin/schedule',                 label: 'Расписание',           icon: <CalendarIcon /> },
  { href: '/admin/assignments',              label: 'Задания',              icon: <FileTextIcon /> },
  { href: '/admin/electives',                label: 'Факультативы',         icon: <GraduationIcon /> },
  { href: '/admin/materials',                label: 'Материалы',            icon: <FolderIcon /> },
  { href: '/admin/vocabulary',               label: 'English Vocabulary',   icon: <BookIcon /> },
  { href: '/admin/forum',                    label: 'Форум',                icon: <ChatIcon /> },
  { href: '/admin/hackathons',               label: 'Хакатоны',             icon: <TrophyIcon /> },
  { href: '/admin/internships',              label: 'Стажировки',           icon: <BriefcaseIcon /> },
  { href: '/admin/import-internships',       label: 'Импорт стажировок',    icon: <DownloadIcon /> },
  { href: '/admin/internships-stats',        label: 'Статистика',           icon: <BarChartIcon /> },
  { href: '/admin/prof-orientation-analysis',label: 'Анализ профориентации',icon: <BarChartIcon /> },
  { href: '/admin/analytics',                label: 'Посещаемость',         icon: <PulseIcon /> },
];

export default function AdminSidebar() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <GhSidebar
      title="Панель управления"
      subtitle="Администратор"
      items={menuItems}
      onLogout={handleLogout}
    />
  );
}
