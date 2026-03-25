'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Users2,
  Calendar,
  FileText,
  FolderOpen,
  MessageSquare,
  Award,
  LayoutDashboard,
  BarChart3,
  LogOut,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Download
} from 'lucide-react';
import { useAuthStore } from '@/shared/store/auth-store';
import { cn } from '@/shared/lib/utils';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Дашборд' },
  { href: '/admin/users', icon: Users, label: 'Пользователи' },
  { href: '/admin/courses', icon: BookOpen, label: 'Курсы' },
  { href: '/admin/groups', icon: Users2, label: 'Группы' },
  { href: '/admin/schedule', icon: Calendar, label: 'Расписание' },
  { href: '/admin/assignments', icon: FileText, label: 'Задания' },
  { href: '/admin/electives', icon: GraduationCap, label: 'Факультативы' },
  { href: '/admin/materials', icon: FolderOpen, label: 'Материалы' },
  { href: '/admin/forum', icon: MessageSquare, label: 'Форум' },
  { href: '/admin/hackathons', icon: Award, label: 'Хакатоны' },
  { href: '/admin/internships', icon: Briefcase, label: 'Стажировки' },
  { href: '/admin/import-internships', icon: Download, label: 'Импорт стажировок' },
  { href: '/admin/internships-stats', icon: TrendingUp, label: 'Статистика стажировок' },
  { href: '/admin/prof-orientation-analysis', icon: BarChart3, label: 'Анализ проф. ориентации' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className="w-64 bg-card border-r flex flex-col h-full">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-card-foreground">Панель управления</h1>
        <p className="text-sm text-muted-foreground">Администратор</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}