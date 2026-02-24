// shared/api/forum/index.ts
import { apiClient } from '../client';

export interface ForumSection {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  course?: {
    id: number;
    name: string;
  };
  topics?: ForumTopic[];
}

export interface ForumTopic {
  id: number;
  sectionId: number;
  authorId: number;
  title: string;
  content: string;
  isPinned: boolean;
  isClosed: boolean;
  viewsCount: number;
  lastPostAt: string | null;
  createdAt: string;
  section?: ForumSection;
  author?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  posts?: ForumPost[];
}

export interface ForumPost {
  id: number;
  topicId: number;
  authorId: number;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string | null;
  author?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateSectionDto {
  courseId: number;
  title: string;
  description?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface CreateTopicDto {
  sectionId: number;
  title: string;
  content: string;
  isPinned?: boolean;
  isClosed?: boolean;
}

export interface UpdateTopicDto {
  title?: string;
  content?: string;
}

export interface CreatePostDto {
  topicId: number;
  content: string;
}

export const forumApi = {
  // Sections
  getSections: () => apiClient.get<ForumSection[]>('/forum/sections'),
  getSectionsByCourse: (courseId: number) =>
    apiClient.get<ForumSection[]>(`/forum/sections/course/${courseId}`),
  getSection: (id: number) => apiClient.get<ForumSection>(`/forum/sections/${id}`),
  createSection: (data: CreateSectionDto) =>
    apiClient.post<ForumSection>('/forum/sections', data),
  updateSection: (id: number, data: Partial<CreateSectionDto>) =>
    apiClient.put<ForumSection>(`/forum/sections/${id}`, data),
  deleteSection: (id: number) => apiClient.delete(`/forum/sections/${id}`),

  // Topics
  getTopicsBySection: (sectionId: number) =>
    apiClient.get<ForumTopic[]>(`/forum/topics/section/${sectionId}`),
  getTopic: (id: number) => apiClient.get<ForumTopic>(`/forum/topics/${id}`),
  createTopic: (data: CreateTopicDto) =>
    apiClient.post<ForumTopic>('/forum/topics', data),
  updateTopic: (id: number, data: UpdateTopicDto) =>
    apiClient.put<ForumTopic>(`/forum/topics/${id}`, data),
  toggleTopicPinned: (id: number) =>
    apiClient.put<ForumTopic>(`/forum/topics/${id}/pin`, {}),
  toggleTopicClosed: (id: number) =>
    apiClient.put<ForumTopic>(`/forum/topics/${id}/close`, {}),
  deleteTopic: (id: number) => apiClient.delete(`/forum/topics/${id}`),

  // Posts
  getPostsByTopic: (topicId: number) =>
    apiClient.get<ForumPost[]>(`/forum/topics/${topicId}/posts`),
  createPost: (data: CreatePostDto) =>
    apiClient.post<ForumPost>('/forum/posts', data),
  updatePost: (id: number, content: string) =>
    apiClient.put<ForumPost>(`/forum/posts/${id}`, { content }),
  deletePost: (id: number) => apiClient.delete(`/forum/posts/${id}`),
};
