'use client';

import { Button } from '@/shared/ui/button';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  levelColor: string;
}

interface CourseCardProps {
  course: Course;
  index: number;
}

export const CourseCard = ({ course, index }: CourseCardProps) => {
  return (
    <div 
      className="bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div className={`inline-block w-fit px-3 py-1 rounded-full text-sm font-semibold mb-4 ${course.levelColor}`}>
          {course.level}
        </div>

        <h3 className="text-xl font-bold text-gh-fg mb-4 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-white mb-6 line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center justify-between">
          <Button variant="primary" className="text-sm px-4 py-2">
            Узнать больше
          </Button>
          <span className="text-2xl text-white font-light">–</span>
        </div>
      </div>
    </div>
  );
};