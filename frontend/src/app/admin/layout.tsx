// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import AdminSidebar from '@/features/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      console.log('Авторизация все еще загружается...');
      return;
    }

    console.log('Проверка аутентификации в макете (вёрстке).', { 
      hasUser: !!user, 
      hasToken: !!token,
      userRoles: user?.roles 
    });

    if (!token || !user) {
      console.log('Нет аутентификации, перенаправление на /auth');
      router.push('/auth');
      return;
    }
    
    if (!user.roles?.includes('admin')) {
      console.log('Не администратор, перенаправление на /');
      router.push('/');
      return;
    }
    
    console.log('Пользователь является администратором, доступ разрешён.');
    setIsAuthorized(true);
    setIsLoading(false);
  }, [user, token, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-white">Проверка прав доступа...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <p className="text-white text-xl">Доступ запрещён</p>
          <p className="text-gray-400 mt-2">У вас нет разрешения на доступ к этой странице.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1117' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}