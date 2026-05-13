// features/auth/AuthPage.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
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

// ── Inline label + input group ────────────────────────────────────
function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>{label}</label>
        {hint}
      </div>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: '#f85149', margin: 0 }}>{error}</p>
      )}
    </div>
  );
}

// ── Controlled input ──────────────────────────────────────────────
function GhInput({
  error = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{
        display: 'block',
        width: '100%',
        background: 'var(--color-canvas-default)',
        border: `1px solid ${error ? '#f85149' : focused ? '#2f81f7' : '#30363d'}`,
        borderRadius: 6,
        padding: '5px 12px',
        fontSize: 14,
        color: 'var(--color-fg-default)',
        lineHeight: 1.5,
        outline: 'none',
        boxShadow: focused
          ? `0 0 0 3px ${error ? 'rgba(248,81,73,0.25)' : 'rgba(47,129,247,0.25)'}`
          : 'none',
        transition: 'border-color 80ms, box-shadow 80ms',
        boxSizing: 'border-box',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
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
    captchaAnswer: '',
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [captchaNumbers, setCaptchaNumbers] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    const errorKey = name === 'captchaAnswer' ? 'captcha' : name as keyof AuthFormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
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
      newErrors.email = 'Электронная почта обязательна.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный адрес электронной почты.';
    }
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов.';
    }
    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Имя обязательно.';
      if (!formData.lastName.trim()) newErrors.lastName = 'Фамилия обязательна.';
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Необходимо принять условия.';
      const userAnswer = parseInt(formData.captchaAnswer);
      if (isNaN(userAnswer) || formData.captchaAnswer.trim() === '') {
        newErrors.captcha = 'Введите ответ на контрольный вопрос.';
      } else if (userAnswer !== captchaNumbers.answer) {
        newErrors.captcha = 'Неверный ответ. Попробуйте ещё раз.';
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
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, firstName: formData.firstName, lastName: formData.lastName };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        const raw = data.message || '';
        let msg = 'Произошла ошибка. Попробуйте позже.';
        if (!isLogin) {
          if (raw.toLowerCase().includes('already exists') || raw.toLowerCase().includes('conflict')) {
            msg = 'Аккаунт с таким email уже существует.';
          }
        } else {
          msg = 'Неверный email или пароль.';
        }
        throw new Error(msg);
      }
      if (isLogin) {
        if (data.access_token) {
          const token = data.access_token;
          const userData = {
            id: data.user?.id?.toString() || '1',
            email: data.user?.email || formData.email,
            firstName: data.user?.firstName || '',
            lastName: data.user?.lastName || '',
            roles: data.user?.roles || ['REGISTERED_USER'],
          };
          localStorage.setItem('access_token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          if (login) login(token, userData);
          window.location.href = '/';
        } else {
          throw new Error('Токен доступа не получен.');
        }
      } else {
        alert('Аккаунт успешно создан! Пожалуйста, войдите.');
        setIsLogin(true);
        setFormData({ email: formData.email, password: '', firstName: '', lastName: '', acceptTerms: false, captchaAnswer: '' });
        refreshCaptcha();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Произошла ошибка.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-canvas-default)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <svg height="48" viewBox="0 0 16 16" width="48" fill="#e6edf3">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
        </svg>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 300,
          color: 'var(--color-fg-default)',
          margin: '0 0 16px',
          textAlign: 'center',
        }}
      >
        {isLogin ? 'Войти в EduTech' : 'Создать аккаунт'}
      </h1>

      {/* Form card */}
      <div
        style={{
          width: '100%',
          maxWidth: 340,
          background: 'var(--color-canvas-overlay)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 6,
          padding: 16,
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Имя" error={errors.firstName}>
                <GhInput
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Иван"
                  autoComplete="given-name"
                  error={!!errors.firstName}
                />
              </Field>
              <Field label="Фамилия" error={errors.lastName}>
                <GhInput
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Иванов"
                  autoComplete="family-name"
                  error={!!errors.lastName}
                />
              </Field>
            </div>
          )}

          <Field label="Email" error={errors.email}>
            <GhInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              error={!!errors.email}
            />
          </Field>

          <Field
            label="Пароль"
            error={errors.password}
            hint={
              isLogin ? (
                <Link href="/forgot-password" style={{ fontSize: 12, color: '#2f81f7', textDecoration: 'none' }}>
                  Забыли пароль?
                </Link>
              ) : undefined
            }
          >
            <GhInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLogin ? '' : 'Минимум 6 символов'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              error={!!errors.password}
            />
          </Field>

          {isLogin && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                style={{ width: 14, height: 14, accentColor: '#2f81f7' }}
              />
              <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Запомнить меня</span>
            </label>
          )}

          {!isLogin && (
            <>
              <Field label="" error={errors.acceptTerms}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    style={{ marginTop: 2, width: 14, height: 14, accentColor: '#2f81f7', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--color-fg-muted)', lineHeight: 1.5 }}>
                    Я согласен(на) с{' '}
                    <Link href="/terms" target="_blank" style={{ color: '#2f81f7', textDecoration: 'none' }}>
                      Условиями обслуживания
                    </Link>
                    {' '}и{' '}
                    <Link href="/privacy" target="_blank" style={{ color: '#2f81f7', textDecoration: 'none' }}>
                      Политикой конфиденциальности
                    </Link>
                  </span>
                </label>
              </Field>

              {/* Captcha */}
              <div
                style={{
                  background: 'var(--color-canvas-default)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 6,
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)' }}>
                  Подтверждение: не робот
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      background: 'var(--color-canvas-overlay)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 14,
                      fontFamily: 'ui-monospace, monospace',
                      color: 'var(--color-fg-default)',
                      fontWeight: 600,
                      letterSpacing: 2,
                    }}
                  >
                    {captchaNumbers.num1} + {captchaNumbers.num2} = ?
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    title="Обновить"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-fg-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: 14,
                    }}
                  >
                    ↻
                  </button>
                </div>
                <GhInput
                  type="number"
                  name="captchaAnswer"
                  value={formData.captchaAnswer}
                  onChange={handleChange}
                  placeholder="Ответ"
                  error={!!errors.captcha}
                />
                {errors.captcha && (
                  <p style={{ fontSize: 12, color: '#f85149', margin: 0 }}>{errors.captcha}</p>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="success"
            size="md"
            loading={isLoading}
            style={{ width: '100%', fontWeight: 600 }}
          >
            {isLogin ? 'Войти' : 'Создать аккаунт'}
          </Button>
        </form>
      </div>

      {/* Switch mode */}
      <div
        style={{
          width: '100%',
          maxWidth: 340,
          background: 'var(--color-canvas-overlay)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 6,
          padding: '16px',
          marginTop: 12,
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--color-fg-muted)',
        }}
      >
        {isLogin ? (
          <span>
            Нет аккаунта?{' '}
            <button
              onClick={() => setIsLogin(false)}
              style={{ background: 'none', border: 'none', color: '#2f81f7', cursor: 'pointer', fontSize: 13 }}
            >
              Зарегистрироваться
            </button>
          </span>
        ) : (
          <span>
            Уже есть аккаунт?{' '}
            <button
              onClick={() => setIsLogin(true)}
              style={{ background: 'none', border: 'none', color: '#2f81f7', cursor: 'pointer', fontSize: 13 }}
            >
              Войти
            </button>
          </span>
        )}
      </div>

      {/* Footer links */}
      <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { href: '/terms',    label: 'Условия' },
          { href: '/privacy',  label: 'Конфиденциальность' },
          { href: '/about',    label: 'О нас' },
          { href: '/contacts', label: 'Контакты' },
          { href: '/faq',      label: 'FAQ' },
        ].map(l => (
          <Link
            key={l.href}
            href={l.href}
            style={{ fontSize: 11, color: 'var(--color-fg-muted)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
