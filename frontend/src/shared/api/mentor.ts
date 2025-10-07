// lib/api/mentor.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from './client';

const fetcher = (url: string) => apiClient.get(url);
const createMutation = (url: string, { arg }: { arg: any }) => 
  apiClient.post(url, arg);

// Мои группы
export function useMyGroups() {
  const { data, error, isLoading, mutate } = useSWR(
    '/course-groups',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    groups: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Задания группы
export function useGroupAssignments(groupId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    groupId ? `/assignments/course-group/${groupId}` : null,
    fetcher
  );

  const { trigger: createAssignment, isMutating: isCreating } = useSWRMutation(
    '/assignments',
    createMutation
  );

  return {
    assignments: data,
    isLoading,
    isError: error,
    mutate,
    createAssignment,
    isCreating,
  };
}

// Отправленные работы
export function useAssignmentSubmissions(assignmentId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    assignmentId ? `/assignments/submissions/assignment/${assignmentId}` : null,
    fetcher
  );

  const { trigger: createReview } = useSWRMutation(
    '/assignments/peer-reviews',
    createMutation
  );

  const { trigger: calculateGrade } = useSWRMutation(
    '/assignments/submissions',
    (url, { arg }: { arg: number }) => 
      apiClient.post(`${url}/${arg}/final-grade`, {})
  );

  return {
    submissions: data,
    isLoading,
    isError: error,
    mutate,
    createReview,
    calculateGrade,
  };
}

// Оценки группы
export function useGroupGrades(groupId: number) {
  const { data, error, isLoading } = useSWR(
    groupId ? `/assignments/course-group/${groupId}/grades` : null,
    fetcher
  );

  return {
    grades: data,
    isLoading,
    isError: error,
  };
}