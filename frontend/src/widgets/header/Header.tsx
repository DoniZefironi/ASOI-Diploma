'use client';

import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-[#010409] text-white shadow-sm sticky left-0 z-50 border-b border-[#353C45]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 animate-slide-in-left">
            EduTech
          </Link>
          
          <nav className="hidden md:flex space-x-6 animate-slide-in-right">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
            <Link href="/career" className="hover:text-blue-600 transition-colors">Career</Link>
            <Link href="/forum" className="hover:text-blue-600 transition-colors">Forum</Link>
          </nav>

          <div className="animate-slide-in-right">
            <Link href="/auth" className="hover:text-blue-600 transition-colors">Auth</Link>
          </div>
        </div>
      </div>
    </header>
  );
};