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
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  courseId: number;
  groupId?: number;
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
        // Проверяем, что currentData не undefined перед фильтрацией
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