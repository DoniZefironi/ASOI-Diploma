// features/courses-page/CoursesPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CourseCardWithRegistration } from '@/shared/ui/card';
import { useCourses } from '@/shared/api/admin';
import { useAuth } from '@/shared/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

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
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { courses, isLoading, isError } = useCourses();
  const [filterType, setFilterType] = useState<string>('all');

  const courseType = searchParams?.get('type') ?? null;

  useEffect(() => {
    if (courseType) {
      setFilterType(courseType);
    }
  }, [courseType]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white">Загрузка курсов...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Ошибка загрузки курсов</p>
        </div>
      </div>
    );
  }

  const mappedCourses = courses?.map(mapCourseToCardFormat) || [];
  const filteredCourses = filterType === 'all' 
    ? mappedCourses 
    : mappedCourses.filter(c => c.category === filterType);

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Наши курсы
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Выберите направление обучения и начните свой путь в IT-индустрии
          </p>
        </div>

        {/* Фильтр направлений */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Все курсы
          </button>
          <button
            onClick={() => setFilterType('electronics')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              filterType === 'electronics'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ⚡ Электроника
          </button>
          <button
            onClick={() => setFilterType('computer-science')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              filterType === 'computer-science'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            💻 Информатика
          </button>
          <button
            onClick={() => setFilterType('iot')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              filterType === 'iot'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🌐 IoT
          </button>
          <button
            onClick={() => setFilterType('language')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              filterType === 'language'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📚 Английский
          </button>
        </div>

        <div className="w-24 h-1 bg-blue-600 mx-auto mb-16 animate-slide-in-left"></div>

        <div className="max-w-3xl mx-auto rounded-xl overflow-hidden border border-gray-700/50 divide-y divide-gray-700/50">
          {filteredCourses.map((course, index) => (
            <CourseCardWithRegistration
              key={course.id}
              course={course}
              index={index}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">Курсы этого направления не найдены</p>
            <Link href="/courses">
              <Button variant="secondary" className="mt-4">
                Показать все курсы
              </Button>
            </Link>
          </div>
        )}

        {/* Блок технического английского */}
        {(filterType === 'all' || filterType === 'language') && (
          <div className="max-w-3xl mx-auto mt-6">
            <Link
              href="/courses/english-vocab"
              className="flex items-center justify-between gap-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-xl px-6 py-4 hover:border-purple-500 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">📖</span>
                <div>
                  <div className="text-white font-semibold">Technical English Vocabulary</div>
                  <div className="text-gray-400 text-sm">50 IT-терминов с транскрипцией, переводом и примерами · режим карточек</div>
                </div>
              </div>
              <span className="text-purple-400 group-hover:text-white transition-colors text-sm shrink-0">Открыть →</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};