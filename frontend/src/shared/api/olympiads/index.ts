import { apiClient } from '../client';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard';
export type SubmissionStatus  = 'pending' | 'accepted' | 'wrong_answer' | 'error';

export interface OlympiadExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface OlympiadProblem {
  id: number;
  olympiadId: number;
  title: string;
  description: string;
  inputDescription?: string;
  outputDescription?: string;
  examples: OlympiadExample[];
  difficulty: ProblemDifficulty;
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
  problems: OlympiadProblem[];
  createdAt: string;
}

export interface OlympiadSubmission {
  id: number;
  olympiadId: number;
  problemId: number;
  userId: number;
  code: string;
  language: string;
  status: SubmissionStatus;
  score: number;
  output?: string;
  errorMessage?: string;
  createdAt: string;
  problem?: OlympiadProblem;
  user?: { id: number; firstName: string; lastName: string };
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  score: number;
  solved: number;
  solvedAt: string;
}

export const olympiadsApi = {
  getAll:     (): Promise<Olympiad[]>                       => apiClient.get('/olympiads'),
  getAllAdmin: (): Promise<Olympiad[]>                       => apiClient.get('/olympiads/admin/all'),
  getOne:     (id: number): Promise<Olympiad>               => apiClient.get(`/olympiads/${id}`),
  getLeaderboard: (id: number): Promise<LeaderboardEntry[]> => apiClient.get(`/olympiads/${id}/leaderboard`),
  getMySubmissions: (id: number): Promise<OlympiadSubmission[]> => apiClient.get(`/olympiads/${id}/my-submissions`),
  getAllSubmissions: (id: number): Promise<OlympiadSubmission[]> => apiClient.get(`/olympiads/${id}/submissions`),

  submit: (olympiadId: number, problemId: number, data: { code: string; language: string }): Promise<OlympiadSubmission> =>
    apiClient.post(`/olympiads/${olympiadId}/problems/${problemId}/submit`, data),

  create: (data: Partial<Olympiad>): Promise<Olympiad>       => apiClient.post('/olympiads', data),
  update: (id: number, data: Partial<Olympiad>): Promise<Olympiad> => apiClient.put(`/olympiads/${id}`, data),
  remove: (id: number): Promise<void>                        => apiClient.delete(`/olympiads/${id}`),

  addProblem:    (id: number, data: Partial<OlympiadProblem>): Promise<OlympiadProblem> =>
    apiClient.post(`/olympiads/${id}/problems`, data),
  updateProblem: (id: number, pid: number, data: Partial<OlympiadProblem>): Promise<OlympiadProblem> =>
    apiClient.put(`/olympiads/${id}/problems/${pid}`, data),
  removeProblem: (id: number, pid: number): Promise<void>    =>
    apiClient.delete(`/olympiads/${id}/problems/${pid}`),

  gradeSubmission: (submissionId: number, data: { status: SubmissionStatus; score: number }): Promise<OlympiadSubmission> =>
    apiClient.put(`/olympiads/submissions/${submissionId}/grade`, data),
};
