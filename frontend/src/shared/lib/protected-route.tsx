'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole, getCourseTypeFromRole } from '@/shared/lib/auth-context';

// Список публичных страниц, доступных БЕЗ авторизации
const PUBLIC_PATHS = [
  '/',
  '/auth',
  '/about',
  '/contacts',
  '/faq',
  '/privacy',
  '/terms',
];

// Страницы, доступные только АВТОРИЗОВАННЫМ пользователям (любая роль кроме registered_user)
const AUTHORIZED_ONLY_PATHS = [
  '/dashboard',
  '/schedule',
  '/hackathons',
  '/forum',
  '/career',
];

// Страницы, доступные только СТУДЕНТАМ и выше (не registered_user)
const STUDENT_ONLY_PATHS = [
  '/complilier',
  '/compiler',
  '/circuit',
  '/shematic',
  '/simulator',
];

// Страницы, доступные только МЕНТОРАМ и ADMIN
const MENTOR_ONLY_PATHS = [
  '/mentor',
];

// Страницы, доступные только ADMIN
const ADMIN_ONLY_PATHS = [
  '/admin',
];

// Страницы по типам курсов
const COURSE_TYPE_PATHS: Record<string, string[]> = {
  'computer_science': ['/complilier', '/compiler'],
  'electronics': ['/circuit', '/shematic', '/simulator'],
};

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
    if (isLoading) return;
    if (!pathname) return;

    const userRoles = user?.roles || [];
    const userCourseType = getCourseTypeFromRole(userRoles) || (user as any)?.enrolledCourseType;

    // 1. Проверка публичных страниц (доступны всем, включая неавторизованных)
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
    if (isPublicPath) {
      return;
    }

    // 2. Если не авторизован - редирект на страницу авторизации
    if (!user) {
      router.push('/auth?redirect=' + encodeURIComponent(pathname));
      return;
    }

    const isStudent = hasStudentRole(userRoles);
    const isMentor = hasMentorRole(userRoles);
    const isAdmin = hasAdminRole(userRoles);
    const isRegisteredUser = userRoles.includes('registered_user') && !isStudent && !isMentor && !isAdmin;

    // 3. Проверка ADMIN_ONLY
    const isAdminOnlyPath = ADMIN_ONLY_PATHS.some(path => pathname.startsWith(path));
    if (isAdminOnlyPath && !isAdmin) {
      router.push('/profile');
      return;
    }

    // 4. Проверка MENTOR_ONLY
    const isMentorOnlyPath = MENTOR_ONLY_PATHS.some(path => pathname.startsWith(path));
    if (isMentorOnlyPath && !isMentor && !isAdmin) {
      router.push('/profile');
      return;
    }

    // 5. Проверка STUDENT_ONLY (студенты, менторы, админы)
    const isStudentOnlyPath = STUDENT_ONLY_PATHS.some(path => pathname.startsWith(path));
    if (isStudentOnlyPath && !isStudent && !isMentor && !isAdmin) {
      router.push('/profile');
      return;
    }

    // 6. Проверка AUTHORIZED_ONLY (все авторизованные кроме registered_user)
    const isAuthorizedOnlyPath = AUTHORIZED_ONLY_PATHS.some(path => pathname.startsWith(path));
    if (isAuthorizedOnlyPath && isRegisteredUser) {
      router.push('/profile');
      return;
    }

    // 7. Проверка доступа по типу курса
    if (userCourseType) {
      for (const [courseType, paths] of Object.entries(COURSE_TYPE_PATHS)) {
        const isCourseTypePath = paths.some(path => pathname.startsWith(path));
        if (isCourseTypePath && userCourseType !== courseType) {
          // Если это страница другого курса
          if (courseType === 'computer_science' && userCourseType !== 'computer_science') {
            router.push('/course-access?wrong-course-type=true');
            return;
          }
          if (courseType === 'electronics' && userCourseType !== 'electronics') {
            router.push('/course-access?wrong-course-type=true');
            return;
          }
        }
      }
    }

    // 8. Если требуется запись на курс
    if (requireCourseEnrollment && !userCourseType) {
      router.push('/courses?enrollment-required=true');
      return;
    }

    // 9. Если требуется определённое направление курса
    if (allowedCourseType && userCourseType !== allowedCourseType) {
      router.push('/courses?wrong-course-type=true');
      return;
    }
  }, [user, isLoading, pathname, router, requireCourseEnrollment, allowedCourseType]);

  // Показываем loading во время проверки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path));
  const isAuthorized = user || isPublicPath;

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
