'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useElectives, enrollElective, unenrollElective, Elective } from '@/shared/api/electives';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Calendar, Users, BookOpen, ChevronRight, Check } from 'lucide-react';

type FilterTab = 'all' | 'enrolled' | 'available';

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface ElectiveCardProps {
  elective: Elective;
  onEnroll: (id: number) => Promise<void>;
  onUnenroll: (id: number) => Promise<void>;
  enrollingId: number | null;
}

function ElectiveCard({ elective, onEnroll, onUnenroll, enrollingId }: ElectiveCardProps) {
  const isFull = elective.maxParticipants != null && elective.currentParticipants >= elective.maxParticipants;
  const isLoading = enrollingId === elective.id;
  const fillPercent = elective.maxParticipants
    ? Math.min(100, Math.round((elective.currentParticipants / elective.maxParticipants) * 100))
    : null;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 flex flex-col gap-3 hover:border-gray-500 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-white leading-tight">{elective.title}</h3>
        {elective.isEnrolled && (
          <span className="flex items-center gap-1 shrink-0 px-2 py-0.5 bg-green-600/20 border border-green-600 text-green-400 rounded-full text-xs font-medium">
            <Check className="h-3 w-3" />
            Записан
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {elective.courseGroupName && (
          <span className="px-2 py-0.5 bg-blue-900/40 border border-blue-700 text-blue-300 rounded-full text-xs">
            {elective.courseGroupName}
          </span>
        )}
        {elective.courseName && (
          <span className="px-2 py-0.5 bg-purple-900/40 border border-purple-700 text-purple-300 rounded-full text-xs">
            {elective.courseName}
          </span>
        )}
      </div>

      {/* Description */}
      {elective.description && (
        <p className="text-sm text-gray-400 line-clamp-2">{elective.description}</p>
      )}

      {/* Details */}
      <div className="space-y-1 text-sm text-gray-400">
        {elective.instructorName && (
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{elective.instructorName}</span>
          </div>
        )}
        {(elective.startDate || elective.endDate) && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {elective.startDate ? formatDate(elective.startDate) : '?'}
              {elective.endDate ? ` — ${formatDate(elective.endDate)}` : ''}
            </span>
          </div>
        )}
        {elective.maxParticipants != null && (
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{elective.currentParticipants} / {elective.maxParticipants} участников</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {fillPercent != null && (
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${
              fillPercent >= 100 ? 'bg-red-500' : fillPercent >= 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {elective.isEnrolled ? (
          <>
            <Link href={`/electives/${elective.id}`}>
              <Button variant="primary" size="sm" className="gap-1">
                Открыть
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="sm"
              disabled={isLoading}
              onClick={() => onUnenroll(elective.id)}
            >
              {isLoading ? 'Отмена...' : 'Отписаться'}
            </Button>
          </>
        ) : isFull ? (
          <Button variant="secondary" size="sm" disabled className="bg-red-900/30 text-red-400 border-red-700 cursor-not-allowed">
            Нет мест
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            disabled={isLoading}
            onClick={() => onEnroll(elective.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Запись...' : 'Записаться'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ElectivesPage() {
  const { electives, isLoading, isError, mutate } = useElectives();
  const [filter, setFilter] = useState<FilterTab>('all');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const filtered = electives.filter(e => {
    if (filter === 'enrolled') return e.isEnrolled;
    if (filter === 'available') return !e.isEnrolled;
    return true;
  });

  const handleEnroll = async (id: number) => {
    setEnrollingId(id);
    try {
      await enrollElective(id);
      await mutate();
    } catch (err: any) {
      alert(err?.message || 'Не удалось записаться');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleUnenroll = async (id: number) => {
    if (!confirm('Отписаться от факультатива?')) return;
    setEnrollingId(id);
    try {
      await unenrollElective(id);
      await mutate();
    } catch (err: any) {
      alert(err?.message || 'Не удалось отписаться');
    } finally {
      setEnrollingId(null);
    }
  };

  const enrolledCount = electives.filter(e => e.isEnrolled).length;
  const availableCount = electives.filter(e => !e.isEnrolled).length;

  return (
    <div className="min-h-screen bg-[#0D1117] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Факультативы</h1>
            <p className="text-gray-400 text-sm">Дополнительные курсы для вашей группы</p>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary">
              ← Дашборд
            </Button>
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
          {([
            { key: 'all', label: `Все (${electives.length})` },
            { key: 'enrolled', label: `Записан (${enrolledCount})` },
            { key: 'available', label: `Доступные (${availableCount})` },
          ] as { key: FilterTab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* States */}
        {isLoading && (
          <div className="text-center py-16 text-gray-400">
            <p>Загрузка факультативов...</p>
          </div>
        )}

        {isError && (
          <Card className="p-8 text-center">
            <p className="text-red-400">Не удалось загрузить факультативы</p>
          </Card>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-white text-lg font-semibold mb-2">
              {filter === 'enrolled'
                ? 'Вы не записаны ни на один факультатив'
                : filter === 'available'
                ? 'Нет доступных факультативов'
                : 'Факультативов пока нет'}
            </p>
            <p className="text-gray-400 text-sm">
              {electives.length === 0
                ? 'Факультативы будут доступны после зачисления в группу и их создания администратором'
                : 'Попробуйте другой фильтр'}
            </p>
          </Card>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(elective => (
              <ElectiveCard
                key={elective.id}
                elective={elective}
                onEnroll={handleEnroll}
                onUnenroll={handleUnenroll}
                enrollingId={enrollingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
