'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/shared/lib/auth-context';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  const getDisplayName = () => {
    if (!user) return '';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  const getAvatarLetter = () => {
    const displayName = getDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-[#010409] text-white shadow-sm sticky top-0 z-50 border-b border-[#353C45]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EduTech
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
            <Link href="/career" className="hover:text-blue-600 transition-colors">Career</Link>
            <Link href="/forum" className="hover:text-blue-600 transition-colors">Forum</Link>
            <Link href="/complilier" className="hover:text-blue-600 transition-colors">Сompiler</Link>
            <Link href="/circuit" className="hover:text-blue-600 transition-colors">Emulator</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#1C2128] transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {getAvatarLetter()}
                    </span>
                  </div>
                  <span className="hidden md:block">{getDisplayName()}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1C2128] border border-[#353C45] rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#353C45]">
                      <p className="text-sm font-semibold">{getDisplayName()}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      👤 My Profile
                    </Link>
                    
                    <Link 
                      href="/my-courses" 
                      className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      📚 My Courses
                    </Link>
                    
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-sm hover:bg-[#2D333B] transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    
                    <div className="border-t border-[#353C45] my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2D333B] transition-colors"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth" 
                  className="text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};