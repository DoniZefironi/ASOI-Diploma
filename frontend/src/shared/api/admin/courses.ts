// shared/api/admin/courses.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const BASE = '/courses';
const FETCH_KEY = `${BASE}?limit=1000`;

const fetcher = (url: string) => apiClient.get(url);

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
    FETCH_KEY,
    fetcher
  );

  const { trigger: createCourse, isMutating: isCreating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: any }) => apiClient.post(BASE, arg)
  );

  const { trigger: updateCourse, isMutating: isUpdating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: { id: number; data: any } }) => apiClient.put(`${BASE}/${arg.id}`, arg.data)
  );

  const { trigger: deleteCourse, isMutating: isDeleting } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: number }) => apiClient.delete(`${BASE}/${arg}`)
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
