// shared/lib/auth-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type CourseType = 'english' | 'electronics' | 'computer_science' | 'iot';

export type UserRole =
  | 'registered_user'
  | 'student_english'
  | 'student_electronics'
  | 'student_computer_science'
  | 'student_iot'
  | 'mentor_english'
  | 'mentor_electronics'
  | 'mentor_computer_science'
  | 'mentor_iot'
  | 'admin';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  enrolledCourseType?: CourseType;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  updateUserFromToken: () => void;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend returns roles as objects { id, userId, role: 'student_english' } or plain strings.
// Always normalize to plain strings.
function normalizeRoles(rawRoles: any[]): UserRole[] {
  if (!Array.isArray(rawRoles)) return [];
  return rawRoles
    .map(r => (typeof r === 'string' ? r : r?.role))
    .filter((r): r is UserRole => typeof r === 'string' && r.length > 0);
}

const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

function buildUserFromRaw(raw: any): User {
  return {
    id: String(raw.id ?? ''),
    email: raw.email ?? '',
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    roles: normalizeRoles(raw.roles ?? []),
    enrolledCourseType: raw.enrolledCourseType ?? undefined,
    avatar: raw.avatar ?? undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserFromToken = useCallback(() => {
    const savedToken = localStorage.getItem('access_token');
    if (!savedToken) return;

    const decoded = decodeToken(savedToken);
    if (!decoded) return;

    const savedUser = localStorage.getItem('user');
    const currentUser = savedUser ? JSON.parse(savedUser) : null;

    const updatedUser: User = {
      id: decoded.sub?.toString() || currentUser?.id || '',
      email: decoded.email || currentUser?.email || '',
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      roles: normalizeRoles(decoded.roles || currentUser?.roles || []),
      enrolledCourseType: decoded.enrolledCourseType || currentUser?.enrolledCourseType,
      avatar: currentUser?.avatar,
    };

    if (JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
      setToken(savedToken);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const raw = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(buildUserFromRaw(raw));
      } catch {
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token && !isLoading) {
      updateUserFromToken();
    }
  }, [token, isLoading, updateUserFromToken]);

  const login = (newToken: string, newUser: any) => {
    const normalized = buildUserFromRaw(newUser);
    setToken(newToken);
    setUser(normalized);
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('user', JSON.stringify(normalized));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles?.includes(role) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUserFromToken,
      isLoading,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions — safe against both string[] and object[] inputs
export function hasStudentRole(roles: UserRole[]): boolean {
  return normalizeRoles(roles).some(r => r.startsWith('student_'));
}

export function hasMentorRole(roles: UserRole[]): boolean {
  return normalizeRoles(roles).some(r => r.startsWith('mentor_'));
}

export function hasAdminRole(roles: UserRole[]): boolean {
  return normalizeRoles(roles).includes('admin');
}

export function getCourseTypeFromRole(roles: UserRole[]): CourseType | null {
  const normalized = normalizeRoles(roles);
  const role = normalized.find(r => r.startsWith('student_')) || normalized.find(r => r.startsWith('mentor_'));
  if (!role) return null;
  // Remove prefix: student_computer_science → computer_science
  const type = role.replace(/^(student|mentor)_/, '') as CourseType;
  return (['english', 'electronics', 'computer_science', 'iot'] as CourseType[]).includes(type) ? type : null;
}
