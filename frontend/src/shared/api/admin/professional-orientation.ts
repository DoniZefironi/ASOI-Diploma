// src/shared/api/admin/professional-orientation.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiClient } from '../client';

const fetcher = (url: string) => apiClient.get(url);

export interface TestMeta {
  type: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  answerFormat: 'yes_no' | 'choice';
}

export interface CareerTestFull {
  id: number;
  type: string;
  title: string;
  description: string;
  duration: string;
  answerFormat: string;
  questions: any[];
  categoryMeta: Record<string, { label: string; description: string; careers: string[] }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestTypeResult {
  type: string;
  label: string;
  score: number;
  maxScore: number;
}

export interface TestResult {
  scores: Record<string, number>;
  topType: string;
  topTypeLabel: string;
  topTypeDescription: string;
  topCareers: string[];
  allTypes: TestTypeResult[];
}

export interface HollandQuestion {
  id: number;
  text: string;
  category: string;
}

export interface KlimovQuestion {
  id: number;
  a: { text: string; category: string };
  b: { text: string; category: string };
}

export interface ProfessionalOrientationRecord {
  id: number;
  userId: number;
  recommendedProfession: string;
  testResult: Record<string, TestResult>;
  createdAt: string;
}

export interface ProfessionStat {
  profession: string;
  count: number;
}

// ── Expert Analysis types ───────────────────────────────────────────────────

export interface ExpertCareer {
  title: string;
  emoji: string;
  confidence: number;
  description: string;
  skills: string[];
  tools: string[];
  salaryRange: string;
  demandLevel: string;
  growthPath: string[];
}

export interface ExpertAnalysis {
  hollandType: string;
  klimovType: string;
  hollandLabel: string;
  klimovLabel: string;
  hollandScores: Record<string, number>;
  klimovScores: Record<string, number>;
  topCareers: ExpertCareer[];
  personalityInsight: string;
}

// ── Student hooks ──────────────────────────────────────────────────────────

export function useTestList() {
  const { data, error, isLoading } = useSWR<TestMeta[]>('/professional-orientation/tests', fetcher);
  return { tests: data || [], isLoading, isError: error };
}

export function useTestQuestions(type: string | null) {
  const { data, error, isLoading } = useSWR(
    type ? `/professional-orientation/tests/${type}/questions` : null,
    fetcher,
  );
  return { data, isLoading, isError: error };
}

export function useProfessionalOrientation() {
  const { data, error, isLoading, mutate } = useSWR<ProfessionalOrientationRecord>(
    '/professional-orientation',
    fetcher,
  );
  return { result: data, isLoading, isError: error, mutate };
}

export async function submitTest(testType: string, answers: any[]) {
  return apiClient.post('/professional-orientation/tests/submit', { testType, answers });
}

/** Совместимость со старым ProfOrientationTestModal */
export function useSubmitProfessionalOrientation() {
  const { mutate } = useProfessionalOrientation();
  const { trigger, isMutating } = useSWRMutation(
    '/professional-orientation',
    (url: string, { arg }: { arg: { recommendedProfession: string } }) =>
      apiClient.post(url, arg),
    { onSuccess: () => mutate() },
  );
  return { submit: trigger, isSubmitting: isMutating };
}

export function useExpertAnalysis() {
  const { data, error, isLoading, mutate } = useSWR<ExpertAnalysis>(
    '/professional-orientation/expert-analysis',
    fetcher,
    { revalidateOnFocus: false },
  );
  return { analysis: data, isLoading, isError: error, mutate };
}

// ── Admin hooks ────────────────────────────────────────────────────────────

export function useAdminTests() {
  const { data, error, isLoading, mutate } = useSWR<CareerTestFull[]>(
    '/professional-orientation/admin/tests',
    fetcher,
  );
  return { tests: data || [], isLoading, isError: error, mutate };
}

export function useAdminTest(type: string | null) {
  const { data, error, isLoading, mutate } = useSWR<CareerTestFull>(
    type ? `/professional-orientation/admin/tests/${type}` : null,
    fetcher,
  );
  return { test: data, isLoading, isError: error, mutate };
}

export async function adminCreateTest(dto: Partial<CareerTestFull>) {
  return apiClient.post('/professional-orientation/admin/tests', dto);
}

export async function adminUpdateTest(type: string, dto: Partial<CareerTestFull>) {
  return apiClient.put(`/professional-orientation/admin/tests/${type}`, dto);
}

export async function adminDeleteTest(type: string) {
  return apiClient.delete(`/professional-orientation/admin/tests/${type}`);
}

export function useProfessionStats() {
  const { data, error, isLoading } = useSWR<ProfessionStat[]>(
    '/professional-orientation/admin/stats',
    fetcher,
  );
  return { stats: data, isLoading, isError: error };
}
