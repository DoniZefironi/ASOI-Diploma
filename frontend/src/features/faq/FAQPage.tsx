'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      category: "General",
      items: [
        {
          question: "What is TechLearn?",
          answer: "TechLearn is an online learning platform offering courses in computer science, electronics, English language, and IoT. We provide career guidance and a circuit simulator to enhance your learning experience."
        },
        {
          question: "How do I create an account?",
          answer: "Click on the 'Sign Up' button in the top right corner, fill in your details, and verify your email address. It's quick and easy!"
        },
        {
          question: "What courses does TechLearn offer?",
          answer: "We offer courses in programming, electronics, IoT, English for tech professionals, and career development. Our catalog includes beginner to advanced levels."
        }
      ]
    },
    {
      category: "Courses",
      items: [
        {
          question: "How do I enroll in a course?",
          answer: "Browse our catalog, select a course, and click 'Enroll Now'. Some courses are free, while others require payment."
        },
        {
          question: "Are courses self-paced?",
          answer: "Yes, most of our courses are self-paced. You can learn at your own convenience and access materials anytime."
        },
        {
          question: "Do I get a certificate upon completion?",
          answer: "Yes, you'll receive a certificate of completion for all paid courses and some free courses that include assessments."
        }
      ]
    },
    {
      category: "Payments",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards, PayPal, and bank transfers. All payments are secure and encrypted."
        },
        {
          question: "Can I get a refund?",
          answer: "Yes, we offer a 14-day refund policy for all courses. Contact our support team for refund requests."
        }
      ]
    },
    {
      category: "Technical Requirements",
      items: [
        {
          question: "What are the technical requirements for the courses?",
          answer: "You need a modern web browser, stable internet connection, and for some courses, specific software like Python IDE or circuit simulation tools."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Find answers to common questions about our platform, courses, payments, and technical requirements.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-black">🔍</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-white mb-6">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = faqData
                    .slice(0, categoryIndex)
                    .reduce((acc, cat) => acc + cat.items.length, 0) + itemIndex;
                  
                  const isOpen = openItems.includes(globalIndex);

                  return (
                    <Card key={globalIndex} className="p-6">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full text-left flex items-center justify-between"
                      >
                        <h3 className="text-lg font-semibold text-white pr-4">
                          {item.question}
                        </h3>
                        <span className="text-white text-xl transform transition-transform">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="mt-4 pl-2 animate-fade-in">
                          <p className="text-white leading-relaxed border-l-2 border-blue-500 pl-4">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center mt-16 animate-fade-in-up">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              No results found
            </h3>
            <p className="text-white mb-6">
              Try different search terms or browse our categories above.
            </p>
          </div>
        )}

        <div className="text-center mt-20 animate-fade-in-up">
          <Card className="p-8 bg-blue-50 border-blue-200">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-white mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/contacts'}
              >
                Contact Support
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.href = '/courses'}
              >
                Browse Courses
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};