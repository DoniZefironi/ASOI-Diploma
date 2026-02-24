// shared/api/hackathons/index.ts
import { apiClient } from '../client';

export interface Hackathon {
  id: number;
  courseId: number | null;
  title: string;
  description: string;
  theme: string | null;
  startDate: string;
  endDate: string;
  registrationDeadline: string | null;
  maxTeamSize: number;
  minTeamSize: number;
  prizePool: number | null;
  isActive: boolean;
  judgingCriteria: any;
  createdAt: string;
  course?: {
    id: number;
    name: string;
  };
  teams?: HackathonTeam[];
}

export interface HackathonTeam {
  id: number;
  name: string;
  hackathonId: number;
  leaderId: number;
  projectName: string | null;
  projectDescription: string | null;
  status: string;
  createdAt: string;
  hackathon?: Hackathon;
  members?: HackathonTeamMember[];
  submissions?: HackathonSubmission[];
}

export interface HackathonTeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: string;
  joinedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface HackathonSubmission {
  id: number;
  teamId: number;
  circuitProjectId: number | null;
  documentationUrl: string | null;
  presentationUrl: string | null;
  videoDemoUrl: string | null;
  sourceCodeUrl: string | null;
  submissionNote: string | null;
  submittedAt: string;
  team?: HackathonTeam;
  grades?: HackathonGrade[];
}

export interface HackathonGrade {
  id: number;
  submissionId: number;
  judgeId: number;
  innovationScore: number;
  functionalityScore: number;
  presentationScore: number;
  teamworkScore: number;
  totalScore: number;
  feedback: string | null;
  judgingCriteriaScores: any;
  judgedAt: string;
}

export interface CreateHackathonDto {
  title: string;
  description: string;
  theme?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  maxTeamSize?: number;
  minTeamSize?: number;
  prizePool?: number;
  isActive?: boolean;
  courseId?: number;
  judgingCriteria?: any;
}

export interface CreateTeamDto {
  name: string;
  hackathonId: number;
  memberIds: number[];
  projectName?: string;
  projectDescription?: string;
}

export interface SubmitProjectDto {
  teamId: number;
  circuitProjectId?: number;
  documentationUrl?: string;
  presentationUrl?: string;
  videoDemoUrl?: string;
  sourceCodeUrl?: string;
  submissionNote?: string;
}

export interface GradeSubmissionDto {
  innovationScore?: number;
  functionalityScore?: number;
  presentationScore?: number;
  teamworkScore?: number;
  feedback?: string;
  judgingCriteriaScores?: any;
}

export interface TeamRanking {
  teamId: number;
  teamName: string;
  projectName: string;
  averageScore: number;
  totalScore: number;
}

export interface HackathonStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalSubmissions: number;
}

export const hackathonsApi = {
  // Hackathons
  getAll: () => apiClient.get<Hackathon[]>('/hackathons'),
  getOne: (id: number) => apiClient.get<Hackathon>(`/hackathons/${id}`),
  getRankings: (id: number) => apiClient.get<TeamRanking[]>(`/hackathons/${id}/rankings`),
  create: (data: CreateHackathonDto) => apiClient.post<Hackathon>('/hackathons', data),
  update: (id: number, data: Partial<CreateHackathonDto>) =>
    apiClient.patch<Hackathon>(`/hackathons/${id}`, data),
  delete: (id: number) => apiClient.delete(`/hackathons/${id}`),
  getStats: () => apiClient.get<HackathonStats>('/hackathons/admin/stats'),

  // Teams
  createTeam: (data: CreateTeamDto) => apiClient.post<HackathonTeam>('/hackathons/teams', data),
  joinTeam: (teamId: number) =>
    apiClient.post<HackathonTeam>(`/hackathons/teams/${teamId}/join`, {}),
  leaveTeam: (teamId: number) =>
    apiClient.post(`/hackathons/teams/${teamId}/leave`, {}),
  transferLeadership: (teamId: number, newLeaderId: number) =>
    apiClient.patch<HackathonTeam>(`/hackathons/teams/${teamId}/transfer-leadership`, { newLeaderId }),
  updateTeamStatus: (teamId: number, status: string) =>
    apiClient.patch<HackathonTeam>(`/hackathons/teams/${teamId}/status`, { status }),
  getUserTeams: () => apiClient.get<HackathonTeam[]>('/hackathons/my-teams'),

  // Submissions
  submitProject: (data: SubmitProjectDto) =>
    apiClient.post<HackathonSubmission>('/hackathons/submissions', data),
  getUserSubmissions: () => apiClient.get<HackathonSubmission[]>('/hackathons/my-submissions'),

  // Grading
  gradeSubmission: (submissionId: number, data: GradeSubmissionDto) =>
    apiClient.post<HackathonGrade>(`/hackathons/submissions/${submissionId}/grade`, data),
};
