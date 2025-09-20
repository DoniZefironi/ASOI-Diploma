'use client';

import { Button } from '@/shared/ui/button';

export const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 animate-fade-in-up">
          Unlock Your Potential with <span className="text-blue-600">EduTech</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
          Explore a wide range of courses in computer science, electronics, English, and IoT. 
          Gain practical skills and advance your career.
        </p>
        <div className="animate-fade-in-up animate-delay-200">
          <Button variant="primary" className="text-lg px-8 py-4">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};