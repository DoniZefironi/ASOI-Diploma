'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const CareerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Career Guidance
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore your potential and find the perfect career path in the tech world.
          </p>
        </div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">
            Assess Your Skills
          </h2>
          
          <Card className="max-w-2xl mx-auto p-8 animate-slide-in-left">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Career Assessment Test
            </h3>
            <p className="text-gray-600 mb-6">
              Take our comprehensive test to discover your strengths and interests in the tech field.
            </p>
            <Button variant="primary" className="px-8 py-3">
              Start Test
            </Button>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-fade-in-up">
            Explore Career Paths
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              'Software Developer',
              'Data Scientist',
              'Cybersecurity Analyst',
              'IoT Engineer',
              'Electronics Engineer',
              'Technical Writer'
            ].map((career, index) => (
              <div
                key={career}
                className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">💻</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-800">{career}</h4>
              </div>
            ))}
          </div>

          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Featured Articles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-t-xl flex items-center justify-center">
                  <span className="text-4xl">📈</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">
                    Top Skills for Tech Professionals in 2024
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Stay ahead of the curve with the most in-demand skills in the tech industry.
                  </p>
                  <Button variant="primary" className="w-full">
                    Read More
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-green-100 to-teal-200 rounded-t-xl flex items-center justify-center">
                  <span className="text-4xl">🚀</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">
                    Choosing the Right Programming Language for Your Career
                  </h4>
                  <p className="text-gray-600 mb-4">
                    A guide to selecting the best programming language based on your career goals.
                  </p>
                  <Button variant="primary" className="w-full">
                    Read More
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-200 rounded-t-xl flex items-center justify-center">
                  <span className="text-4xl">🔮</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">
                    The Future of Work in the Tech Industry
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Insights into emerging trends and future career opportunities in the tech sector.
                  </p>
                  <Button variant="primary" className="w-full">
                    Read More
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