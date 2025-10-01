'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const CareerPage = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const careers = [
    { name: 'Software Developer', icon: '💻', color: 'from-blue-500 to-blue-600' },
    { name: 'Data Scientist', icon: '📊', color: 'from-green-500 to-green-600' },
    { name: 'Cybersecurity Analyst', icon: '🛡️', color: 'from-red-500 to-red-600' },
    { name: 'IoT Engineer', icon: '📱', color: 'from-purple-500 to-purple-600' },
    { name: 'Electronics Engineer', icon: '🔌', color: 'from-yellow-500 to-yellow-600' },
    { name: 'Technical Writer', icon: '✍️', color: 'from-indigo-500 to-indigo-600' },
    { name: 'AI Engineer', icon: '🤖', color: 'from-pink-500 to-pink-600' },
    { name: 'DevOps Engineer', icon: '⚙️', color: 'from-teal-500 to-teal-600' },
    { name: 'UX Designer', icon: '🎨', color: 'from-orange-500 to-orange-600' },
    { name: 'Product Manager', icon: '📈', color: 'from-cyan-500 to-cyan-600' }
  ];

  // Создаем удвоенный массив для бесконечной прокрутки
  const duplicatedCareers = [...careers, ...careers];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Скорость прокрутки

    const animateScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Если прокрутили половину контента, возвращаемся к началу
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animateScroll);
    };

    animationId = requestAnimationFrame(animateScroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Career Guidance
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Explore your potential and find the perfect career path in the tech world.
          </p>
        </div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Assess Your Skills
          </h2>
          
          <Card className="max-w-2xl mx-auto p-8 animate-slide-in-left">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Career Assessment Test
            </h3>
            <p className="text-white mb-6">
              Take our comprehensive test to discover your strengths and interests in the tech field.
            </p>
            <Button variant="primary" className="px-8 py-3">
              Start Test
            </Button>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Explore Career Paths
          </h2>

          {/* Карусель профессий */}
          <div 
            ref={scrollContainerRef}
            className="relative mb-12 overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex space-x-4 py-4">
              {duplicatedCareers.map((career, index) => (
                <div
                  key={`${career.name}-${index}`}
                  className="flex-shrink-0 w-32 bg-gray-800 rounded-xl p-4 text-center border border-gray-700 hover:scale-110 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${career.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-2xl">{career.icon}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-tight group-hover:text-blue-300 transition-colors duration-300">
                    {career.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Featured Articles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/TechIndustry.jpg"
                    alt="Top Skills for Tech Professionals in 2024"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Top Skills for Tech Professionals in 2024
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Stay ahead of the curve with the most in-demand skills in the tech industry.
                  </p>
                  <Button variant="primary" className="w-full">
                    Read More
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/ProgrammingLanguage.png"
                    alt="Choosing the Right Programming Language"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Choosing the Right Programming Language for Your Career
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    A guide to selecting the best programming language based on your career goals.
                  </p>
                  <Button variant="primary" className="w-full">
                    Read More
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/TechProfessionals.png"
                    alt="The Future of Work in Tech"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    The Future of Work in the Tech Industry
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Insights into emerging trends and future career opportunities in the tech sector.
                  </p>
                  <Button variant="primary" className="w-full">
                    Read More
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};