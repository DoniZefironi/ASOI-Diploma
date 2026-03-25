// src/features/admin/ImportFromHhPage.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { apiClient } from '@/shared/api/client';
import { Loader2, Download, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportResult {
  imported: number;
  skipped: number;
  items: Array<{
    id: number;
    title: string;
    company: string;
    url: string;
  }>;
}

export default function ImportFromHhPage() {
  const [searchQuery, setSearchQuery] = useState('стажировка IT');
  const [limit, setLimit] = useState(20);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiClient.post('/internships/admin/import-hh', {
        searchQuery,
        limit,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка при импорте вакансий');
    } finally {
      setIsImporting(false);
    }
  };

  const handleScheduledImport = async () => {
    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiClient.get('/internships/admin/import-hh-scheduled');
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Ошибка при автоматическом импорте');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-200 dark:text-white">
          Импорт стажировок с HH.ru
        </h1>
        <p className="text-muted-foreground mt-1">
          Автоматическое получение вакансий с HeadHunter
        </p>
      </div>

      {/* Форма импорта */}
      <Card>
        <CardHeader>
          <CardTitle>Ручной импорт</CardTitle>
          <CardDescription>
            Получите вакансии с HH.ru по заданному поисковому запросу
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Поисковый запрос</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="стажировка IT"
              />
              <p className="text-xs text-gray-500 mt-1">
                Например: стажировка frontend, intern developer, стажер аналитик
              </p>
            </div>
            <div>
              <Label htmlFor="limit">Количество</Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                min={1}
                max={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                Максимум 100 вакансий за раз
              </p>
            </div>
          </div>

          <Button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Импорт...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Импортировать вакансии</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Автоматический импорт */}
      <Card>
        <CardHeader>
          <CardTitle>Автоматический импорт</CardTitle>
          <CardDescription>
            Получить вакансии по нескольким популярным запросам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Будут использованы следующие поисковые запросы:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'стажировка IT',
                'стажер программист',
                'intern developer',
                'стажировка frontend',
                'стажировка backend',
                'стажировка аналитик',
              ].map((query) => (
                <span
                  key={query}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {query}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              По 10 вакансий на каждый запрос (всего до 60)
            </p>

            <Button
              onClick={handleScheduledImport}
              disabled={isImporting}
              variant="secondary"
              className="gap-2"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Импорт...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Запустить автоматический импорт</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Результат */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Ошибка</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Импорт завершён</p>
                  <p className="text-sm">
                    Импортировано: {result.imported}, пропущено: {result.skipped}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Импортированные вакансии ({result.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Вакансия
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Компания
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Ссылка
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {result.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                            {item.company}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-500 text-sm"
                            >
                              Открыть →
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
