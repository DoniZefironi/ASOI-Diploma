import { apiClient } from '@/shared/api/client';

export interface RoomMember {
  id: number;
  userId: number;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
  user: { id: number; firstName: string; lastName: string; email: string };
}

export interface Room {
  id: number;
  name: string;
  description: string;
  type: 'circuit' | 'iot' | 'compiler';
  ownerId: number;
  owner: { id: number; firstName: string; lastName: string; email: string };
  state: any;
  inviteCode: string;
  isPublic: boolean;
  hackathonTeamId: number | null;
  createdAt: string;
  updatedAt: string;
  members: RoomMember[];
}

export const roomsApi = {
  getMyRooms:    ()           => apiClient.get('/rooms') as Promise<Room[]>,
  getPublicRooms:()           => apiClient.get('/rooms/public') as Promise<Room[]>,
  getRoom:          (id: number) => apiClient.get(`/rooms/${id}`) as Promise<Room>,
  getByInvite:      (code: string) => apiClient.get(`/rooms/invite/${code}`) as Promise<Room>,
  joinByInvite:     (code: string) => apiClient.post(`/rooms/invite/${code}/join`, {}) as Promise<Room>,
  createRoom:       (data: { name: string; description?: string; type: 'circuit' | 'iot' | 'compiler'; isPublic?: boolean }) =>
                      apiClient.post('/rooms', data) as Promise<Room>,
  updateRoom:       (id: number, data: any) => apiClient.patch(`/rooms/${id}`, data) as Promise<Room>,
  deleteRoom:       (id: number)            => apiClient.delete(`/rooms/${id}`),
  regenerateInvite: (id: number)            => apiClient.post(`/rooms/${id}/invite/regenerate`, {}) as Promise<{ inviteCode: string }>,
  removeMember:     (roomId: number, userId: number) => apiClient.delete(`/rooms/${roomId}/members/${userId}`),
  updateMemberRole: (roomId: number, userId: number, role: string) =>
                      apiClient.patch(`/rooms/${roomId}/members/${userId}/role`, { role }),
};
