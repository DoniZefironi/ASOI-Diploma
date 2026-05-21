// shared/api/admin/assignments.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const BASE = '/assignments';
const FETCH_KEY = `${BASE}?limit=1000`;

const fetcher = (url: string) => apiClient.get(url);

export interface Assignment {
  id: number;
  title: string;
  description: string;
  type: string;
  maxScore: number;
  deadline: string;
  isActive: boolean;
  courseGroupId: number;
  courseGroup?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export function useAssignments() {
  const { data, error, isLoading, mutate } = useSWR<Assignment[]>(
    FETCH_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const { trigger: createAssignment, isMutating: isCreating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: any }) => apiClient.post(BASE, arg),
    { onSuccess: () => mutate() }
  );

  const { trigger: updateAssignment, isMutating: isUpdating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: { id: number; data: any } }) => apiClient.put(`${BASE}/${arg.id}`, arg.data),
    { onSuccess: () => mutate() }
  );

  const { trigger: deleteAssignment, isMutating: isDeleting } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: number }) => apiClient.delete(`${BASE}/${arg}`),
    {
      onSuccess: (deletedId) => {
        mutate(
          (currentData: Assignment[] | undefined) =>
            currentData ? currentData.filter((a: Assignment) => a.id !== deletedId) : [],
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
