'use client';

import { Card } from '@/shared/ui/card';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/ui/button';

const courses = [
  {
    title: "Computer Science Fundamentals",
    description: "Learn the basics of programming, data structures, and algorithms.",
    category: "Computer Science",
    icon: "/images/ComputerScience.jpg", 
    type: "image" 
  },
  {
    title: "Electronics and Circuit Design",
    description: "Design and simulate electronic circuits with our interactive emulator.",
    category: "Electronics",
    icon: "/images/Electronics.jpg", 
    type: "image"
  },
  {
    title: "English for Tech Professionals",
    description: "Improve your communication skills for the global tech industry.",
    category: "Language",
    icon: "/images/Language.webp",
    type: "image"
  },
  {
    title: "Introduction to IoT",
    description: "Explore the world of connected devices and smart systems.",
    category: "IoT",
    icon: "/images/IoT.jpg", 
    type: "image"
  }
];

export const CoursesSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section id="courses" className="py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
            Discover our comprehensive courses designed to boost your skills and career
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
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
                  {course.type === "image" ? (
                    <Image
                      src={course.icon}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-500">
                      {course.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 h-full flex flex-col">
                  <h3 className="font-bold text-white mb-3 text-lg leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-5">
                    {course.description}
                  </p>
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[75%]"
                  >
                    Learn More
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