// src/shared/api/prof-orientation.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from './client';

const fetcher = (url: string) => apiClient.get(url);

export interface TraitScore {
  key: string;
  label: string;
  score: number;
}

export interface CareerMatch {
  career: {
    id: string;
    title: string;
    icon: string;
    description: string;
    skills: string[];
    tools: string[];
    salaryRange: string;
    demand: 'high' | 'medium' | 'low';
    growthPath: string[];
  };
  confidence: number;
  cf: number;
  firedRules: Array<{
    id: string;
    description: string;
    cf: number;
  }>;
  strengths: string[];
  gaps: string[];
}

export interface ExpertSystemResult {
  profileTitle: string;
  profileDescription: string;
  dominantTraits: string[];
  traitScores: Record<string, number>;
  topMatches: CareerMatch[];
}

export interface SubmitExpertResultDto {
  profileTitle: string;
  profileDescription: string;
  dominantTraits: string[];
  traitScores: Record<string, number>;
  topMatches: Array<{
    careerId: string;
    careerTitle: string;
    confidence: number;
  }>;
}

/**
 * Отправка результатов экспертной системы профориентации
 */
export async function submitExpertResult(dto: SubmitExpertResultDto) {
  return apiClient.post('/professional-orientation/expert-result', dto);
}

export function useSubmitExpertResult() {
  const { trigger, isMutating } = useSWRMutation(
    '/professional-orientation/expert-result',
    (url: string, { arg }: { arg: SubmitExpertResultDto }) =>
      apiClient.post(url, arg),
  );
  return { submit: trigger, isSubmitting: isMutating };
}

/**
 * Получение результатов пользователя
 */
export function useUserProfOrientation() {
  const { data, error, isLoading, mutate } = useSWR(
    '/professional-orientation',
    fetcher,
  );
  return { result: data, isLoading, isError: error, mutate };
}
