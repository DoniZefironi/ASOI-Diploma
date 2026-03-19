import useSWR from 'swr';
import { apiClient } from './client';

export interface Internship {
  id: number;
  title: string;
  company: string;
  companyDescription?: string;
  description: string;
  requirements?: string;
  prospects?: string;
  location?: string;
  format: 'remote' | 'office' | 'hybrid';
  duration?: string;
  salary?: string;
  applicationEmail?: string;
  applicationUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  deadline?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export function useInternships() {
  const { data, error, mutate } = useSWR<Internship[]>('/internships', (url: string) => apiClient.get(url));
  return { internships: data ?? [], isLoading: !error && !data, isError: !!error, mutate };
}

export function useInternship(id: number) {
  const { data, error, mutate } = useSWR<Internship>(`/internships/${id}`, (url: string) => apiClient.get(url));
  return { internship: data, isLoading: !error && !data, isError: !!error, mutate };
}

export function useAdminInternships() {
  const { data, error, mutate } = useSWR<Internship[]>('/internships/admin/all', (url: string) => apiClient.get(url));
  return { internships: data ?? [], isLoading: !error && !data, isError: !!error, mutate };
}
