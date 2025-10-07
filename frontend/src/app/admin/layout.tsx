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
      console.log('Auth still loading...');
      return;
    }

    console.log('Auth check in layout:', { 
      hasUser: !!user, 
      hasToken: !!token,
      userRoles: user?.roles 
    });

    if (!token || !user) {
      console.log('No auth, redirecting to /auth');
      router.push('/auth');
      return;
    }
    
    if (!user.roles?.includes('admin')) {
      console.log('Not admin, redirecting to /');
      router.push('/');
      return;
    }
    
    console.log('User is admin, allowing access');
    setIsAuthorized(true);
    setIsLoading(false);
  }, [user, token, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-white">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1117]">
        <div className="text-center">
          <p className="text-white text-xl">Access Denied</p>
          <p className="text-gray-400 mt-2">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0D1117]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}