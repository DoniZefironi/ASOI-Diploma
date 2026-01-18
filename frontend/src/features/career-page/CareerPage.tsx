'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const CareerPage = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const careers = [
    { 
      name: 'Разработчик ПО', 
      image: '/icons/software-developer.png',
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      name: 'Data Scientist', 
      image: '/icons/data-scientist.png',
      color: 'from-green-500 to-green-600' 
    },
    { 
      name: 'Аналитик кибербезопасности', 
      image: '/icons/cybersecurity.png',
      color: 'from-red-500 to-red-600' 
    },
    { 
      name: 'Инженер IoT', 
      image: '/icons/iot-engineer.png',
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      name: 'Инженер-электронщик', 
      image: '/icons/electronics-engineer.png',
      color: 'from-yellow-500 to-yellow-600' 
    },
    { 
      name: 'Технический писатель', 
      image: '/icons/technical-writer.png',
      color: 'from-indigo-500 to-indigo-600' 
    },
    { 
      name: 'Инженер ИИ', 
      image: '/icons/ai-engineer.png',
      color: 'from-pink-500 to-pink-600' 
    },
    { 
      name: 'DevOps инженер', 
      image: '/icons/devops-engineer.png',
      color: 'from-teal-500 to-teal-600' 
    },
    { 
      name: 'UX/UI дизайнер', 
      image: '/icons/ux-designer.png',
      color: 'from-orange-500 to-orange-600' 
    },
    { 
      name: 'Продуктовый менеджер', 
      image: '/icons/product-manager.png',
      color: 'from-cyan-500 to-cyan-600' 
    }
  ];

  const duplicatedCareers = [...careers, ...careers];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; 

    const animateScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;

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
            Карьерное ориентирование
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Исследуйте свой потенциал и найдите идеальный карьерный путь в мире технологий.
          </p>
        </div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Оцените свои навыки
          </h2>
          
          <Card className="max-w-2xl mx-auto p-8 animate-slide-in-left">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Карьерный диагностический тест
            </h3>
            <p className="text-white mb-6">
              Пройдите наш комплексный тест, чтобы определить свои сильные стороны и интересы в IT-сфере.
            </p>
            <Button variant="primary" className="px-8 py-3">
              Начать тест
            </Button>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Исследуйте карьерные пути
          </h2>

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
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={career.image}
                      alt={career.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
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
              Рекомендуемые статьи
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/TechIndustry.jpg"
                    alt="Топ-навыки для IT-специалистов в 2024 году"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Топ-навыки для IT-специалистов в 2024 году
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Будьте впереди всех с самыми востребованными навыками в IT-индустрии.
                  </p>
                  <Button variant="primary" className="w-full">
                    Читать далее
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/ProgrammingLanguage.png"
                    alt="Выбор подходящего языка программирования"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Выбор подходящего языка программирования для вашей карьеры
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Руководство по выбору лучшего языка программирования в зависимости от ваших карьерных целей.
                  </p>
                  <Button variant="primary" className="w-full">
                    Читать далее
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/TechProfessionals.png"
                    alt="Будущее работы в IT-сфере"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Будущее работы в IT-индустрии
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Анализ новых трендов и перспективных карьерных возможностей в IT-секторе.
                  </p>
                  <Button variant="primary" className="w-full">
                    Читать далее
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