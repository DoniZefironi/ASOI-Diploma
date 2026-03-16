// shared/api/admin/schedule.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const fetcher = (url: string) => apiClient.get(url);

const createMutation = (url: string, { arg }: { arg: any }) =>
  apiClient.post(url, arg);

const updateMutation = (url: string, { arg }: { arg: { id: number; data: any } }) =>
  apiClient.put(`${url}/${arg.id}`, arg.data);

const deleteMutation = (url: string, { arg }: { arg: number }) =>
  apiClient.delete(`${url}/${arg}`);

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
    '/schedule',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const { trigger: createScheduleItem, isMutating: isCreating } = useSWRMutation(
    '/schedule',
    createMutation,
    {
      onSuccess: () => {
        mutate();
      },
    }
  );

  const { trigger: updateScheduleItem, isMutating: isUpdating } = useSWRMutation(
    '/schedule',
    updateMutation,
    {
      onSuccess: () => {
        mutate();
      },
    }
  );

  const { trigger: deleteScheduleItem, isMutating: isDeleting } = useSWRMutation(
    '/schedule',
    deleteMutation,
    {
      onSuccess: (deletedId) => {
        mutate((currentData: ScheduleItem[] | undefined) =>
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