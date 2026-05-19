// shared/api/admin/materials.ts
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

export interface Material {
  id: number;
  title: string;
  description: string;
  url: string;
  courseId: number;
}

export function useMaterials() {
  const { data, error, isLoading, mutate } = useSWR<Material[]>(
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
        mutate((currentData: Material[] | undefined) =>
          currentData ? currentData.filter((material: Material) => material.id !== deletedId) : [],
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