// shared/api/admin/peer-reviews.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const fetcher = (url: string) => apiClient.get(url);

const postMutation = (url: string, { arg }: { arg: any }) =>
  apiClient.post(url, arg);

export interface ReviewCriterion {
  name: string;
  maxScore: number;
  description?: string;
}

export interface CriterionScore {
  name: string;
  score: number;
  maxScore: number;
}

export interface PeerReviewSession {
  id: number;
  title: string;
  description?: string;
  assignmentId: number;
  courseGroupId: number;
  startDate: string;
  endDate: string;
  reviewsPerStudent: number;
  criteria: ReviewCriterion[] | null;
  isDistributed: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface PeerReview {
  id: number;
  reviewId?: number;
  submissionId: number;
  assignmentId?: number;
  assignmentTitle?: string;
  studentName?: string;
  content?: string;
  repositoryUrl?: string;
  attachments?: string[];
  isCompleted: boolean;
  score?: number;
  criteriaScores?: CriterionScore[];
  feedback?: string;
  reviewerName?: string;
  createdAt?: string;
  // Structured criteria from session
  criteria?: ReviewCriterion[] | null;
  sessionId?: number | null;
  // Legacy text criteria
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

/**
 * Получить peer review сессии для задания
 */
export function usePeerReviewSessions(assignmentId?: number) {
  const { data, error, isLoading, mutate } = useSWR<PeerReviewSession[]>(
    assignmentId ? `/peer-review-sessions/assignment/${assignmentId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    sessions: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Создать peer review сессию
 */
export function useCreatePeerReviewSession() {
  const { trigger, isMutating } = useSWRMutation(
    '/peer-review-sessions',
    postMutation
  );
  return { createSession: trigger, isCreating: isMutating };
}

/**
 * Запустить распределение рецензий для сессии
 */
export function useAssignPeerReviewsBySession() {
  const { trigger, isMutating } = useSWRMutation(
    '/peer-review-sessions/_assign',
    (_, { arg }: { arg: { sessionId: number } }) =>
      apiClient.post(`/peer-review-sessions/${arg.sessionId}/assign`, {})
  );
  return { assignReviews: trigger, isAssigning: isMutating };
}

export interface SessionStats {
  submissionId: number;
  studentName: string;
  totalReviews: number;
  completedReviews: number;
  averageScore: number | null;
  finalScore?: number | null;
  status: string;
}

/**
 * Получить статистику сессии (для ментора)
 */
export function useSessionStats(sessionId?: number) {
  const { data, error, isLoading, mutate } = useSWR<SessionStats[]>(
    sessionId ? `/peer-review-sessions/${sessionId}/stats` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { stats: data || [], isLoading, isError: error, mutate };
}

export interface ReceivedReviewEntry {
  id: number;
  score: number | null;
  criteriaScores?: CriterionScore[];
  feedback?: string;
  createdAt: string;
}

export interface ReceivedReviewGroup {
  submissionId: number;
  assignmentId?: number;
  assignmentTitle?: string;
  finalScore?: number | null;
  status: string;
  reviews: ReceivedReviewEntry[];
  totalReviews: number;
  completedReviews: number;
}

/**
 * Получить все рецензии, которые студент получил на свои работы
 */
export function useMyReceivedReviews() {
  const { data, error, isLoading, mutate } = useSWR<ReceivedReviewGroup[]>(
    '/peer-reviews/my-received',
    fetcher,
    { revalidateOnFocus: false }
  );
  return { received: data || [], isLoading, isError: error, mutate };
}
