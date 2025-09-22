'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const AboutPage = () => {
  const teamMembers = [
    {
      name: "Др. Аня Шарма",
      position: "CEO & Основатель",
      bio: "Эксперт в области образовательных технологий с 15-летним опытом работы в ведущих IT-компаниях.",
      avatar: "👩‍💼"
    },
    {
      name: "Мистер Бен Картер",
      position: "Глава учебного плана",
      bio: "Специалист по разработке образовательных программ с фокусом на практические навыки.",
      avatar: "👨‍🏫"
    },
    {
      name: "Мисс Хлоя Дэвис",
      position: "Ведущий инструктор",
      bio: "Опытный преподаватель с более чем 10-летним стажем в IT-образовании.",
      avatar: "👩‍🎓"
    },
    {
      name: "Мистер Дэвид Эванс",
      position: "Менеджер сообщества",
      bio: "Специалист по построению и поддержке обучающих сообществ.",
      avatar: "👨‍💼"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            О TechEd
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы делаем качественное техническое образование доступным для каждого
          </p>
        </div>

        <section className="mb-20 animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Наша история
            </h2>
            <Card className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                TechEd был основан в 2018 году с простой миссией: сделать качественное техническое 
                образование доступным для каждого, независимо от происхождения или местоположения. 
                Мы верим, что технологии обладают силой изменять жизни, и мы стремимся дать людям 
                навыки, необходимые для успеха в цифровую эпоху.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Начиная с небольших онлайн-курсов, мы выросли в полноценную образовательную платформу, 
                которая помогла тысячам студентов по всему миру начать карьеру в IT.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-20 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Наши ценности
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Инновации</h3>
              <p className="text-gray-600">
                Мы постоянно ищем новые и лучшие способы доставки образовательного контента, 
                используя современные технологии и методики обучения.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Инклюзивность</h3>
              <p className="text-gray-600">
                Мы обеспечиваем доступность нашей платформы для всех учащихся, создавая 
                инклюзивную и welcoming среду для людей из разных背景.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Сотрудничество</h3>
              <p className="text-gray-600">
                Мы верим, что лучшее обучение происходит, когда мы работаем вместе. 
                Мы поощряем совместное обучение и обмен знаниями.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Стремление к excellence</h3>
              <p className="text-gray-600">
                Мы стремимся к высочайшим стандартам в наших курсах и услугах, 
                постоянно улучшая качество образовательного опыта.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-20 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Знакомьтесь с командой
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-xl transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">
                  {member.position}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20 animate-fade-in-up">
          <div className="bg-blue-600 rounded-2xl p-8 text-white text-center">
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Присоединяйтесь к нашему сообществу
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
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