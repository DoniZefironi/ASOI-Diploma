// components/auth/AuthPage.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import { useAuth } from '@/shared/lib/auth-context';

interface AuthForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  captchaAnswer: string;
}

interface AuthFormErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  acceptTerms?: string;
  captcha?: string;
}

export const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AuthForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
    captchaAnswer: ''
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  
  // Генерация случайных чисел для капчи
  const [captchaNumbers, setCaptchaNumbers] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof AuthFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const refreshCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaNumbers({ num1, num2, answer: num1 + num2 });
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
    setErrors(prev => ({ ...prev, captcha: '' } as AuthFormErrors));
  };

  const validateForm = (): boolean => {
    const newErrors: AuthFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Электронная почта обязательна для заполнения.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Электронная почта недействительна.';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен для заполнения.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать не менее 6 символов.';
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Имя обязательно для заполнения.';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Фамилия обязательна для заполнения.';
      }
      
      // Валидация чекбокса принятия условий
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Необходимо принять условия обслуживания.';
      }
      
      // Валидация капчи
      const userAnswer = parseInt(formData.captchaAnswer);
      if (isNaN(userAnswer)) {
        newErrors.captcha = 'Введите ответ.';
      } else if (userAnswer !== captchaNumbers.answer) {
        newErrors.captcha = `Неверный ответ. Правильный ответ: ${captchaNumbers.answer}`;
      }
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
            email: formData.email,
            password: formData.password
          }
        : {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName
          };

      console.log('Отправка запроса на:', url);
      console.log('Тело запроса:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Запрос не удался.');
      }

      if (isLogin) {
        if (data.access_token) {
          const token = data.access_token;
          const userData = {
            id: data.user?.id?.toString() || '1',
            email: data.user?.email || formData.email,
            firstName: data.user?.firstName || '',
            lastName: data.user?.lastName || '',
            roles: data.user?.roles || ['REGISTERED_USER']
          };

          localStorage.setItem('access_token', token);
          localStorage.setItem('user', JSON.stringify(userData));

          if (login) login(token, userData);

          alert('🎉 С возвращением!');
          window.location.href = '/';
        } else {
          throw new Error('Маркер доступа не получен.');
        }
      } else {
        alert('✅ Аккаунт успешно создан! Пожалуйста, войдите в систему.');
        setIsLogin(true);
        setFormData({
          email: formData.email,
          password: '',
          firstName: '',
          lastName: '',
          acceptTerms: false,
          captchaAnswer: ''
        });
        // Обновить капчу
        refreshCaptcha();
      }

    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      alert(error instanceof Error ? error.message : 'Произошла ошибка.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">EduTech</h1>
          <nav className="flex justify-center space-x-6 text-gray-400 mb-8">
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Курсы</Link>
            <Link href="/career" className="hover:text-blue-600 transition-colors">Карьерные пути</Link>
            <Link href="/simulator" className="hover:text-blue-600 transition-colors">Симулятор схем</Link>
          </nav>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="max-w-md mx-auto">
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
                Войти
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 font-semibold text-center transition-colors ${
                  !isLogin
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Создать аккаунт
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isLogin ? 'С возвращением в EduTech!' : 'Присоединиться к EduTech'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Имя
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Введите ваше имя"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Фамилия
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Введите вашу фамилию"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Введите ваш email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите ваш пароль"
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
                    <span className="ml-2 text-sm text-gray-600">Запомнить меня</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Забыли пароль?
                  </Link>
                </div>
              )}

              {!isLogin && (
                <>
                  <div>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Я согласен(на) с <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">Условиями обслуживания</Link> и <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">Политикой конфиденциальности</Link>.
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
                    )}
                  </div>

                  {/* Капча */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Проверка на робота 🤖
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white px-4 py-2 rounded-lg border border-gray-300">
                        <span className="text-lg font-bold text-gray-800">
                          {captchaNumbers.num1} + {captchaNumbers.num2} = ?
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="text-blue-600 hover:text-blue-700 p-2"
                        title="Обновить капчу"
                      >
                        🔄
                      </button>
                    </div>
                    <input
                      type="number"
                      name="captchaAnswer"
                      value={formData.captchaAnswer}
                      onChange={handleChange}
                      placeholder="Введите ответ"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black ${
                        errors.captcha ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.captcha && (
                      <p className="text-red-500 text-sm mt-1">{errors.captcha}</p>
                    )}
                  </div>
                </>
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

            <div className="text-center mt-8 text-sm text-gray-400">
              {isLogin ? (
                <p>
                  Нет аккаунта?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              ) : (
                <p>
                  Уже есть аккаунт?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Войти
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};