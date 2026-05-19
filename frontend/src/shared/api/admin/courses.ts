// shared/api/admin/courses.ts
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

export interface Course {
  id: number;
  name: string;
  type: string;
  description: string;
  duration: number;
  imageUrl: string;
  isActive: boolean;
}

export function useCourses() {
  const { data, error, isLoading, mutate } = useSWR<Course[] | undefined>(
    '/courses',
    fetcher
  );

  const { trigger: createCourse, isMutating: isCreating } = useSWRMutation(
    '/courses',
    createMutation
  );

  const { trigger: updateCourse, isMutating: isUpdating } = useSWRMutation(
    '/courses',
    updateMutation
  );

  const { trigger: deleteCourse, isMutating: isDeleting } = useSWRMutation(
    '/courses',
    deleteMutation
  );

  return {
    courses: data,
    isLoading,
    isError: error,
    mutate,
    createCourse,
    updateCourse,
    deleteCourse,
    isCreating,
    isUpdating,
    isDeleting,
  };
}