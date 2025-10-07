// components/mentor/MentorSidebar.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard,
  Users2, 
  FileText,
  Calendar,
  BarChart3,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/mentor', icon: LayoutDashboard, label: 'Дашборд' },
  { href: '/mentor/groups', icon: Users2, label: 'Мои группы' },
  { href: '/mentor/assignments', icon: FileText, label: 'Задания' },
  { href: '/mentor/schedule', icon: Calendar, label: 'Расписание' },
  { href: '/mentor/grades', icon: GraduationCap, label: 'Оценки' },
  { href: '/mentor/analytics', icon: BarChart3, label: 'Аналитика' },
];

export default function MentorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  return (
    <div className="w-64 bg-card border-r flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-card-foreground">Панель ментора</h1>
        <p className="text-sm text-muted-foreground">
          {user?.firstName} {user?.lastName}
        </p>
      </div>
      
      {/* Navigation */}
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

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut size={18} className="mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
}