'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { apiClient } from '@/shared/api/client';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>('');

  useEffect(() => {
    if (!pathname || pathname === lastTracked.current) return;
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return;
    // Трекаем только авторизованных пользователей — гостям не отправляем запрос
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;
    lastTracked.current = pathname;
    apiClient.post('/analytics/track', { path: pathname }).catch(() => {});
  }, [pathname]);

  return null;
}
