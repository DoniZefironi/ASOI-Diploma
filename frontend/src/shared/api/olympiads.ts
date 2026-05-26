import { apiClient } from './client';

export interface OlympiadProblem {
  id: number;
  olympiadId: number;
  title: string;
  description: string;
  inputDescription?: string;
  outputDescription?: string;
  examples: { input: string; output: string; explanation?: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  orderIndex: number;
}

export interface Olympiad {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  allowedLanguages: string[];
  isActive: boolean;
  courseId?: number;
  course?: { id: number; name: string };
  createdAt: string;
  problems: OlympiadProblem[];
}

export interface OlympiadSubmission {
  id: number;
  olympiadId: number;
  problemId: number;
  userId: number;
  language: string;
  code: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'error';
  score: number;
  errorMessage?: string | null;
  createdAt: string;
  problem?: { id: number; title: string };
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  solved: number;
  score: number;
}

export const olympiadsApi = {
  // ── Student ──────────────────────────────────────────────────────
  getAll(): Promise<Olympiad[]> {
    return apiClient.get('/olympiads');
  },
  getOne(id: number): Promise<Olympiad> {
    return apiClient.get(`/olympiads/${id}`);
  },
  getMySubmissions(olympiadId: number): Promise<OlympiadSubmission[]> {
    return apiClient.get(`/olympiads/${olympiadId}/my-submissions`);
  },
  getLeaderboard(olympiadId: number): Promise<LeaderboardEntry[]> {
    return apiClient.get(`/olympiads/${olympiadId}/leaderboard`);
  },
  submit(olympiadId: number, problemId: number, payload: { language: string; code: string }) {
    return apiClient.post(`/olympiads/${olympiadId}/problems/${problemId}/submit`, payload);
  },

  // ── Mentor / Admin ───────────────────────────────────────────────
  getAllAdmin(): Promise<Olympiad[]> {
    return apiClient.get('/olympiads/admin/all');
  },
  create(payload: Partial<Olympiad>) {
    return apiClient.post('/olympiads', payload);
  },
  update(id: number, payload: Partial<Olympiad>) {
    return apiClient.put(`/olympiads/${id}`, payload);
  },
  remove(id: number) {
    return apiClient.delete(`/olympiads/${id}`);
  },
  addProblem(olympiadId: number, payload: Partial<OlympiadProblem>) {
    return apiClient.post(`/olympiads/${olympiadId}/problems`, payload);
  },
  updateProblem(olympiadId: number, problemId: number, payload: Partial<OlympiadProblem>) {
    return apiClient.put(`/olympiads/${olympiadId}/problems/${problemId}`, payload);
  },
  removeProblem(olympiadId: number, problemId: number) {
    return apiClient.delete(`/olympiads/${olympiadId}/problems/${problemId}`);
  },
  getAllSubmissions(olympiadId: number): Promise<OlympiadSubmission[]> {
    return apiClient.get(`/olympiads/${olympiadId}/submissions`);
  },
};
