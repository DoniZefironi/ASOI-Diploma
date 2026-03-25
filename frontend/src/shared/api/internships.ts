import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
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

export interface InternshipApplication {
  id: number;
  userId: number;
  internshipId: number;
  appliedAt: string;
  comment?: string;
}

export interface InternshipStat {
  internshipId: number;
  internshipTitle: string;
  company: string;
  views: number;
  applications: number;
  conversionRate: number;
  lastViewedAt?: string;
  lastAppliedAt?: string;
}

export interface InternshipApplicationRecord {
  id: number;
  userId: number;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  internshipId: number;
  internshipTitle: string;
  company: string;
  appliedAt: string;
  comment?: string;
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

export function useInternshipStats() {
  const { data, error, mutate } = useSWR<InternshipStat[]>('/internships/admin/stats', (url: string) => apiClient.get(url));
  return { stats: data ?? [], isLoading: !error && !data, isError: !!error, mutate };
}

export function useInternshipApplications() {
  const { data, error, mutate } = useSWR<InternshipApplicationRecord[]>('/internships/admin/applications', (url: string) => apiClient.get(url));
  return { applications: data ?? [], isLoading: !error && !data, isError: !!error, mutate };
}

export async function trackInternshipView(internshipId: number) {
  return apiClient.post(`/internships/${internshipId}/view`, {});
}

export async function applyToInternship(internshipId: number, comment?: string) {
  return apiClient.post(`/internships/${internshipId}/apply`, { comment });
}

export async function getUserApplication(internshipId: number) {
  return apiClient.get(`/internships/${internshipId}/application`);
}

export function useApplyToInternship() {
  const { trigger, isMutating } = useSWRMutation(
    '/internships/apply',
    (url: string, { arg }: { arg: { internshipId: number; comment?: string } }) =>
      applyToInternship(arg.internshipId, arg.comment),
  );
  return { apply: trigger, isApplying: isMutating };
}
