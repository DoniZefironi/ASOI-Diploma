'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">TechLearn</h1>
          <nav className="flex justify-center space-x-6 text-gray-600 mb-8">
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
            <Link href="/career" className="hover:text-blue-600 transition-colors">Career Paths</Link>
            <Link href="/simulator" className="hover:text-blue-600 transition-colors">Circuit Simulator</Link>
          </nav>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="max-w-md mx-auto animate-fade-in-up animate-delay-100">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex mb-8 border-b border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 font-semibold text-center transition-colors ${
                  isLogin
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 font-semibold text-center transition-colors ${
                  !isLogin
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Create Account
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isLogin ? 'Welcome back to TechLearn' : 'Join TechLearn'}
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              {isLogin
                ? 'Sign in to your account or create a new one'
                : 'Create your account to start learning'}
            </p>

            <form className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isLogin ? 'Email or Username' : 'Email'}
                </label>
                <input
                  type={isLogin ? "text" : "email"}
                  placeholder={isLogin ? "Enter your email or username" : "Enter your email"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {isLogin && (
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Forgot your password?
                  </Link>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the Terms of Service and Privacy Policy
                    </span>
                  </label>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-lg font-semibold"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-5 h-5 mr-2">🎯</span>
                Google
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-5 h-5 mr-2">💼</span>
                GitHub
              </button>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-600">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};