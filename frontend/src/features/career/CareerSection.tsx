'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useEffect, useRef, useState } from 'react';

export const CareerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const careerItems = [
    {
      title: "Интерактивный симулятор схем",
      description: "Экспериментируйте с электронными схемами с помощью нашего мощного симулятора. Создавайте, тестируйте и отлаживайте свои проекты в виртуальной среде.",
      buttonText: "Запустить симулятор"
    },
    {
      title: "Найдите свою идеальную IT-карьеру",
      description: "Пройдите нашу карьерную диагностику, чтобы определить свои сильные стороны и интересы. Получите персональные рекомендации по IT-ролям и обучающим траекториям.",
      buttonText: "Начать диагностику"
    }
  ];

  return (
    <section id="career" className="py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Карьерное ориентирование
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Раскройте свой потенциал с помощью наших карьерных инструментов и ресурсов
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {careerItems.map((item, index) => (
            <div
              key={index}
              className={`
                transform transition-all duration-700 ease-out
                ${isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
                }
                hover:scale-105 transition-all duration-300
              `}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              <Card className="h-full bg-gray-800 border border-gray-700 transition-all duration-300 overflow-hidden group">
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center mb-6">
                    <h3 className="text-2xl font-bold text-gh-fg">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed flex-grow">
                    {item.description}
                  </p>
                  
                  <Button 
                    variant="primary" 
                    className="w-full py-4 text-lg font-semibold group-hover:scale-105 transition-transform duration-300"
                  >
                    {item.buttonText}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              title: "Конструктор резюме",
              description: "Создавайте профессиональные IT-резюме",
              stat: "500+"
            },
            {
              title: "Пробные собеседования",
              description: "Тренируйтесь с экспертами индустрии",
              stat: "95%"
            },
            {
              title: "Подбор вакансий",
              description: "Персонализированные рекомендации по работе",
              stat: "2K+"
            }
          ].map((item, index) => (
            <div
              key={index}
              className={`
                transform transition-all duration-700 ease-out
                ${isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
                }
                hover:scale-105 transition-all duration-300
              `}
              style={{
                transitionDelay: `${600 + index * 150}ms`
              }}
            >
              <Card className="bg-gray-800 border border-gray-700 text-center p-6 transition-colors duration-300">
                <div className="text-3xl font-bold text-gh-fg mb-2">{item.stat}</div>
                <h4 className="font-semibold text-gh-fg mb-3 text-lg">{item.title}</h4>
                <p className="text-gray-300">{item.description}</p>
              </Card>
            </div>
          ))}
        </div>

        <div className={`
          text-center mt-16 p-8 rounded-xl bg-gray-800 border border-gray-700
          transform transition-all duration-1000 ease-out
          ${isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
          }
        `}
        style={{
          transitionDelay: '1000ms'
        }}>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Готовы начать свою IT-карьеру?
          </h3>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам студентов, которые изменили свою карьеру с нашей помощью
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="px-8 py-3 text-lg font-semibold">
              Изучить курсы
            </Button>
            <Button variant="primary" className="px-8 py-3 text-lg font-semibold">
              Записаться на консультацию
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};