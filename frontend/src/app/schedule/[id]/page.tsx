'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  content?: string;
  startTime: string;
  endTime: string;
  type: 'lecture' | 'practice' | 'lab' | 'test';
  courseGroupId: number;
  videoUrl?: string;
  materialsUrl?: string;
  assignmentDescription?: string;
  location?: string;
  courseGroup?: {
    id: number;
    name: string;
    course?: {
      id: number;
      name: string;
    };
  };
  instructor?: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

export default function ScheduleItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = parseInt(params?.id as string);

  const [item, setItem] = useState<ScheduleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const loadItem = async () => {
    try {
      const data = await apiClient.get(`/schedule/${itemId}`);
      setItem(data);
    } catch (error) {
      console.error('Failed to load schedule item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Дата не указана';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Проверяем, является ли уже ссылкой для встраивания
    if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) {
      return url;
    }
    
    // Извлекаем ID видео из обычной ссылки YouTube
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    
    // Если ссылка не распознана, возвращаем как есть (для других платформ)
    return url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gh-canvas py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Занятие не найдено</div>
        </div>
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      lecture: { label: 'Лекция', color: 'bg-blue-600' },
      practice: { label: 'Практика', color: 'bg-green-600' },
      lab: { label: 'Лабораторная', color: 'bg-purple-600' },
      test: { label: 'Тест', color: 'bg-yellow-600' },
    };
    return types[type] || { label: type, color: 'bg-gray-600' };
  };

  const typeInfo = getTypeBadge(item.type);
  const embedUrl = getYouTubeEmbedUrl(item.videoUrl || '');

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Назад к дашборду
          </Link>
        </div>

        <div className="bg-gh-canvas-overlay rounded-xl p-8 border border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 ${typeInfo.color} text-white text-sm rounded-full`}>
                  {typeInfo.label}
                </span>
                <span className="text-gray-400 text-sm">
                  {formatDateTime(item.startTime)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gh-fg">{item.title}</h1>
            </div>
          </div>

          {item.description && (
            <p className="text-gray-300 text-lg mb-6">{item.description}</p>
          )}

          {/* Информация о курсе и преподавателе */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {item.courseGroup?.course && (
              <div className="bg-gh-canvas rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-1">📚 Курс</h4>
                <p className="text-white">{item.courseGroup.course.name}</p>
              </div>
            )}
            {item.instructor && (
              <div className="bg-gh-canvas rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-1">👨‍🏫 Преподаватель</h4>
                <p className="text-white">{item.instructor.firstName} {item.instructor.lastName}</p>
              </div>
            )}
            {item.location && (
              <div className="bg-gh-canvas rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-1">📍 Место проведения</h4>
                <p className="text-white">{item.location}</p>
              </div>
            )}
          </div>

          {/* Видео-лекция */}
          {embedUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gh-fg mb-4">📺 Видео</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <iframe
                  src={embedUrl}
                  title="Video lecture"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              {item.videoUrl && !embedUrl.includes('youtube.com') && (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                >
                  🔗 Открыть видео в новом окне
                </a>
              )}
            </div>
          )}

          {/* Описание задания */}
          {item.assignmentDescription && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gh-fg mb-4">📝 Задание</h3>
              <div className="bg-gh-canvas rounded-lg p-6">
                <p className="text-gray-300 whitespace-pre-wrap">{item.assignmentDescription}</p>
              </div>
            </div>
          )}

          {/* Материалы */}
          {item.materialsUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gh-fg mb-4">📚 Материалы</h3>
              <div className="bg-gh-canvas rounded-lg p-4">
                <a
                  href={item.materialsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  📎 Скачать материалы
                </a>
              </div>
            </div>
          )}

          {/* Контент занятия */}
          {item.content && (
            <div>
              <h3 className="text-xl font-semibold text-gh-fg mb-4">📄 Контент</h3>
              <div className="bg-gh-canvas rounded-lg p-6">
                <div className="text-gray-300 whitespace-pre-wrap">{item.content}</div>
              </div>
            </div>
          )}

          {/* Действия */}
          <div className="mt-8 flex gap-4">
            {item.type === 'test' && (
              <Button
                variant="primary"
                onClick={() => router.push(`/schedule/${itemId}/test`)}
              >
                Пройти тест
              </Button>
            )}
            {item.assignmentDescription && (
              <Button
                variant="secondary"
                onClick={() => router.push(`/schedule/${itemId}/submit`)}
              >
                Сдать задание
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
