// src/shared/api/admin/professional-orientation.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const fetcher = (url: string) => apiClient.get(url);

export interface ProfessionalOrientationResult {
  id: number;
  userId: number;
  recommendedProfession: string;
  createdAt: string;
}

// --- ОПРЕДЕЛЯЕМ интерфейс на фронтенде ---
export interface ProfessionStat {
  profession: string;
  count: number;
}
// --- КОНЕЦ ОПРЕДЕЛЕНИЯ ---

export function useProfessionalOrientation() {
  return useSWR<ProfessionalOrientationResult>('/professional-orientation', fetcher);
}

export function useSubmitProfessionalOrientation() {
  const { mutate } = useProfessionalOrientation();

  const { trigger, isMutating } = useSWRMutation(
    '/professional-orientation',
    (url, { arg }: { arg: { recommendedProfession: string } }) => {
      return apiClient.post(url, arg);
    },
    {
      onSuccess: () => {
        mutate(); // Обновить данные после отправки
      },
    }
  );

  return {
    submit: trigger,
    isSubmitting: isMutating,
  };
}

// --- ИСПОЛЬЗУЕМ интерфейс ---
export function useProfessionStats() {
  const { data, error, isLoading } = useSWR<ProfessionStat[]>('/professional-orientation/admin/stats', fetcher);

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}
// --- КОНЕЦ ИСПОЛЬЗОВАНИЯ ---