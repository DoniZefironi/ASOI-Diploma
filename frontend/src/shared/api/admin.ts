// shared/api/admin.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from './client';

// Фетчер для SWR
const fetcher = (url: string) => apiClient.get(url);

// Мутации для POST/PUT/DELETE
const createMutation = (url: string, { arg }: { arg: any }) => 
  apiClient.post(url, arg);

const updateMutation = (url: string, { arg }: { arg: { id: number; data: any } }) => 
  apiClient.put(`${url}/${arg.id}`, arg.data);

// Специальная мутация для обновления ролей
const updateRolesMutation = (url: string, { arg }: { arg: { id: number; roles: string[] } }) => 
  apiClient.put(`${url}/${arg.id}/roles`, { roles: arg.roles });

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

  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    '/users',
    updateMutation
  );

  const { trigger: updateUserRoles, isMutating: isUpdatingRoles } = useSWRMutation(
    '/users',
    updateRolesMutation
  );

  // Фильтруем менторов на клиенте
  const mentors = data?.filter((user: any) => {
    // Проверяем разные возможные структуры ролей
    const roles = user.roles || user.userRoles || [];
    
    // Ищем роль MENTOR в разных форматах
    return roles.some((role: any) => {
      const roleName = role.name || role.role || role.roleName || '';
      return roleName.toUpperCase() === 'MENTOR';
    });
  }) || [];

  return {
    users: data,
    mentors, // Добавляем отдельный список менторов
    isLoading,
    isError: error,
    mutate,
    updateUser,
    updateUserRoles,
    isUpdating: isUpdating || isUpdatingRoles,
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

// Хуки для заданий
export function useAssignments() {
  const { data, error, isLoading, mutate } = useSWR(
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
        mutate((currentData: any[]) => 
          currentData?.filter((assignment: any) => assignment.id !== deletedId) || [], 
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

// Хуки для материалов
export function useMaterials() {
  const { data, error, isLoading, mutate } = useSWR(
    '/materials',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const { trigger: createMaterial, isMutating: isCreating } = useSWRMutation(
    '/materials',
    createMutation,
    {
      onSuccess: () => {
        mutate();
      },
    }
  );

  const { trigger: updateMaterial, isMutating: isUpdating } = useSWRMutation(
    '/materials',
    updateMutation,
    {
      onSuccess: () => {
        mutate();
      },
    }
  );

  const { trigger: deleteMaterial, isMutating: isDeleting } = useSWRMutation(
    '/materials',
    deleteMutation,
    {
      onSuccess: (deletedId) => {
        mutate((currentData: any[]) => 
          currentData?.filter((material: any) => material.id !== deletedId) || [], 
          false
        );
      },
    }
  );

  return {
    materials: data || [],
    isLoading,
    isError: error,
    mutate,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// Хуки для расписания
export function useSchedule() {
  const { data, error, isLoading, mutate } = useSWR(
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
        mutate((currentData: any[]) => 
          currentData?.filter((item: any) => item.id !== deletedId) || [], 
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

// Хуки для статистики
export function useAdminStats() {
  const { data, error, isLoading } = useSWR(
    '/admin/stats',
    fetcher,
    {
      refreshInterval: 30000,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}