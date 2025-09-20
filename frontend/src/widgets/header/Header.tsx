'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 animate-slide-in-left">
            TechEd
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 animate-slide-in-right">
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">
              Каталог
            </Link>
            <Link href="/career" className="text-gray-600 hover:text-blue-600 transition-colors">
              Карьера
            </Link>
            <Link href="/simulator" className="text-gray-600 hover:text-blue-600 transition-colors">
              Симмуляторы
            </Link>
            <Link href="/contacts" className="text-gray-600 hover:text-blue-600 transition-colors">
              Контакты
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              О нас
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="secondary" className="px-4 py-2">
                Регистрация
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="primary" className="px-4 py-2">
                Вход
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};