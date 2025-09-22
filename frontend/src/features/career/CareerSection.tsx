'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const CareerSection = () => {
  return (
    <section id="career" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">
          Career Guidance
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-slide-in-left">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Interactive Circuit Emulator
            </h3>
            <p className="text-gray-600 mb-6">
              Experiment with electronic circuits using our powerful emulator. 
              Build, test, and debug your designs in a virtual environment.
            </p>
            <Button variant="primary">
              Launch Emulator
            </Button>
          </Card>

          <Card className="animate-slide-in-right">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Find Your Perfect Tech Career
            </h3>
            <p className="text-gray-600 mb-6">
              Take our career assessment to discover your strengths and interests. 
              Get personalized recommendations for tech roles and learning paths.
            </p>
            <Button variant="primary">
              Start Assessment
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};