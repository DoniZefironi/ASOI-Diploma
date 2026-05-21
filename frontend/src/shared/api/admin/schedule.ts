// shared/api/admin/schedule.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const BASE = '/schedule';
const FETCH_KEY = `${BASE}?limit=1000`;

const fetcher = (url: string) => apiClient.get(url);

export interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingUrl?: string;
  courseGroupId: number;
  courseGroup?: {
    id: number;
    name: string;
    course?: {
      id: number;
      name: string;
    };
  };
  instructor?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  instructorId?: number;
  createdAt: string;
  updatedAt: string;
}

export function useSchedule() {
  const { data, error, isLoading, mutate } = useSWR<ScheduleItem[]>(
    FETCH_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const { trigger: createScheduleItem, isMutating: isCreating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: any }) => apiClient.post(BASE, arg),
    { onSuccess: () => mutate() }
  );

  const { trigger: updateScheduleItem, isMutating: isUpdating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: { id: number; data: any } }) => apiClient.put(`${BASE}/${arg.id}`, arg.data),
    { onSuccess: () => mutate() }
  );

  const { trigger: deleteScheduleItem, isMutating: isDeleting } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: number }) => apiClient.delete(`${BASE}/${arg}`),
    {
      onSuccess: (deletedId) => {
        mutate(
          (currentData: ScheduleItem[] | undefined) =>
            currentData ? currentData.filter((item: ScheduleItem) => item.id !== deletedId) : [],
          false
        );
      },
    }
  );

  return {
    schedule: data || [],
    isLoading,
    isError: error,
    mutate,
    createScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

export function useUserSchedule(startDate?: string, endDate?: string) {
  const isAuthorized = typeof window !== 'undefined' && !!localStorage.getItem('access_token');

  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const queryString = params.toString();
  const url = isAuthorized ? `/schedule/user${queryString ? `?${queryString}` : ''}` : null;

  const { data, error, isLoading, mutate } = useSWR<ScheduleItem[]>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    schedule: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
