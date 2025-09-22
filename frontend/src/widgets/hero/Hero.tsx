'use client';

import { Button } from '@/shared/ui/button';

export const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
          Unlock Your Potential with <span className="text-blue-400">EduTech</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100">
          Explore a wide range of courses in computer science, electronics, English, and IoT. 
          Gain practical skills and advance your career.
        </p>

        <div className="w-24 h-1 bg-blue-500 mx-auto mb-10 animate-fade-in-up animate-delay-200"></div>

        <div className="animate-fade-in-up animate-delay-300">
          <Button 
            variant="primary" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </div>

      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500 rounded-full opacity-20 animate-pulse animate-delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-500 rounded-full opacity-20 animate-pulse animate-delay-2000"></div>
    </section>
  );
};