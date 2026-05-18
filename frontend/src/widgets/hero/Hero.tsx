'use client';

import { Button } from '@/shared/ui/button';

export const Hero = () => {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
          Раскройте свой потенциал с <span className="text-blue-400">EduTech</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
          Исследуйте широкий спектр курсов по информатике, электронике, английскому языку и IoT.
          Приобретайте практические навыки и продвигайте свою карьеру.
        </p>

        <div className="w-24 h-1 bg-blue-500 mx-auto mb-10 animate-fade-in-up animate-delay-200"></div>

        <div className="animate-fade-in-up animate-delay-300">
          <Button
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Начать
          </Button>
        </div>
      </div>
    </section>
  );
};
