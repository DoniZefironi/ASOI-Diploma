'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData = [
    {
      category: "Общее",
      items: [
        {
          question: "Что такое TechLearn?",
          answer: "TechLearn — это онлайн-платформа для обучения, предлагающая курсы по информатике, электронике, английскому языку и IoT. Мы предоставляем карьерное ориентирование и симулятор схем для улучшения вашего учебного опыта."
        },
        {
          question: "Как создать аккаунт?",
          answer: "Нажмите кнопку 'Регистрация' в правом верхнем углу, заполните свои данные и подтвердите адрес электронной почты. Это быстро и просто!"
        },
        {
          question: "Какие курсы предлагает TechLearn?",
          answer: "Мы предлагаем курсы по программированию, электронике, IoT, английскому для IT-специалистов и карьерному развитию. Наш каталог включает уровни от начального до продвинутого."
        }
      ]
    },
    {
      category: "Курсы",
      items: [
        {
          question: "Как записаться на курс?",
          answer: "Просмотрите наш каталог, выберите курс и нажмите 'Записаться сейчас'. Некоторые курсы бесплатные, другие требуют оплаты."
        },
        {
          question: "Курсы проходят в свободном темпе?",
          answer: "Да, большинство наших курсов проходят в свободном темпе. Вы можете учиться в удобное для вас время и получать доступ к материалам в любое время."
        },
        {
          question: "Получу ли я сертификат по завершении?",
          answer: "Да, вы получите сертификат об окончании для всех платных курсов и некоторых бесплатных курсов, которые включают аттестацию."
        }
      ]
    },
    {
      category: "Оплата",
      items: [
        {
          question: "Какие методы оплаты вы принимаете?",
          answer: "Мы принимаем кредитные/дебетовые карты, PayPal и банковские переводы. Все платежи защищены и зашифрованы."
        },
        {
          question: "Можно ли получить возврат средств?",
          answer: "Да, мы предлагаем 14-дневную политику возврата для всех курсов. Обратитесь в нашу службу поддержки для запроса на возврат."
        }
      ]
    },
    {
      category: "Технические требования",
      items: [
        {
          question: "Какие технические требования для курсов?",
          answer: "Вам нужен современный веб-браузер, стабильное интернет-соединение и для некоторых курсов — специальное программное обеспечение, такое как Python IDE или инструменты для моделирования схем."
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
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Часто задаваемые вопросы
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Найдите ответы на распространённые вопросы о нашей платформе, курсах, оплате и технических требованиях.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск ответов"
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
              <h2 className="text-2xl font-bold text-gh-fg mb-6">
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
                        <h3 className="text-lg font-semibold text-gh-fg pr-4">
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
            <h3 className="text-2xl font-bold text-gh-fg mb-4">
              Ничего не найдено
            </h3>
            <p className="text-white mb-6">
              Попробуйте другие поисковые запросы или просмотрите наши категории выше.
            </p>
          </div>
        )}

        <div className="text-center mt-20 animate-fade-in-up">
          <Card className="p-8 bg-blue-50 border-blue-200">
            <h3 className="text-2xl font-bold text-gh-fg mb-4">
              Остались вопросы?
            </h3>
            <p className="text-white mb-6">
              Не нашли то, что искали? Наша служба поддержки всегда готова помочь.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/contacts'}
              >
                Связаться с поддержкой
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.href = '/courses'}
              >
                Просмотреть курсы
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};