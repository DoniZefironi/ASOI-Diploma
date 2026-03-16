'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Дашборд', href: '/mentor', icon: '📊' },
  { name: 'Группы', href: '/mentor/groups', icon: '👨‍🏫' },
  { name: 'Расписание', href: '/mentor/schedule', icon: '📅' },
  { name: 'Задания', href: '/mentor/assignments', icon: '📝' },
  { name: 'Материалы', href: '/mentor/materials', icon: '📖' },
  { name: 'Хакатоны', href: '/mentor/hackathons', icon: '🏆' },
];

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

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
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  const isMentor = hasMentorRole(user?.roles || []);
  const isAdmin = hasAdminRole(user?.roles || []);

  if (!isMentor && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Боковая панель */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#161B22] border-r border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">Панель ментора</h1>
        </div>
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Основной контент */}
      <main className="pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
