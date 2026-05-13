'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/shared/lib/auth-context';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export default function CourseAccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error'>('info');

  useEffect(() => {
    const enrollmentRequired = searchParams?.get('enrollment-required') ?? null;
    const wrongCourseType = searchParams?.get('wrong-course-type') ?? null;

    if (enrollmentRequired === 'true') {
      setMessage('Для доступа к этому разделу необходимо записаться на курс');
      setMessageType('warning');
    } else if (wrongCourseType === 'true') {
      setMessage('Этот материал доступен только для студентов другого направления');
      setMessageType('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {messageType === 'warning' && '⚠️ '}
              {messageType === 'error' && '🚫 '}
              Доступ ограничен
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg ${
                messageType === 'warning' ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-200' :
                messageType === 'error' ? 'bg-red-900/30 border border-red-700 text-red-200' :
                'bg-blue-900/30 border border-blue-700 text-blue-200'
              }`}>
                {message}
              </div>
            )}

            {!user ? (
              <div className="space-y-4">
                <p className="text-gray-300">
                  Для доступа к материалам курса необходимо зарегистрироваться на сайте.
                </p>
                <div className="flex gap-4">
                  <Link href="/auth">
                    <Button variant="primary">
                      Зарегистрироваться
                    </Button>
                  </Link>
                  <Button variant="secondary" onClick={() => router.back()}>
                    Назад
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-300">
                  У вас ещё нет активного курса. Выберите направление и запишитесь на курс, 
                  чтобы получить доступ ко всем материалам.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/courses?type=electronics">
                    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-white font-semibold">Электроника</div>
                      <div className="text-sm text-gray-400">Основы электроники и схемотехники</div>
                    </div>
                  </Link>
                  
                  <Link href="/courses?type=computer_science">
                    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <div className="text-2xl mb-2">💻</div>
                      <div className="text-white font-semibold">Информатика</div>
                      <div className="text-sm text-gray-400">Программирование на Python</div>
                    </div>
                  </Link>
                  
                  <Link href="/courses?type=iot">
                    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <div className="text-2xl mb-2">🌐</div>
                      <div className="text-white font-semibold">IoT</div>
                      <div className="text-sm text-gray-400">Интернет вещей</div>
                    </div>
                  </Link>
                  
                  <Link href="/courses?type=english">
                    <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">
                      <div className="text-2xl mb-2">📚</div>
                      <div className="text-white font-semibold">Английский</div>
                      <div className="text-sm text-gray-400">Английский для IT</div>
                    </div>
                  </Link>
                </div>

                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => router.back()}>
                    Назад
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
