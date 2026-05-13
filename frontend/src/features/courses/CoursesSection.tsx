// features/courses/CoursesSection.tsx
'use client';

import { Card } from '@/shared/ui/card';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';
import { useCourses, Course } from '@/shared/api/admin'; 

export const CoursesSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const { courses, isLoading, isError } = useCourses();

  useEffect(() => {
    if (!courses || courses.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, index]);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-index]');
    cards?.forEach(card => observer.observe(card));

    return () => {
      cards?.forEach(card => observer.unobserve(card));
    };
  }, [courses]); 

  if (isLoading) {
    return (
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">Загрузка курсов...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Не удалось загрузить курсы</p>
        </div>
      </section>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">Нет доступных курсов</p>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Рекомендуемые курсы
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
            Откройте для себя наши комплексные курсы, разработанные для улучшения ваших навыков и карьеры
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => ( 
            <div
              key={course.id} 
              data-index={index}
              className={`
                transform transition-all duration-1000 ease-out
                ${visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
                }
                hover:scale-105 hover:-translate-y-2 transition-all duration-300
              `}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              <Card className="h-full bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden bg-gray-700 flex items-center justify-center">
                  <Image
                    src={course.imageUrl?.trim() ? course.imageUrl.trim() : '/images/default-course.png'} 
                    alt={course.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {course.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 h-full flex flex-col">
                  <h3 className="font-bold text-gh-fg mb-3 text-lg leading-tight">
                    {course.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-5">
                    {course.description}
                  </p>
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[75%]"
                  >
                    Подробнее
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};