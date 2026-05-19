// features/mentor/useMentorData.ts
import { useState, useEffect } from 'react';
import { useAuth, getCourseTypeFromRole } from '@/shared/lib/auth-context';
import { apiClient } from '@/shared/api/client';

export function useMentorData() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [mentorCourseIds, setMentorCourseIds] = useState<number[]>([]);
  const [mentorCourseType, setMentorCourseType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [groupsData, coursesData] = await Promise.all([
        apiClient.get('/course-groups?limit=1000'),
        apiClient.get('/courses'),
      ]);

      const userRoles = user?.roles || [];
      const courseType = getCourseTypeFromRole(userRoles);
      setMentorCourseType(courseType);

      const allGroups: any[] = groupsData || [];
      const allCourses: any[] = coursesData || [];

      // Менторы видят группы своего направления; админ — все группы
      const filteredGroups = courseType
        ? allGroups.filter((g: any) => g.course?.type === courseType)
        : allGroups;

      setGroups(filteredGroups);

      // Курсы — только те, у которых есть группы (для ментора — своего типа)
      const courseIds = Array.from(new Set(filteredGroups.map((g: any) => g.courseId as number))) as number[];
      setMentorCourseIds(courseIds);

      const filteredCourses = courseType
        ? allCourses.filter((c: any) => c.type === courseType)
        : allCourses;
      setCourses(filteredCourses);
    } catch (error) {
      console.error('Failed to load mentor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    groups,
    courses: courses.filter(c => mentorCourseIds.includes(c.id)),
    mentorCourseIds,
    mentorCourseType,
    isLoading,
    refresh: loadData,
  };
}
