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
        apiClient.get('/course-groups'),
        apiClient.get('/courses'),
      ]);

      // Получаем тип курса ментора из роли (только если пользователь не null)
      const userRoles = user?.roles || [];
      const courseType = getCourseTypeFromRole(userRoles);
      setMentorCourseType(courseType);

      // Фильтруем группы по ментору и по типу курса
      let userGroups = groupsData?.filter((group: any) =>
        user?.id && group.instructor?.id?.toString() === user.id
      ) || [];

      // Если это ментор (не админ), фильтруем по типу курса
      if (courseType) {
        userGroups = userGroups.filter((group: any) => 
          group.course?.type === courseType
        );
      }

      setGroups(userGroups);
      setCourses(coursesData || []);

      // Получаем ID курсов, которые ведёт ментор
      const courseIds = Array.from(new Set(userGroups.map((g: any) => g.courseId as number))) as number[];
      setMentorCourseIds(courseIds);
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
