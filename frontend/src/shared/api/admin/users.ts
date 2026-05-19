// shared/api/admin/users.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const fetcher = (url: string) => apiClient.get(url);

const updateMutation = (url: string, { arg }: { arg: { id: number; data: any } }) =>
  apiClient.put(`${url}/${arg.id}`, arg.data);

const updateRolesMutation = (url: string, { arg }: { arg: { id: number; roles: string[] } }) =>
  apiClient.put(`${url}/${arg.id}/roles`, { roles: arg.roles });

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: any[]; 
  isActive: boolean;
  createdAt: string; 
}

export function useUsers(endpoint: string = '/users') {
  const { data, error, isLoading, mutate } = useSWR<User[] | undefined>(
    endpoint,
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

  const mentors = endpoint === '/users/mentors' 
    ? data 
    : data?.filter((user: any) => {
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