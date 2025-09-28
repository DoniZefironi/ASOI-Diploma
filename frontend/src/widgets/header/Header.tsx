'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky left-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 animate-slide-in-left">
            EduTech
          </Link>
          
          <nav className="hidden md:flex space-x-6 animate-slide-in-right">
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">Courses</Link>
            <Link href="/career" className="text-gray-600 hover:text-blue-600 transition-colors">Career</Link>
          </nav>

          <div className="animate-slide-in-right">
              <Link href="/auth" className="text-gray-600 hover:text-blue-600 transition-colors">Auth</Link>
          </div>
        </div>
      </div>
    </header>
  );
};