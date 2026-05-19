import { apiClient } from '../client';

export interface HackathonTask {
  id: number;
  stageId: number;
  title: string;
  description: string | null;
  maxScore: number;
  scoringCriteria: string | null;
  order: number;
}

export interface HackathonStage {
  id: number;
  hackathonId: number;
  title: string;
  description: string | null;
  order: number;
  startDate: string | null;
  endDate: string | null;
  tasks: HackathonTask[];
}

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
  rules: string | null;
  createdAt: string;
  course?: {
    id: number;
    name: string;
  };
  teams?: HackathonTeam[];
  stages?: HackathonStage[];
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
  archiveUrl: string | null;
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

export interface CreateHackathonTaskDto {
  title: string;
  description?: string;
  maxScore?: number;
  scoringCriteria?: string;
  order?: number;
}

export interface CreateHackathonStageDto {
  title: string;
  description?: string;
  order?: number;
  startDate?: string;
  endDate?: string;
  tasks?: CreateHackathonTaskDto[];
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
  rules?: string;
  stages?: CreateHackathonStageDto[];
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
  archiveUrl?: string;
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
  getAll: () => apiClient.get('/hackathons'),
  getOne: (id: number) => apiClient.get(`/hackathons/${id}`),
  getRankings: (id: number) => apiClient.get(`/hackathons/${id}/rankings`),
  create: (data: CreateHackathonDto) => apiClient.post('/hackathons', data),
  update: (id: number, data: Partial<CreateHackathonDto>) =>
    apiClient.patch(`/hackathons/${id}`, data),
  delete: (id: number) => apiClient.delete(`/hackathons/${id}`),
  getStats: () => apiClient.get('/hackathons/admin/stats'),

  // Teams
  getTeam: (teamId: number) => apiClient.get(`/hackathons/teams/${teamId}`),
  uploadArchive: (teamId: number, file: File): Promise<{ archiveUrl: string; originalName: string; size: number }> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const formData = new FormData();
    formData.append('file', file);
    return fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904'}/hackathons/teams/${teamId}/upload-archive`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      }
    ).then(res => {
      if (!res.ok) return res.json().then(e => Promise.reject(new Error(e.message || 'Upload failed')));
      return res.json();
    });
  },
  createTeam: (data: CreateTeamDto) => apiClient.post('/hackathons/teams', data),
  joinTeam: (teamId: number) =>
    apiClient.post(`/hackathons/teams/${teamId}/join`, {}),
  leaveTeam: (teamId: number) =>
    apiClient.post(`/hackathons/teams/${teamId}/leave`, {}),
  transferLeadership: (teamId: number, newLeaderId: number) =>
    apiClient.patch(`/hackathons/teams/${teamId}/transfer-leadership`, { newLeaderId }),
  updateTeamStatus: (teamId: number, status: string) =>
    apiClient.patch(`/hackathons/teams/${teamId}/status`, { status }),
  getUserTeams: () => apiClient.get('/hackathons/my-teams'),

  // Submissions
  submitProject: (data: SubmitProjectDto) =>
    apiClient.post('/hackathons/submissions', data),
  getUserSubmissions: () => apiClient.get('/hackathons/my-submissions'),
  getTeamSubmission: (teamId: number) =>
    apiClient.get(`/hackathons/teams/${teamId}/submission`),

  // Grading
  gradeSubmission: (submissionId: number, data: GradeSubmissionDto) =>
    apiClient.post(`/hackathons/submissions/${submissionId}/grade`, data),
};