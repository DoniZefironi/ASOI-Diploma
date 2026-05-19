'use client';
import useSWR from 'swr';
import { apiClient } from '@/shared/api/client';

const fetcher = (url: string) => apiClient.get(url);

export interface Elective {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  courseGroupId: number;
  courseGroupName?: string;
  courseName?: string;
  instructorName?: string;
  startDate?: string;
  endDate?: string;
  maxParticipants?: number;
  currentParticipants: number;
  isEnrolled: boolean;
}

export interface ElectiveDetail extends Elective {
  enrollments?: any[];
  isActive: boolean;
}

export function useElectives() {
  const { data, error, isLoading, mutate } = useSWR<Elective[]>('/electives', fetcher);
  return { electives: data || [], isLoading, isError: error, mutate };
}

export function useElective(id?: number) {
  const { data, error, isLoading, mutate } = useSWR<ElectiveDetail>(
    id ? `/electives/${id}` : null,
    fetcher
  );
  return { elective: data, isLoading, isError: error, mutate };
}

export async function enrollElective(id: number) {
  return apiClient.post(`/electives/${id}/enroll`, {});
}

export async function unenrollElective(id: number) {
  return apiClient.delete(`/electives/${id}/enroll`);
}
