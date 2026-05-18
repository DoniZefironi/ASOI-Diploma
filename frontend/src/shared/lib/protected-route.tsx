'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole, getCourseTypeFromRole } from '@/shared/lib/auth-context';

// Пути, требующие авторизации (любая роль)
const AUTH_REQUIRED = [
  '/profile',
  '/dashboard',
  '/schedule',
  '/hackathons',
  '/forum',
  '/career',
  '/rooms',
  '/peer-review',
  '/library',
  '/prof-orientation',
  '/complilier',
  '/compiler',
  '/circuit',
  '/shematic',
  '/simulator',
  '/mqtt-expert',
];

// Только менторы и админы
const MENTOR_ONLY_PATHS = ['/mentor'];

// Только админы
const ADMIN_ONLY_PATHS = ['/admin'];

// Студенты + менторы + админы (не просто registered_user)
const ENROLLED_ONLY_PATHS = [
  '/complilier',
  '/compiler',
  '/circuit',
  '/shematic',
  '/simulator',
];

const matches = (pathname: string, paths: string[]) =>
  paths.some(p => pathname === p || pathname.startsWith(p + '/'));

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireCourseEnrollment?: boolean;
  allowedCourseType?: string;
}

export function ProtectedRoute({
  children,
  requireCourseEnrollment = false,
  allowedCourseType,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !pathname) return;

    const userRoles = user?.roles || [];
    const isStudent = hasStudentRole(userRoles);
    const isMentor = hasMentorRole(userRoles);
    const isAdmin = hasAdminRole(userRoles);
    const isRegisteredOnly = !!user && !isStudent && !isMentor && !isAdmin;
    const userCourseType = getCourseTypeFromRole(userRoles) || (user as any)?.enrolledCourseType;

    // 1. Если путь требует авторизации и пользователь не вошёл
    if (!user && matches(pathname, AUTH_REQUIRED)) {
      router.push('/auth?redirect=' + encodeURIComponent(pathname));
      return;
    }

    // 2. Только менторы и админы
    if (matches(pathname, MENTOR_ONLY_PATHS) && !isMentor && !isAdmin) {
      router.push('/profile');
      return;
    }

    // 3. Только админы
    if (matches(pathname, ADMIN_ONLY_PATHS) && !isAdmin) {
      router.push('/profile');
      return;
    }

    // 4. Студенты / менторы / админы (не просто registered_user)
    if (matches(pathname, ENROLLED_ONLY_PATHS) && isRegisteredOnly) {
      router.push('/courses');
      return;
    }

    // 5. Проверка доступа по типу курса (компилятор — CS, эмулятор — electronics)
    // Админы и менторы имеют доступ ко всему
    if (userCourseType && !isAdmin && !isMentor) {
      const COURSE_TYPE_PATHS: Record<string, string[]> = {
        computer_science: ['/complilier', '/compiler'],
        electronics: ['/circuit', '/shematic', '/simulator'],
      };
      for (const [courseType, paths] of Object.entries(COURSE_TYPE_PATHS)) {
        if (matches(pathname, paths) && userCourseType !== courseType) {
          router.push('/course-access?wrong-course-type=true');
          return;
        }
      }
    }

    if (requireCourseEnrollment && !userCourseType) {
      router.push('/courses?enrollment-required=true');
      return;
    }
    if (allowedCourseType && userCourseType !== allowedCourseType) {
      router.push('/courses?wrong-course-type=true');
      return;
    }
  }, [user, isLoading, pathname, router, requireCourseEnrollment, allowedCourseType]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-fg-muted)', fontSize: 16 }}>Загрузка...</div>
      </div>
    );
  }

  // Блокируем рендер только для явно защищённых путей без авторизации
  if (!user && matches(pathname ?? '', AUTH_REQUIRED)) {
    return null;
  }

  return <>{children}</>;
}
