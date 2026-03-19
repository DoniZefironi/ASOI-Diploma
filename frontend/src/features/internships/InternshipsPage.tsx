'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useInternships, type Internship } from '@/shared/api/internships';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { MapPin, Clock, Banknote, Search, Building2, ChevronRight, Calendar } from 'lucide-react';

const FORMAT_LABELS: Record<string, { label: string; color: string }> = {
  remote: { label: 'Удалённо', color: 'bg-green-600/20 border-green-700 text-green-400' },
  office: { label: 'Офис', color: 'bg-blue-600/20 border-blue-700 text-blue-400' },
  hybrid: { label: 'Гибрид', color: 'bg-purple-600/20 border-purple-700 text-purple-400' },
};

function formatDeadline(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function InternshipCard({ internship }: { internship: Internship }) {
  const fmt = FORMAT_LABELS[internship.format] ?? FORMAT_LABELS.office;
  const deadline = formatDeadline(internship.deadline);
  const isExpired = internship.deadline && new Date(internship.deadline) < new Date();

  return (
    <Link href={`/internships/${internship.id}`}>
      <Card className={`p-5 hover:border-gray-500 transition-all cursor-pointer group ${isExpired ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 border rounded-full text-xs font-medium ${fmt.color}`}>
                {fmt.label}
              </span>
              {isExpired && (
                <span className="px-2 py-0.5 bg-red-900/30 border border-red-700 text-red-400 rounded-full text-xs">
                  Приём завершён
                </span>
              )}
              {internship.tags?.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-full text-xs">{tag}</span>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {internship.title}
            </h3>

            <div className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="font-medium text-gray-300">{internship.company}</span>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{internship.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {internship.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {internship.location}
                </span>
              )}
              {internship.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {internship.duration}
                </span>
              )}
              {internship.salary && (
                <span className="flex items-center gap-1">
                  <Banknote className="h-3.5 w-3.5" />
                  {internship.salary}
                </span>
              )}
              {deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  до {deadline}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-400 shrink-0 mt-1 transition-colors" />
        </div>
      </Card>
    </Link>
  );
}

export default function InternshipsPage() {
  const { internships, isLoading } = useInternships();
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');

  const filtered = internships.filter(i => {
    const matchesSearch =
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchesFormat = formatFilter === 'all' || i.format === formatFilter;
    return matchesSearch && matchesFormat;
  });

  return (
    <div className="min-h-screen bg-[#0D1117] py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💼 Стажировки</h1>
          <p className="text-gray-400">Актуальные стажировки от компаний-партнёров</p>
        </div>

        {/* Поиск и фильтры */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск по названию или компании..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'remote', 'office', 'hybrid'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formatFilter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                }`}
              >
                {f === 'all' ? 'Все' : FORMAT_LABELS[f].label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Загрузка...</div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-3xl mb-3">💼</p>
            <p className="text-white font-medium mb-1">
              {search || formatFilter !== 'all' ? 'Ничего не найдено' : 'Стажировок пока нет'}
            </p>
            <p className="text-gray-400 text-sm">
              {search || formatFilter !== 'all'
                ? 'Попробуйте изменить фильтры'
                : 'Следите за обновлениями — скоро появятся новые предложения'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{filtered.length} стажировок</p>
            {filtered.map(internship => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
