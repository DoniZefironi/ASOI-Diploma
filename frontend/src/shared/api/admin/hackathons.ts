import useSWR from 'swr';
import { hackathonApi } from '../client/index';

export interface Hackathon {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rules?: string;
  maxTeamSize: number;
  isPublic: boolean;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  teams?: HackathonTeam[];
  juryMembers?: HackathonJuryMember[];
}

export interface HackathonTeam {
  id: number;
  name: string;
  joinCode: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  hackathonId: number;
  members: HackathonTeamMember[];
  project?: HackathonProject;
  createdAt: string;
}

export interface HackathonTeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: 'captain' | 'member';
  joinedAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface HackathonProject {
  id: number;
  teamId: number;
  name: string;
  description: string;
  repositoryUrl?: string;
  presentationUrl?: string;
  demoUrl?: string;
  isSubmitted: boolean;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
  grades?: HackathonGrade[];
}

export interface HackathonGrade {
  id: number;
  projectId: number;
  juryId: number;
  innovationScore: number;
  technicalScore: number;
  presentationScore: number;
  usabilityScore: number;
  comment?: string;
  gradedAt: string;
  jury?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export interface HackathonJuryMember {
  id: number;
  hackathonId: number;
  userId: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateHackathonDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  rules?: string;
  maxTeamSize?: number;
  isPublic?: boolean;
}

export interface CreateTeamDto {
  name: string;
  hackathonId: number;
  memberIds: number[];
}

export interface SubmitProjectDto {
  teamId: number;
  name: string;
  description: string;
  repositoryUrl?: string;
  presentationUrl?: string;
  demoUrl?: string;
}

export interface GradeProjectDto {
  innovationScore: number;
  technicalScore: number;
  presentationScore: number;
  usabilityScore: number;
  comment?: string;
}

export interface HackathonStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalProjects: number;
}

export function useHackathons() {
  const { data, error, isLoading, mutate } = useSWR(
    '/hackathons',
    () => hackathonApi.getHackathons()
  );

  return {
    hackathons: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useHackathon(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/hackathons/${id}` : null,
    () => hackathonApi.getHackathon(id)
  );

  return {
    hackathon: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useHackathonStats() {
  const { data, error, isLoading, mutate } = useSWR(
    '/hackathons/admin/stats',
    () => hackathonApi.getStats()
  );

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useHackathonOperations() {
  const createHackathon = async (data: CreateHackathonDto) => {
    return hackathonApi.createHackathon(data);
  };

  const updateHackathon = async (id: number, data: Partial<CreateHackathonDto>) => {
    return hackathonApi.updateHackathon(id, data);
  };

  const deleteHackathon = async (id: number) => {
    return hackathonApi.deleteHackathon(id);
  };

  const approveTeam = async (teamId: number) => {
    return hackathonApi.approveTeam(teamId);
  };

  const rejectTeam = async (teamId: number, reason: string) => {
    return hackathonApi.rejectTeam(teamId, reason);
  };

  const addJury = async (hackathonId: number, userId: number) => {
    return hackathonApi.addJury(hackathonId, userId);
  };

  const removeJury = async (hackathonId: number, userId: number) => {
    return hackathonApi.removeJury(hackathonId, userId);
  };

  const getRankings = async (hackathonId: number) => {
    return hackathonApi.getRankings(hackathonId);
  };

  return {
    createHackathon,
    updateHackathon,
    deleteHackathon,
    approveTeam,
    rejectTeam,
    addJury,
    removeJury,
    getRankings,
  };
}