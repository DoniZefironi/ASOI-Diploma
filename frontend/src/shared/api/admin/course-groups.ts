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
  year: number; // Добавлено
  semester: number; // Добавлено
  isActive: boolean; // Добавлено
  maxStudents: number;
  currentStudents?: number;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  course: GroupCourse;
  registrations?: any[]; // Добавлено для отображения количества студентов
}

export interface RegisterToCourseDto {
  courseGroupId: number;
}

export function useCourseGroups(courseId?: number) {
  const url = courseId ? `/course-groups?courseId=${courseId}` : '/course-groups';
  
  const { data, error, isLoading, mutate } = useSWR<CourseGroup[]>(
    url,
    fetcher
  );

  // Мутация для создания группы
  const { trigger: createGroup, isMutating: isCreating } = useSWRMutation(
    '/course-groups',
    createMutation,
    {
      onSuccess: () => {
        mutate(); // Перезапрашиваем данные после создания
      },
    }
  );

  // Мутация для обновления группы
  const { trigger: updateGroup, isMutating: isUpdating } = useSWRMutation(
    '/course-groups',
    updateMutation,
    {
      onSuccess: () => {
        mutate(); // Перезапрашиваем данные после обновления
      },
    }
  );

  // Мутация для удаления группы
  const { trigger: deleteGroup, isMutating: isDeleting } = useSWRMutation(
    '/course-groups',
    deleteMutation,
    {
      onSuccess: () => {
        mutate(); // Перезапрашиваем данные после удаления
      },
    }
  );

  return {
    groups: data || [],
    isLoading,
    error,
    isError: error,
    mutate,
    // Добавляем функции мутаций
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
      const result = await apiClient.post(url, arg);
      return result;
    },
    {
      onSuccess: () => {
        mutateUserRegistrations();
      },
    }
  );

  return {
    register: trigger,
    isRegistering: isMutating,
  };
}

// Тип для регистрации пользователя (для useUserRegistrations)
interface UserCourseRegistration {
  id: number;
  userId: number;
  courseGroupId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  courseGroup: CourseGroup;
}

export function useUserRegistrations() {
  const { data, error, isLoading, mutate } = useSWR<UserCourseRegistration[]>(
    '/course-groups/user/registrations',
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    registrations: data,
    isLoading,
    error,
    isError: error,
    mutate,
  };
}