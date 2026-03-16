// shared/api/admin/registrations.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';
import { User } from './users';
import { CourseGroup } from './course-groups';

const fetcher = (url: string) => apiClient.get(url);

export interface AdminCourseRegistration {
  id: number;
  user: User;
  courseGroup: CourseGroup;
  userId: number;
  courseGroupId: number;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: number;
}

export interface UserCourseRegistration {
  id: number;
  user: User;
  courseGroup: CourseGroup;
  userId: number;
  courseGroupId: number;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  approvedAt?: string;
  approvedBy?: number;
}

export function useAdminCourseRegistrations() {
  const { data, error, isLoading, mutate } = useSWR<AdminCourseRegistration[]>(
    '/course-groups/registrations/all',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    registrations: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useUserCourseRegistrations() {
  const { data, error, isLoading, mutate } = useSWR<UserCourseRegistration[]>(
    '/course-groups/user/registrations',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    registrations: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useUserApprovedCourses() {
  const { registrations, isLoading, isError } = useUserCourseRegistrations();

  // Фильтруем по статусу approved (независимо от регистра)
  const approvedCourses = registrations?.filter(reg => 
    reg.status?.toLowerCase() === 'approved'
  );

  return {
    courses: approvedCourses,
    isLoading,
    isError,
  };
}

export function useInformaticsCourseRegistration() {
  const { registrations, isLoading, isError } = useUserCourseRegistrations();

  const getCurrentUserId = (): number | null => {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id ? parseInt(user.id) : null;
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  const informaticsRegistration = registrations?.find(registration => {
    const isCurrentUser = registration.userId === currentUserId;

    const isInformaticsCourse =
      registration.courseGroup.course.name.toLowerCase().includes('информатик') ||
      registration.courseGroup.course.name.toLowerCase().includes('informatics') ||
      registration.courseGroup.course.name.toLowerCase().includes('программирование') ||
      registration.courseGroup.course.name.toLowerCase().includes('programming');

    return isCurrentUser && isInformaticsCourse;
  });

  // Проверяем статус независимо от регистра
  const status = informaticsRegistration?.status?.toLowerCase();

  return {
    registration: informaticsRegistration,
    isLoading,
    isError,
    hasAccess: status === 'approved',
    isPending: status === 'pending',
    isRejected: status === 'rejected',
    currentUserId
  };
}

export function useApproveRegistration() {
  const { mutate: mutateRegistrations } = useAdminCourseRegistrations();

  const { trigger: approve, isMutating: isApproving } = useSWRMutation(
    '/course-groups/registrations',
    async (url, { arg }: { arg: number }) => {
      const result = await apiClient.patch(`${url}/${arg}/approve`, {});
      return result.data;
    },
    {
      onSuccess: () => {
        mutateRegistrations();
      },
    }
  );

  return {
    approve,
    isApproving,
  };
}

export function useRejectRegistration() {
  const { mutate: mutateRegistrations } = useAdminCourseRegistrations();

  const { trigger: reject, isMutating: isRejecting } = useSWRMutation(
    '/course-groups/registrations',
    async (url, { arg }: { arg: number }) => {
      const result = await apiClient.patch(`${url}/${arg}/reject`, {});
      return result.data;
    },
    {
      onSuccess: () => {
        mutateRegistrations();
      },
    }
  );

  return {
    reject,
    isRejecting,
  };
}