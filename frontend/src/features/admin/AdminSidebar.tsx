'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth-store';
import { GhSidebar, SidebarItem } from '@/shared/ui/sidebar/GhSidebar';
import {
  LayoutDashboard, Users, BookOpen, LayoutGrid, Calendar,
  FileText, Folder, MessageSquare, Trophy, Briefcase,
  Download, BarChart2, GraduationCap, Activity, Library,
} from 'lucide-react';

const menuItems: SidebarItem[] = [
  { href: '/admin',                           label: 'Дашборд',              icon: <LayoutDashboard size={16} /> },
  { href: '/admin/users',                     label: 'Пользователи',         icon: <Users          size={16} /> },
  { href: '/admin/courses',                   label: 'Курсы',                icon: <BookOpen       size={16} /> },
  { href: '/admin/groups',                    label: 'Группы',               icon: <LayoutGrid     size={16} /> },
  { href: '/admin/schedule',                  label: 'Расписание',           icon: <Calendar       size={16} /> },
  { href: '/admin/assignments',               label: 'Задания',              icon: <FileText       size={16} /> },
  { href: '/admin/electives',                 label: 'Факультативы',         icon: <GraduationCap  size={16} /> },
  { href: '/admin/materials',                 label: 'Материалы',            icon: <Folder         size={16} /> },
  { href: '/admin/vocabulary',                label: 'English Vocabulary',   icon: <Library        size={16} /> },
  { href: '/admin/forum',                     label: 'Форум',                icon: <MessageSquare  size={16} /> },
  { href: '/admin/hackathons',                label: 'Хакатоны',             icon: <Trophy         size={16} /> },
  { href: '/admin/internships',               label: 'Стажировки',           icon: <Briefcase      size={16} /> },
  { href: '/admin/import-internships',        label: 'Импорт стажировок',    icon: <Download       size={16} /> },
  { href: '/admin/internships-stats',         label: 'Статистика',           icon: <BarChart2      size={16} /> },
  { href: '/admin/prof-orientation-analysis', label: 'Анализ профориентации',icon: <BarChart2      size={16} /> },
  { href: '/admin/analytics',                 label: 'Посещаемость',         icon: <Activity       size={16} /> },
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
