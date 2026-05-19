'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/shared/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { exportAnalyticsToExcel } from '@/shared/lib/analytics_excel_export';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Loader2,
  Download,
  Activity,
  Users,
  BarChart2,
  Calendar,
  TrendingUp,
} from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url);

interface Stats {
  summary: {
    totalAll: number;
    totalToday: number;
    total7d: number;
    total30d: number;
    uniqueUsers30d: number;
  };
  topPages: { path: string; visits: number }[];
  dailyVisits: { day: string; visits: number; uniqueUsers: number }[];
  recentVisits: {
    path: string;
    userId: number | null;
    userDisplayName: string | null;
    visitedAt: string;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} className="text-sm" style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDay(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
}


export default function SiteAnalyticsPage() {
  const { data, isLoading, error } = useSWR<Stats>('/analytics/stats', fetcher);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!data) return;
    setExporting(true);
    try {
      await exportAnalyticsToExcel(data);
    } catch (e) {
      console.error('Ошибка экспорта:', e);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Загрузка статистики...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <div className="text-lg font-semibold mb-2">Ошибка загрузки</div>
            <div>Не удалось получить данные аналитики</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const chartData = data.dailyVisits.map(d => ({
    ...d,
    label: formatDay(d.day),
  }));

  const maxVisits = Math.max(...data.topPages.map(p => p.visits), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-200 dark:text-white">
            Посещаемость сайта
          </h1>
          <p className="text-muted-foreground mt-1">
            Статистика визитов за последние 30 дней
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors font-medium"
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Экспорт...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Экспорт в Excel</span>
            </>
          )}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Всего</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.summary.totalAll.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">за всё время</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Сегодня</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.summary.totalToday.toLocaleString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">7 дней</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.summary.total7d.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">30 дней</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.summary.total30d.toLocaleString()}
                </p>
              </div>
              <BarChart2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Уникальных</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {data.summary.uniqueUsers30d.toLocaleString()}
                </p>
                <p className="text-xs text-pink-600 dark:text-pink-400 mt-0.5">за 30 дней</p>
              </div>
              <Users className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line chart */}
      <Card>
        <CardHeader>
          <CardTitle>Визиты по дням (последние 30 дней)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="visits"
                  name="Визиты"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueUsers"
                  name="Уникальных пользователей"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top pages + Recent visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top pages */}
        <Card>
          <CardHeader>
            <CardTitle>Популярные страницы (топ-15)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Нет данных</p>
              ) : (
                data.topPages.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-5 text-right shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">{p.path}</p>
                      <div className="mt-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-1.5 bg-blue-500 rounded-full"
                          style={{ width: `${(p.visits / maxVisits) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 shrink-0">
                      {p.visits}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent visits */}
        <Card>
          <CardHeader>
            <CardTitle>Последние визиты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Страница
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Время
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.recentVisits.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        Нет данных
                      </td>
                    </tr>
                  ) : (
                    data.recentVisits.slice(0, 20).map((v, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-[140px] truncate">
                          {v.path}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate">
                          {v.userDisplayName ?? (
                            <span className="text-gray-400 dark:text-gray-500">Аноним</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 text-right whitespace-nowrap">
                          {formatDate(v.visitedAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
