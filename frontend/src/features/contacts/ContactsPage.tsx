'use client';

import { useState } from 'react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Обработка отправки формы
    console.log('Form submitted:', formData);
    alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Связаться с нами
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Если у вас есть вопросы, предложения или вам нужна помощь, пожалуйста, 
            свяжитесь с нами, используя информацию ниже или форму обратной связи.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-slide-in-left">
            <Card className="p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Контактная информация
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Электронная почта</h3>
                  <a 
                    href="mailto:support@edutech.com" 
                    className="text-blue-600 hover:text-blue-700 transition-colors text-lg"
                  >
                    support@edutech.com
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Телефон</h3>
                  <a 
                    href="tel:+74951234567" 
                    className="text-blue-600 hover:text-blue-700 transition-colors text-lg"
                  >
                    +7 (495) 123-45-67
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Часы работы</h3>
                  <p className="text-gray-600">Пн-Пт: 9:00 - 18:00</p>
                  <p className="text-gray-600">Сб-Вс: 10:00 - 16:00</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Адрес</h3>
                  <p className="text-gray-600">г. Москва, ул. Образцова, д. 25</p>
                  <p className="text-gray-600">Бизнес-центр "ТехноПарк", офис 304</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="animate-slide-in-right">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                Форма обратной связи
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Введите ваше имя"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Электронная почта *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Введите ваш адрес электронной почты"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Введите ваше сообщение"
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-lg font-semibold"
                >
                  Отправить
                </Button>
              </form>
            </Card>
          </div>
        </div>

        <div className="mt-20 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Наш офис</h2>
            <p className="text-gray-600">Приезжайте к нам в гости для личной консультации</p>
          </div>

          <Card className="p-6">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏢</div>
                <p className="text-gray-600">Изображение офиса</p>
                <p className="text-sm text-gray-500">г. Москва, ул. Образцова, д. 25</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Метро</h4>
                <p className="text-gray-600">м. Достоевская</p>
                <p className="text-gray-600">5 минут пешком</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Парковка</h4>
                <p className="text-gray-600">Бесплатная парковка</p>
                <p className="text-gray-600">для гостей</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Доступность</h4>
                <p className="text-gray-600">Пандус и лифт</p>
                <p className="text-gray-600">для маломобильных</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};