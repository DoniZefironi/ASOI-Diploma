// shared/api/admin.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from './client';

const fetcher = (url: string) => apiClient.get(url);

const createMutation = (url: string, { arg }: { arg: any }) => 
  apiClient.post(url, arg);

const updateMutation = (url: string, { arg }: { arg: { id: number; data: any } }) => 
  apiClient.put(`${url}/${arg.id}`, arg.data);

const updateRolesMutation = (url: string, { arg }: { arg: { id: number; roles: string[] } }) => 
  apiClient.put(`${url}/${arg.id}/roles`, { roles: arg.roles });

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

interface CourseGroup {
  id: number;
  name: string;
  courseId: number;
  maxStudents: number;
  currentStudents?: number; 
  startDate: string; 
  endDate: string;
}

interface CourseRegistration {
  id: number;
  userId: number;
  courseGroupId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string; 
  courseGroup: CourseGroup;
}

interface RegisterToCourseDto {
  courseGroupId: number;
}

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

  const mentors = data?.filter((user: any) => {

    const roles = user.roles || user.userRoles || [];

    return roles.some((role: any) => {
      const roleName = role.name || role.role || role.roleName || '';
      return roleName.toUpperCase() === 'MENTOR';
    });
  }) || [];

  return {
    users: data,
    mentors, 
    isLoading,
    isError: error,
    mutate,
    updateUser,
    updateUserRoles,
    isUpdating: isUpdating || isUpdatingRoles,
  };
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

export function useCourseGroups(courseId?: number) { 
  const url = courseId ? `/course-groups?courseId=${courseId}` : '/course-groups';
  const { data, error, isLoading, mutate } = useSWR<CourseGroup[]>(
    url,
    fetcher
  );

  return {
    groups: data,
    isLoading,
    error, 
    isError: error, 
    mutate,
  };
}

export function useRegisterToCourse() {
  const { mutate: mutateRegistrations } = useUserRegistrations();
  
  const { trigger, isMutating } = useSWRMutation(
    '/course-groups/register',
    async (url, { arg }: { arg: RegisterToCourseDto }) => {
      const result = await apiClient.post(url, arg);
      return result;
    },
    {
      onSuccess: () => {
        mutateRegistrations();
      },
    }
  );

  return {
    register: trigger,
    isRegistering: isMutating,
  };
}

export function useUserRegistrations() {
  const { data, error, isLoading, mutate } = useSWR<CourseRegistration[]>(
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