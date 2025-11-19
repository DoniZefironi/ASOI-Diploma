// shared/api/admin/stats.ts
import useSWR from 'swr';
import { apiClient } from '../client';

const fetcher = (url: string) => apiClient.get(url);

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalGroups: number;
  pendingRegistrations: number;
  // Добавьте другие поля статистики по необходимости
}

export function useAdminStats() {
  const { data, error, isLoading } = useSWR<AdminStats>(
    '/admin/stats',
    fetcher,
    {
      refreshInterval: 30000,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}