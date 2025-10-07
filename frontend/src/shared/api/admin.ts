// lib/api/admin.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from './client';

// Фетчер для SWR
const fetcher = (url: string) => apiClient.get(url);

// Мутации для POST/PUT/DELETE
const createMutation = (url: string, { arg }: { arg: any }) => 
  apiClient.post(url, arg);

// ИСПРАВЛЕНО: put принимает только endpoint и data
const updateMutation = (url: string, { arg }: { arg: { id: number; data: any } }) => 
  apiClient.put(`${url}/${arg.id}`, arg.data); // Объединяем URL

const deleteMutation = (url: string, { arg }: { arg: number }) => 
  apiClient.delete(`${url}/${arg}`);

// Хуки для пользователей
export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR(
    '/users',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  // ИСПРАВЛЕНО: используем правильную мутацию
  const { trigger: updateUser } = useSWRMutation(
    '/users',
    updateMutation
  );

  return {
    users: data,
    isLoading,
    isError: error,
    mutate,
    updateUser, // Переименовал для ясности
  };
}

// Хуки для курсов
export function useCourses() {
  const { data, error, isLoading, mutate } = useSWR(
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

// Хуки для групп
export function useCourseGroups() {
  const { data, error, isLoading, mutate } = useSWR(
    '/course-groups',
    fetcher
  );

  const { trigger: createGroup } = useSWRMutation(
    '/course-groups',
    createMutation
  );

  const { trigger: updateGroup } = useSWRMutation(
    '/course-groups',
    updateMutation
  );

  const { trigger: deleteGroup } = useSWRMutation(
    '/course-groups',
    deleteMutation
  );

  const { trigger: approveRegistration } = useSWRMutation(
    '/course-groups/registrations',
    (url, { arg }: { arg: number }) => 
      apiClient.patch(`${url}/${arg}/approve`, {})
  );

  return {
    groups: data,
    isLoading,
    isError: error,
    mutate,
    createGroup,
    updateGroup,
    deleteGroup,
    approveRegistration,
  };
}