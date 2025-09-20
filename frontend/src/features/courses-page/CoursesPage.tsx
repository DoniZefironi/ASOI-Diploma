'use client';

import { CourseCard } from '@/shared/ui/card/CourseCard';

const courses = [
  {
    id: 1,
    title: "Основы программирования на Python",
    description: "Изучите основы программирования с помощью Python, одного из самых популярных языков в мире.",
    level: "НАЧИНАЮЩИЙ",
    levelColor: "bg-green-100 text-green-800"
  },
  {
    id: 2,
    title: "Алгоритмы и структуры данных",
    description: "Изучите основные алгоритмы и структуры данных, необходимые для разработки эффективных программ.",
    level: "СРЕДНИЙ",
    levelColor: "bg-blue-100 text-blue-800"
  },
  {
    id: 3,
    title: "Основы работы с базами данных",
    description: "Изучите, как работать с базами данных, включая SQL запросы и управление данными.",
    level: "НАЧИНАЮЩИЙ",
    levelColor: "bg-green-100 text-green-800"
  },
  {
    id: 4,
    title: "Веб-разработка: HTML, CSS и JavaScript",
    description: "Изучите основы создания веб-сайтов с помощью HTML, CSS и JavaScript.",
    level: "НАЧИНАЮЩИЙ",
    levelColor: "bg-green-100 text-green-800"
  },
  {
    id: 5,
    title: "Разработка мобильных приложений на Android",
    description: "Изучите, как создавать приложения для Android с помощью Java и Kotlin.",
    level: "СРЕДНИЙ",
    levelColor: "bg-blue-100 text-blue-800"
  },
  {
    id: 6,
    title: "Введение в искусственный интеллект",
    description: "Изучите основы искусственного интеллекта и машинного обучения.",
    level: "ПРОДВИНУТЫЙ",
    levelColor: "bg-purple-100 text-purple-800"
  }
];

export const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Курсы по информатике
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите курс, который подходит именно вам, и начните свой путь в IT.
          </p>
        </div>

        <div className="w-24 h-1 bg-blue-600 mx-auto mb-16 animate-slide-in-left"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard
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