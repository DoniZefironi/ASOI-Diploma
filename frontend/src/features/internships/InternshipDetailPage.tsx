'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useInternship, trackInternshipView, applyToInternship, getUserApplication } from '@/shared/api/internships';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  MapPin, Clock, Banknote, Building2, ChevronLeft,
  Calendar, ExternalLink, Mail, CheckCircle, Briefcase,
  TrendingUp, Star, Loader2
} from 'lucide-react';

const FORMAT_LABELS: Record<string, { label: string; color: string }> = {
  remote: { label: 'Удалённо', color: 'bg-green-600/20 border-green-700 text-green-400' },
  office: { label: 'Офис', color: 'bg-blue-600/20 border-blue-700 text-blue-400' },
  hybrid: { label: 'Гибрид', color: 'bg-purple-600/20 border-purple-700 text-purple-400' },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Converts HH API url (api.hh.ru/vacancies/ID) to the public vacancy page (hh.ru/vacancy/ID) */
function toVacancyUrl(url: string): string {
  try {
    const match = url.match(/\/vacancies?\/(\d+)/);
    if (match) return `https://hh.ru/vacancy/${match[1]}`;
  } catch {}
  return url;
}

interface Props {
  id: number;
}

export default function InternshipDetailPage({ id }: Props) {
  const { internship, isLoading, isError } = useInternship(id);
  const [applied, setApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);

  // Отслеживание просмотра при загрузке страницы
  useEffect(() => {
    if (internship) {
      trackInternshipView(id).catch(console.error);
    }
  }, [internship, id]);

  // Проверка существующей заявки
  useEffect(() => {
    if (internship) {
      getUserApplication(id)
        .then(app => {
          if (app) {
            setApplied(true);
          }
        })
        .catch(console.error);
    }
  }, [internship, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <p className="text-gray-400">Загрузка...</p>
      </div>
    );
  }

  if (isError || !internship) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-red-400 text-lg mb-4">Стажировка не найдена</p>
          <Link href="/internships">
            <Button variant="secondary">← К стажировкам</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const fmt = FORMAT_LABELS[internship.format] ?? FORMAT_LABELS.office;
  const deadline = formatDate(internship.deadline);
  const isExpired = internship.deadline && new Date(internship.deadline) < new Date();

  const handleApply = async () => {
    if (!internship) return;

    setIsApplying(true);
    setApplicationError(null);

    try {
      // Сохраняем заявку в базу
      await applyToInternship(id);
      setApplied(true);

      // Открываем внешнюю ссылку или почту
      if (internship.applicationUrl) {
        window.open(toVacancyUrl(internship.applicationUrl), '_blank', 'noopener');
      } else if (internship.applicationEmail) {
        window.location.href = `mailto:${internship.applicationEmail}?subject=Заявка на стажировку: ${internship.title}`;
      }
    } catch (error: any) {
      setApplicationError(error.message || 'Ошибка при подаче заявки');
    } finally {
      setIsApplying(false);
    }
  };

  const canApply = !isExpired && (internship.applicationEmail || internship.applicationUrl);

  return (
    <div className="min-h-screen bg-[#0D1117] py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back */}
        <div className="mb-6">
          <Link href="/internships">
            <Button variant="secondary" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Все стажировки
            </Button>
          </Link>
        </div>

        {/* Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2.5 py-1 border rounded-full text-xs font-medium ${fmt.color}`}>
                  {fmt.label}
                </span>
                {isExpired && (
                  <span className="px-2.5 py-1 bg-red-900/30 border border-red-700 text-red-400 rounded-full text-xs">
                    Приём заявок завершён
                  </span>
                )}
                {internship.tags?.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-700/50 text-gray-400 rounded-full text-xs">{tag}</span>
                ))}
              </div>

              <h1 className="text-2xl font-bold text-white mb-2">{internship.title}</h1>

              <div className="flex items-center gap-2 text-gray-300 mb-4">
                <Building2 className="h-5 w-5 text-gray-400 shrink-0" />
                <span className="font-semibold text-lg">{internship.company}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-400">
                {internship.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{internship.location}</span>
                  </div>
                )}
                {internship.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{internship.duration}</span>
                  </div>
                )}
                {internship.salary && (
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 shrink-0" />
                    <span>{internship.salary}</span>
                  </div>
                )}
                {deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Приём заявок до {deadline}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Apply button */}
            <div className="shrink-0 flex flex-col items-end gap-2">
              {applicationError && (
                <div className="px-4 py-2 bg-red-600/20 border border-red-600 text-red-400 rounded-lg text-sm font-medium">
                  {applicationError}
                </div>
              )}

              {applied ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600 text-green-400 rounded-lg text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Заявка отправлена
                </div>
              ) : canApply ? (
                <Button
                  variant="primary"
                  onClick={handleApply}
                  disabled={isApplying}
                  className="bg-blue-600 hover:bg-blue-700 gap-2 disabled:opacity-50"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Отправка...
                    </>
                  ) : internship.applicationUrl ? (
                    <><ExternalLink className="h-4 w-4" /> Подать заявку</>
                  ) : (
                    <><Mail className="h-4 w-4" /> Написать на почту</>
                  )}
                </Button>
              ) : !isExpired ? (
                <p className="text-sm text-gray-500">Контакты не указаны</p>
              ) : null}

              {internship.applicationEmail && !internship.applicationUrl && (
                <p className="text-xs text-gray-500">{internship.applicationEmail}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-5">
            {/* Description */}
            <Card className="p-5">
              <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-400" />
                О стажировке
              </h2>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{internship.description}</p>
            </Card>

            {/* Requirements */}
            {internship.requirements && (
              <Card className="p-5">
                <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Требования к кандидату
                </h2>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{internship.requirements}</p>
              </Card>
            )}

            {/* Prospects */}
            {internship.prospects && (
              <Card className="p-5">
                <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Перспективы
                </h2>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{internship.prospects}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Company */}
            {internship.companyDescription && (
              <Card className="p-5">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  О компании
                </h3>
                <p className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">{internship.companyDescription}</p>
              </Card>
            )}

            {/* Quick info */}
            <Card className="p-5">
              <h3 className="text-white font-semibold mb-3">Детали</h3>
              <dl className="space-y-2.5 text-sm">
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Формат</dt>
                  <dd className="text-gray-300">{fmt.label}</dd>
                </div>
                {internship.location && (
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Местоположение</dt>
                    <dd className="text-gray-300">{internship.location}</dd>
                  </div>
                )}
                {internship.duration && (
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Продолжительность</dt>
                    <dd className="text-gray-300">{internship.duration}</dd>
                  </div>
                )}
                {internship.salary && (
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Компенсация</dt>
                    <dd className="text-gray-300">{internship.salary}</dd>
                  </div>
                )}
                {deadline && (
                  <div>
                    <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Дедлайн заявок</dt>
                    <dd className={isExpired ? 'text-red-400' : 'text-gray-300'}>{deadline}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {/* Apply CTA repeated for sidebar */}
            {canApply && !applied && (
              <Button
                variant="primary"
                onClick={handleApply}
                disabled={isApplying}
                className="w-full bg-blue-600 hover:bg-blue-700 gap-2 disabled:opacity-50"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : internship.applicationUrl ? (
                  <><ExternalLink className="h-4 w-4" /> Подать заявку</>
                ) : (
                  <><Mail className="h-4 w-4" /> Написать на почту</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
