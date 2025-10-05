'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import { useAuth } from '@/shared/lib/auth-context';

interface AuthForm {
  username: string;
  email: string;
  password: string;
}

export const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthForm>({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<AuthForm>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof AuthForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthForm> = {};

    if (isLogin) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
    } else {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const url = isLogin 
        ? 'http://localhost:2904/auth/login'
        : 'http://localhost:2904/auth/register';

      const payload = isLogin
        ? { 
            username: formData.username,
            password: formData.password 
          }
        : { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
          };

      console.log('Sending request to:', url);
      console.log('Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      if (isLogin) {
        if (data.access_token) {
          const token = data.access_token;
          const userData = {
            id: data.user?.id?.toString() || '1',
            username: data.user?.username || formData.username,
            email: data.user?.email || formData.email || `${formData.username}@example.com`
          };

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          if (login) login(token, userData);
          
          alert('🎉 Welcome back!');
          window.location.href = '/';
        } else {
          throw new Error('No access token received');
        }
      } else {
        alert('✅ Account created successfully! Please sign in.');
        setIsLogin(true);
        setFormData({
          username: formData.username, 
          email: '',
          password: ''
        });
      }

    } catch (error) {
      console.error('Auth error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-4">TechLearn</h1>
          <nav className="flex justify-center space-x-6 text-gray-400 mb-8">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
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
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center text-gray-500 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-5 h-5 mr-2 relative">
                  <Image
                    src="/icons/google.png"
                    alt="Google icon"
                    width={20}
                    height={20}
                  />
                </span>
                Google
              </button>
              <button className="flex items-center justify-center text-gray-500 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-5 h-5 mr-2 relative">
                  <Image
                    src="/icons/git.png"
                    alt="GitHub icon"
                    width={20}
                    height={20}
                  />
                </span>
                GitHub
              </button>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-400">
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