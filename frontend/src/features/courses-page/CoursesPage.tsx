'use client';

import { CourseCard } from '@/shared/ui/card/CourseCard';

const courses = [
  {
    id: 1,
    title: "Английский для IT-специалистов",
    description: "Совершенствуйте английский язык для работы в международных IT-компаниях и общения с зарубежными коллегами.",
    level: "ВСЕ УРОВНИ",
    levelColor: "bg-blue-100 text-blue-800",
    category: "language"
  },
  {
    id: 2,
    title: "Электроника и схемотехника",
    description: "Изучите основы электроники, проектирование схем и работу с современными электронными компонентами.",
    level: "НАЧИНАЮЩИЙ",
    levelColor: "bg-green-100 text-green-800",
    category: "electronics"
  },
  {
    id: 3,
    title: "Основы информатики и программирования",
    description: "Получите фундаментальные знания в области информатики и освоите базовые навыки программирования.",
    level: "НАЧИНАЮЩИЙ",
    levelColor: "bg-green-100 text-green-800",
    category: "computer-science"
  },
  {
    id: 4,
    title: "Интернет вещей (IoT)",
    description: "Изучите создание умных устройств, подключенных к интернету, и основы работы с IoT-платформами.",
    level: "СРЕДНИЙ",
    levelColor: "bg-yellow-100 text-yellow-800",
    category: "iot"
  }
];

export const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Наши курсы
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Выберите направление обучения и начните свой путь в IT-индустрии
          </p>
        </div>

        <div className="w-24 h-1 bg-blue-600 mx-auto mb-16 animate-slide-in-left"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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