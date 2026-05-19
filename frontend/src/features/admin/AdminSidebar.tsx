'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth-store';
import { GhSidebar, SidebarItem } from '@/shared/ui/sidebar/GhSidebar';
import {
  LayoutDashboard, Users, BookOpen,
  MessageSquare, Briefcase, Download, BarChart2,
  Activity, Target,
} from 'lucide-react';

const menuItems: SidebarItem[] = [
  // ── Основное ──────────────────────────────────────────────────────
  { href: '/admin',                           label: 'Дашборд',              icon: <LayoutDashboard size={16} /> },

  // ── Пользователи ──────────────────────────────────────────────────
  { href: '/admin/users',                     label: 'Пользователи',         icon: <Users          size={16} /> },
  { href: '/admin/courses',                   label: 'Курсы',                icon: <BookOpen       size={16} /> },

  // ── Контент платформы ─────────────────────────────────────────────
  { href: '/admin/forum',                     label: 'Форум',                icon: <MessageSquare  size={16} /> },

  // ── Стажировки ────────────────────────────────────────────────────
  { href: '/admin/internships',               label: 'Стажировки',           icon: <Briefcase      size={16} /> },
  { href: '/admin/import-internships',        label: 'Импорт стажировок',    icon: <Download       size={16} /> },
  { href: '/admin/internships-stats',         label: 'Стат. стажировок',     icon: <BarChart2      size={16} /> },

  // ── Аналитика ─────────────────────────────────────────────────────
  { href: '/admin/career-tests',              label: 'Тесты профориентации', icon: <Target         size={16} /> },
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
