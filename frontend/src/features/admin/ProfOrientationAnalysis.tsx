// src/features/admin/ProfOrientationAnalysis.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useProfessionStats, ProfessionStat } from '@/shared/api/admin';
import { Loader2, Users, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { useState } from 'react';

// Цветовая палитра для графиков
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#8DD1E1', '#D084D0', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
];

const RADIAN = Math.PI / 180;

// Кастомный лейбл для круговой диаграммы
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Кастомный тултип
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-white">{`${label}`}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Количество: <span className="font-semibold">{payload[0].value}</span>
        </p>
        {payload[0].payload.percentage && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Доля: <span className="font-semibold">{payload[0].payload.percentage}%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

type ChartType = 'bar' | 'pie' | 'line';

export default function ProfOrientationAnalysisPage() {
  const { stats, isLoading, isError } = useProfessionStats();
  const [chartType, setChartType] = useState<ChartType>('bar');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Загрузка статистики...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <div className="text-lg font-semibold mb-2">Ошибка загрузки</div>
            <div>{isError.message || 'Неизвестная ошибка'}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <div className="text-lg font-semibold">Нет данных для отображения</div>
            <div className="text-sm mt-1">Результаты тестов появятся здесь после прохождения пользователями</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Подготавливаем данные с процентами
  const totalUsers = stats.reduce((sum, stat) => sum + stat.count, 0);
  const enhancedStats = stats
    .map(stat => ({
      ...stat,
      percentage: ((stat.count / totalUsers) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  // Данные для тренда (если есть временные метки)
  const trendData = enhancedStats.map((stat, index) => ({
    name: stat.profession,
    value: stat.count,
    trend: enhancedStats.length - index // Простая имитация тренда
  }));

  // Статистика
  const mostPopular = enhancedStats[0];
  const leastPopular = enhancedStats[enhancedStats.length - 1];
  const uniqueProfessions = enhancedStats.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-200 dark:text-white">
            Анализ проф. ориентации
          </h1>
          <p className="text-muted-foreground mt-1">
            Статистика по результатам теста профессиональной ориентации
          </p>
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Всего тестов
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Уникальных профессий
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {uniqueProfessions}
                </p>
              </div>
              <PieChartIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Самая популярная
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {mostPopular.profession}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  {mostPopular.count} тестов ({mostPopular.percentage}%)
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Переключение типа графика */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Распределение по рекомендуемым профессиям</CardTitle>
          <div className="flex space-x-2">
            {([
              { type: 'bar' as ChartType, label: 'Столбцы' },
              { type: 'pie' as ChartType, label: 'Круговая' },
              { type: 'line' as ChartType, label: 'Линейный' }
            ]).map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  chartType === type
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' && (
                <BarChart data={enhancedStats} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="profession"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Количество тестов" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  >
                    {enhancedStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {chartType === 'pie' && (
                <PieChart>
                  <Pie
                    data={enhancedStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="profession"
                  >
                    {enhancedStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color, fontSize: '12px' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              )}

              {chartType === 'line' && (
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Количество тестов" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1D4ED8' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Детальная таблица */}
      <Card>
        <CardHeader>
          <CardTitle>Детальная статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Профессия
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Количество тестов
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Доля
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Процент
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {enhancedStats.map((stat: ProfessionStat & { percentage: string }, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        {stat.profession}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {stat.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${stat.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {stat.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}