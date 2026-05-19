// features/peer-review/MentorPeerReviewPage.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useAssignPeerReviews, usePeerReviewStats } from '@/shared/api/admin/peer-reviews';
import { useAssignments } from '@/shared/api/admin';
import { Users, CheckCircle, Clock } from 'lucide-react';

export default function MentorPeerReviewPage() {
  const { user } = useAuth();
  const { assignments } = useAssignments();
  const { assignReviews, isSubmitting: isAssigning } = useAssignPeerReviews();
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [reviewsPerStudent, setReviewsPerStudent] = useState<number>(5);

  const { stats, isLoading } = usePeerReviewStats(selectedAssignment || undefined);

  const handleAssign = async () => {
    if (!selectedAssignment) return;

    try {
      await assignReviews({
        assignmentId: selectedAssignment,
        reviewsPerStudent,
      });
      alert('Peer review успешно назначен!');
    } catch (error) {
      console.error('Error assigning peer reviews:', error);
      alert('Ошибка: ' + (error as any).message);
    }
  };

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gh-fg mb-2">Peer Review - Панель ментора</h1>
          <p className="text-gray-400">
            Управление взаимным рецензированием работ
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Назначение Peer Review */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Назначить рецензирование
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Выберите задание:
                </label>
                <select
                  value={selectedAssignment || ''}
                  onChange={(e) => setSelectedAssignment(Number(e.target.value))}
                  className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg"
                >
                  <option value="">Выберите задание</option>
                  {assignments?.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Количество рецензий на студента:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={reviewsPerStudent}
                  onChange={(e) => setReviewsPerStudent(Number(e.target.value))}
                  className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Каждый студент проверит {reviewsPerStudent} работ, и его работу проверят {reviewsPerStudent} студентов
                </p>
              </div>

              <Button
                onClick={handleAssign}
                disabled={!selectedAssignment || isAssigning}
                className="w-full"
              >
                {isAssigning ? 'Назначение...' : 'Назначить Peer Review'}
              </Button>
            </CardContent>
          </Card>

          {/* Статистика */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-400">Загрузка...</p>
              ) : stats.length === 0 ? (
                <p className="text-gray-400">Выберите задание для просмотра статистики</p>
              ) : (
                <div className="space-y-4">
                  {stats.map((stat) => (
                    <div key={stat.submissionId} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold">{stat.studentName}</span>
                        {stat.completedReviews >= stat.totalReviews ? (
                          <span className="text-green-500 text-sm flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Завершено
                          </span>
                        ) : (
                          <span className="text-yellow-500 text-sm flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            В процессе
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Всего:</span>
                          <span className="text-white ml-2">{stat.totalReviews}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Проверено:</span>
                          <span className="text-white ml-2">{stat.completedReviews}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Ср. балл:</span>
                          <span className="text-white ml-2">
                            {stat.averageScore !== null ? Math.round(stat.averageScore) : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
