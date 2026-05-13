'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import LibraryPage from '@/features/library/LibraryPage';

export default function Page() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const hasAccess = user?.roles?.some(r =>
    r.startsWith('student_') || r.startsWith('mentor_') || r === 'admin'
  );

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      router.replace(user ? '/' : '/auth');
    }
  }, [user, isLoading, hasAccess, router]);

  if (isLoading || !hasAccess) {
    return (
      <div className="min-h-screen bg-gh-canvas flex items-center justify-center text-gray-400">
        {isLoading ? 'Загрузка...' : 'Нет доступа'}
      </div>
    );
  }

  return <LibraryPage />;
}
