import { apiClient } from '../client';
import {
  Hackathon,
  CreateHackathonDto,
  CreateTeamDto,
  SubmitProjectDto,
  GradeProjectDto,
  HackathonStats,
} from '../admin/hackathons';

export const hackathonApi = {
  getHackathons: (): Promise<Hackathon[]> =>
    apiClient.get('/hackathons'),

  getHackathon: (id: number): Promise<Hackathon> =>
    apiClient.get(`/hackathons/${id}`),

  createHackathon: (data: CreateHackathonDto): Promise<Hackathon> =>
    apiClient.post('/hackathons', data),

  updateHackathon: (id: number, data: Partial<CreateHackathonDto>): Promise<Hackathon> =>
    apiClient.patch(`/hackathons/${id}`, data),

  deleteHackathon: (id: number): Promise<void> =>
    apiClient.delete(`/hackathons/${id}`),

  getStats: (): Promise<HackathonStats> =>
    apiClient.get('/hackathons/admin/stats'),

  approveTeam: (teamId: number): Promise<void> =>
    apiClient.patch(`/hackathons/teams/${teamId}/approve`, {}),

  rejectTeam: (teamId: number, reason: string): Promise<void> =>
    apiClient.patch(`/hackathons/teams/${teamId}/reject`, { reason }),

  addJury: (hackathonId: number, userId: number): Promise<void> =>
    apiClient.post(`/hackathons/${hackathonId}/jury`, { userId }),

  removeJury: (hackathonId: number, userId: number): Promise<void> =>
    apiClient.delete(`/hackathons/${hackathonId}/jury/${userId}`),

  getRankings: (hackathonId: number): Promise<any> =>
    apiClient.get(`/hackathons/${hackathonId}/rankings`),

  createTeam: (data: CreateTeamDto): Promise<any> =>
    apiClient.post('/hackathons/teams', data),

  submitProject: (data: SubmitProjectDto): Promise<any> =>
    apiClient.post('/hackathons/projects/submit', data),

  finalizeSubmission: (teamId: number): Promise<any> =>
    apiClient.post(`/hackathons/projects/${teamId}/finalize`, {}),

  gradeProject: (projectId: number, data: GradeProjectDto): Promise<any> =>
    apiClient.post(`/hackathons/projects/${projectId}/grade`, data),
};