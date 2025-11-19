// shared/api/admin/assignments.ts
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

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO string
  courseId: number;
}

export function useAssignments() {
  const { data, error, isLoading, mutate } = useSWR<Assignment[]>(
    '/assignments',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const { trigger: createAssignment, isMutating: isCreating } = useSWRMutation(
    '/assignments',
    createMutation,
    {
      onSuccess: () => {
        mutate();
      },
    }
  );

  const { trigger: updateAssignment, isMutating: isUpdating } = useSWRMutation(
    '/assignments',
    updateMutation,
    {
      onSuccess: () => {
        mutate();
      },
    }
  );

  const { trigger: deleteAssignment, isMutating: isDeleting } = useSWRMutation(
    '/assignments',
    deleteMutation,
    {
      onSuccess: (deletedId) => {
        // Проверяем, что currentData не undefined перед фильтрацией
        mutate((currentData: Assignment[] | undefined) =>
          currentData ? currentData.filter((assignment: Assignment) => assignment.id !== deletedId) : [],
          false
        );
      },
    }
  );

  return {
    assignments: data || [],
    isLoading,
    isError: error,
    mutate,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    isCreating,
    isUpdating,
    isDeleting,
  };
}