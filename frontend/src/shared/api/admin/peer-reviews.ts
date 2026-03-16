// shared/api/admin/peer-reviews.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const fetcher = (url: string) => apiClient.get(url);

const postMutation = (url: string, { arg }: { arg: any }) =>
  apiClient.post(url, arg);

export interface PeerReview {
  id: number;
  reviewId?: number;
  submissionId: number;
  assignmentId?: number;
  assignmentTitle?: string;
  studentName?: string;
  content?: string;
  attachments?: string[];
  isCompleted: boolean;
  score?: number;
  feedback?: string;
  reviewerName?: string;
  createdAt?: string;
  // Критерии проверки
  peerReviewCriteria?: string;
  peerReviewEnabled?: boolean;
}

export interface PeerReviewStats {
  submissionId: number;
  studentName: string;
  totalReviews: number;
  completedReviews: number;
  averageScore: number | null;
}

/**
 * Получить работы которые нужно проверить
 */
export function usePeerReviewsToReview() {
  const { data, error, isLoading, mutate } = useSWR<PeerReview[]>(
    '/peer-reviews/to-review',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    reviews: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Получить рецензии на submission
 */
export function usePeerReviewsForSubmission(submissionId?: number) {
  const { data, error, isLoading, mutate } = useSWR<PeerReview[]>(
    submissionId ? `/peer-reviews/submission/${submissionId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    reviews: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Создать или обновить рецензию
 */
export function useCreatePeerReview() {
  const { trigger, isMutating } = useSWRMutation(
    '/peer-reviews',
    postMutation
  );

  return {
    createReview: trigger,
    isSubmitting: isMutating,
  };
}

/**
 * Назначить peer review для задания
 */
export function useAssignPeerReviews() {
  const { trigger, isMutating } = useSWRMutation(
    '/peer-reviews/assign',
    postMutation
  );

  return {
    assignReviews: trigger,
    isSubmitting: isMutating,
  };
}

/**
 * Получить статистику peer review для задания
 */
export function usePeerReviewStats(assignmentId?: number) {
  const { data, error, isLoading, mutate } = useSWR<PeerReviewStats[]>(
    assignmentId ? `/peer-reviews/stats/${assignmentId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    stats: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
