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
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUserFromToken: () => void;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Функция для декодирования JWT токена
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Обновление данных пользователя из токена
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
      roles: decoded.roles || currentUser?.roles || [],
      enrolledCourseType: decoded.enrolledCourseType || currentUser?.enrolledCourseType,
    };

    // Обновляем только если данные изменились
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
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  // Обновление данных пользователя из токена при изменении токена
  useEffect(() => {
    if (token && !isLoading) {
      updateUserFromToken();
    }
  }, [token, isLoading, updateUserFromToken]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
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

// Helper функции для проверки ролей
export function hasStudentRole(roles: UserRole[]): boolean {
  return roles.some(role => role.startsWith('student_'));
}

export function hasMentorRole(roles: UserRole[]): boolean {
  return roles.some(role => role.startsWith('mentor_'));
}

export function hasAdminRole(roles: UserRole[]): boolean {
  return roles.includes('admin');
}

export function getCourseTypeFromRole(roles: UserRole[]): CourseType | null {
  const studentRole = roles.find(r => r.startsWith('student_'));
  const mentorRole = roles.find(r => r.startsWith('mentor_'));
  const role = studentRole || mentorRole;
  
  if (!role) return null;
  
  const type = role.split('_')[1] as CourseType;
  return ['english', 'electronics', 'computer_science', 'iot'].includes(type) ? type : null;
}