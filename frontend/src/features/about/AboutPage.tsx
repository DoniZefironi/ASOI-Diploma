'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useState, useRef } from 'react'

export const AboutPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const teamMembers = [
    {
      name: "Электроника и схемотехника",
      position: "Интерактивный эмулятор",
      bio: "Изучайте электронику через практические эксперименты с нашим виртуальным эмулятором схем",
      video: "/videos/vladik.mp4"
    },
    {
      name: "Английский для IT-специалистов",
      position: "Языковая практика",
      bio: "Совершенствуйте английский через реальные рабочие ситуации в IT-среде",
      video: "/videos/matvey.mp4"
    },
    {
      name: "Информатика и профориентация",
      position: "Карьерный гид",
      bio: "Определите свой путь в IT через тестирование и персонализированные рекомендации",
      video: "/videos/lizav2.mp4"
    }
  ];  

  const handleMouseEnter = (index: number) => {
    setHoveredCard(index);
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredCard(null);
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
    }
  };

  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el;
  };

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            О TechEd
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Мы делаем качественное техническое образование доступным для каждого
          </p>
        </div>

        <section className="mb-20 animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gh-fg mb-8 text-center">
              Наша история
            </h2>
            <Card className="p-8">
              <p className="text-lg text-white leading-relaxed mb-6">
                TechEd был основан в 2018 году с простой миссией: сделать качественное техническое 
                образование доступным для каждого, независимо от происхождения или местоположения. 
                Мы верим, что технологии обладают силой изменять жизни, и мы стремимся дать людям 
                навыки, необходимые для успеха в цифровую эпоху.
              </p>
              <p className="text-lg text-white leading-relaxed">
                Начиная с небольших онлайн-курсов, мы выросли в полноценную образовательную платформу, 
                которая помогла тысячам студентов по всему миру начать карьеру в IT.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-20 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gh-fg mb-12 text-center">
            Наши ценности
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gh-fg mb-3">Инновации</h3>
              <p className="text-white">
                Мы постоянно ищем новые и лучшие способы доставки образовательного контента, 
                используя современные технологии и методики обучения.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gh-fg mb-3">Инклюзивность</h3>
              <p className="text-white">
                Мы обеспечиваем доступность нашей платформы для всех учащихся, создавая 
                инклюзивную и welcoming среду для людей из разных背景.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gh-fg mb-3">Сотрудничество</h3>
              <p className="text-white">
                Мы верим, что лучшее обучение происходит, когда мы работаем вместе. 
                Мы поощряем совместное обучение и обмен знаниями.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gh-fg mb-3">Стремление к excellence</h3>
              <p className="text-white">
                Мы стремимся к высочайшим стандартам в наших курсах и услугах, 
                постоянно улучшая качество образовательного опыта.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-20 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gh-fg mb-12 text-center">
            Наши направления
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="p-0 text-center hover:shadow-xl transition-all duration-300 overflow-hidden group relative"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <div className="relative h-80 mb-4 rounded-lg overflow-hidden bg-gray-700">
                  <video
                    ref={setVideoRef(index)}
                    src={member.video}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      hoveredCard === index 
                        ? 'scale-105' 
                        : 'scale-100'
                    }`}
                  />
                  
                </div>

                <h3 className="text-xl font-semibold text-gh-fg mb-2 pt-3 px-5">
                  {member.name}
                </h3>
                <p className="text-blue-400 font-medium mb-4 px-5">
                  {member.position}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed pb-6 px-5">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20 animate-fade-in-up">
          <div className="bg-blue-900 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-8">Наши достижения</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">10K+</div>
                <p className="text-blue-100">Студентов</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50+</div>
                <p className="text-blue-100">Курсов</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">95%</div>
                <p className="text-blue-100">Успеваемость</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">25+</div>
                <p className="text-blue-100">Стран</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gh-fg mb-6">
            Присоединяйтесь к нашему сообществу
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Начните свой путь в IT вместе с TechEd и откройте новые возможности для карьеры
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              Начать обучение
            </Button>
            <Button variant="secondary" size="lg">
              Связаться с нами
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};