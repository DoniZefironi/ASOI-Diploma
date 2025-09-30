'use client';

import { Card } from '@/shared/ui/card';

const courses = [
  {
    title: "Computer Science Fundamentals",
    description: "Learn the basics of programming, data structures, and algorithms.",
    category: "Computer Science"
  },
  {
    title: "Electronics and Circuit Design",
    description: "Design and simulate electronic circuits with our interactive emulator.",
    category: "Electronics"
  },
  {
    title: "English for Tech Professionals",
    description: "Improve your communication skills for the global tech industry.",
    category: "Language"
  },
  {
    title: "Introduction to IoT",
    description: "Explore the world of connected devices and smart systems.",
    category: "IoT"
  }
];

export const CoursesSection = () => {
  return (
    <section id="courses" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 animate-fade-in-up">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <Card 
              key={index} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="font-semibold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-white mb-3">{course.category}</p>
              <p className="text-white">{course.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};