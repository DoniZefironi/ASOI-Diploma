'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <div className="mb-8">
          <span className="text-9xl font-bold text-blue-600 animate-bounce inline-block">4</span>
          <span className="text-9xl font-bold text-blue-600 animate-bounce inline-block animate-delay-100">0</span>
          <span className="text-9xl font-bold text-blue-600 animate-bounce inline-block animate-delay-200">4</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Страница не найдена
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
          Извините, мы не смогли найти страницу, которую вы ищете. Возможно, вы ошиблись в адресе или страница была перемещена.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button variant="primary" className="px-8 py-3 text-lg">
              Вернуться на главную
            </Button>
          </Link>
          
          <Link href="/courses">
            <Button variant="secondary" className="px-8 py-3 text-lg">
              Посмотреть курсы
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md animate-fade-in-up animate-delay-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Попробуйте следующее:
          </h3>
          <ul className="text-gray-600 text-left space-y-1">
            <li>• Проверьте правильность URL адреса</li>
            <li>• Воспользуйтесь поиском по сайту</li>
            <li>• Перейдите на главную страницу</li>
            <li>• Свяжитесь с поддержкой</li>
          </ul>
        </div>
      </div>
    </div>
  );
};