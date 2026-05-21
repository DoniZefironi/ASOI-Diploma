// shared/api/admin/materials.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const BASE = '/materials';
const FETCH_KEY = `${BASE}?limit=1000`;

const fetcher = (url: string) => apiClient.get(url);

export interface Material {
  id: number;
  title: string;
  description: string;
  url: string;
  courseId: number;
}

export function useMaterials() {
  const { data, error, isLoading, mutate } = useSWR<Material[]>(
    FETCH_KEY,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const { trigger: createMaterial, isMutating: isCreating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: any }) => apiClient.post(BASE, arg),
    { onSuccess: () => mutate() }
  );

  const { trigger: updateMaterial, isMutating: isUpdating } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: { id: number; data: any } }) => apiClient.put(`${BASE}/${arg.id}`, arg.data),
    { onSuccess: () => mutate() }
  );

  const { trigger: deleteMaterial, isMutating: isDeleting } = useSWRMutation(
    FETCH_KEY,
    (_key: string, { arg }: { arg: number }) => apiClient.delete(`${BASE}/${arg}`),
    {
      onSuccess: (deletedId) => {
        mutate(
          (currentData: Material[] | undefined) =>
            currentData ? currentData.filter((m: Material) => m.id !== deletedId) : [],
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
