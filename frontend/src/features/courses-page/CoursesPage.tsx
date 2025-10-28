// features/courses-page/CoursesPage.tsx
'use client';

import { CourseCardWithRegistration } from '@/shared/ui/card';
import { useCourses } from '@/shared/api/admin';

interface Course {
  id: number;
  name: string; 
  type: string; 
  description: string; 
  duration: number; 
  imageUrl: string; 
  isActive: boolean; 
}

function mapCourseToCardFormat(course: Course) {
  const typeToCategoryMap: Record<string, { category: string; level: string; levelColor: string }> = {
    'computer_science': { category: 'computer-science', level: 'НАЧИНАЮЩИЙ', levelColor: 'bg-green-100 text-green-800' },
    'electronics': { category: 'electronics', level: 'НАЧИНАЮЩИЙ', levelColor: 'bg-green-100 text-green-800' },
    'language': { category: 'language', level: 'ВСЕ УРОВНИ', levelColor: 'bg-blue-100 text-blue-800' },
    'iot': { category: 'iot', level: 'СРЕДНИЙ', levelColor: 'bg-yellow-100 text-yellow-800' },
  };

  const mapped = typeToCategoryMap[course.type] || { category: course.type, level: 'НАЧИНАЮЩИЙ', levelColor: 'bg-gray-100 text-gray-800' };

  return {
    id: course.id,
    title: course.name,
    description: course.description,
    level: mapped.level,
    levelColor: mapped.levelColor,
    category: mapped.category,
    duration: course.duration,
    imageUrl: course.imageUrl,
    isActive: course.isActive,
  };
}

export const CoursesPage = () => {
  const { courses, isLoading, isError } = useCourses();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">Загрузка курсов...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Ошибка загрузки курсов</p>
        </div>
      </div>
    );
  }

  const mappedCourses = courses?.map(mapCourseToCardFormat) || [];

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Наши курсы
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Выберите направление обучения и начните свой путь в IT-индустрии
          </p>
        </div>

        <div className="w-24 h-1 bg-blue-600 mx-auto mb-16 animate-slide-in-left"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {mappedCourses.map((course, index) => (
            <CourseCardWithRegistration
              key={course.id}
              course={course}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};