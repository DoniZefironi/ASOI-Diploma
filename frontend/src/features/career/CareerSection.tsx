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
      title: "Interactive Circuit Emulator",
      description: "Experiment with electronic circuits using our powerful emulator. Build, test, and debug your designs in a virtual environment.",
      buttonText: "Launch Emulator"
    },
    {
      title: "Find Your Perfect Tech Career",
      description: "Take our career assessment to discover your strengths and interests. Get personalized recommendations for tech roles and learning paths.",
      buttonText: "Start Assessment"
    }
  ];

  return (
    <section id="career" className="py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Career Guidance
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock your potential with our career tools and resources
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
                    <h3 className="text-2xl font-bold text-white">
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
              title: "Resume Builder",
              description: "Create professional tech resumes",
              stat: "500+"
            },
            {
              title: "Mock Interviews",
              description: "Practice with industry experts",
              stat: "95%"
            },
            {
              title: "Job Matches",
              description: "Personalized job recommendations",
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
                <div className="text-3xl font-bold text-white mb-2">{item.stat}</div>
                <h4 className="font-semibold text-white mb-3 text-lg">{item.title}</h4>
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
            Ready to Start Your Tech Career?
          </h3>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers with our guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="px-8 py-3 text-lg font-semibold">
              Explore Courses
            </Button>
            <Button variant="primary" className="px-8 py-3 text-lg font-semibold">
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};