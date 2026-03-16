// shared/api/admin/course-groups.ts
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

export interface GroupCourse {
  id: number;
  name: string;
}

export interface CourseGroup {
  id: number;
  name: string;
  courseId: number;
  year: number; 
  semester: number; 
  isActive: boolean; 
  maxStudents: number;
  currentStudents?: number;
  startDate: string; 
  endDate: string;   
  course: GroupCourse;
  registrations?: any[]; 
}

export interface RegisterToCourseDto {
  courseGroupId: number;
}

export function useCourseGroups(courseId?: number) {
  const url = courseId ? `/course-groups/course/${courseId}` : '/course-groups';

  const { data, error, isLoading, mutate } = useSWR<CourseGroup[]>(
    url,
    fetcher,
    {
      fallbackData: [],
    }
  );

  const { trigger: createGroup, isMutating: isCreating } = useSWRMutation(
    '/course-groups',
    createMutation,
    {
      onSuccess: () => {
        mutate(); 
      },
    }
  );

  const { trigger: updateGroup, isMutating: isUpdating } = useSWRMutation(
    '/course-groups',
    updateMutation,
    {
      onSuccess: () => {
        mutate(); 
      },
    }
  );

  const { trigger: deleteGroup, isMutating: isDeleting } = useSWRMutation(
    '/course-groups',
    deleteMutation,
    {
      onSuccess: () => {
        mutate(); 
      },
    }
  );

  return {
    groups: data || [],
    isLoading,
    error,
    isError: error,
    mutate,
    createGroup,
    updateGroup,
    deleteGroup,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

export function useRegisterToCourse() {
  const { mutate: mutateUserRegistrations } = useUserRegistrations();

  const { trigger, isMutating } = useSWRMutation(
    '/course-groups/register',
    async (url, { arg }: { arg: RegisterToCourseDto }) => {
      try {
        const result = await apiClient.post(url, arg);
        // После успешной регистрации обновляем данные
        await mutateUserRegistrations();
        return result;
      } catch (error: any) {
        // Пробрасываем ошибку дальше для обработки в компоненте
        throw error;
      }
    }
  );

  return {
    register: trigger,
    isRegistering: isMutating,
  };
}

interface UserCourseRegistration {
  id: number;
  userId: number;
  courseGroupId: number;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  courseGroup: CourseGroup;
}

export interface StudentRating {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  averageScore: number;
  completedAssignments: number;
}

export function useUserRegistrations() {
  // Проверяем, авторизован ли пользователь
  const isAuthorized = typeof window !== 'undefined' && !!localStorage.getItem('access_token');

  const { data, error, isLoading, mutate } = useSWR<UserCourseRegistration[]>(
    isAuthorized ? '/course-groups/user/registrations' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000,
      refreshInterval: 0,
      fallbackData: [],
    }
  );

  return {
    registrations: data || [],
    isLoading,
    error,
    isError: error,
    mutate,
  };
}

export function useGroupStudentsRating(groupId: number) {
  const { data, error, isLoading, mutate } = useSWR<StudentRating[]>(
    groupId ? `/course-groups/${groupId}/students/rating` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      fallbackData: [],
    }
  );

  return {
    students: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}