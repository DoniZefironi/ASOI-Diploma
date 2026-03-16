// features/peer-review/PeerReviewPage.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { usePeerReviewsToReview, useCreatePeerReview } from '@/shared/api/admin/peer-reviews';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PeerReviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const { reviews, isLoading, mutate } = usePeerReviewsToReview();
  const { createReview, isSubmitting } = useCreatePeerReview();

  const [selectedReview, setSelectedReview] = useState<number | null>(null);
  const [score, setScore] = useState<number>(50);
  const [feedback, setFeedback] = useState<string>('');

  // Фильтруем по заданию если выбрано
  const filteredReviews = selectedAssignment
    ? reviews.filter(r => r.assignmentId?.toString() === selectedAssignment)
    : reviews;

  const handleSubmit = async () => {
    if (!selectedReview) return;

    try {
      const review = reviews.find(r => r.id === selectedReview);
      if (!review) return;

      await createReview({
        submissionId: review.submissionId,
        score,
        feedback,
      });

      alert('Рецензия успешно отправлена!');
      setFeedback('');
      setScore(50);
      setSelectedReview(null);
      mutate();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Ошибка при отправке рецензии');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Peer Review</h1>
          <p className="text-gray-400">
            Проверьте работы других студентов
          </p>
        </div>

        {/* Фильтр по заданию */}
        {reviews.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <label className="text-sm text-gray-400 mb-2 block">Фильтр по заданию:</label>
              <select
                value={selectedAssignment || ''}
                onChange={(e) => setSelectedAssignment(e.target.value || null)}
                className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg"
              >
                <option value="">Все задания</option>
                {Array.from(new Set(reviews.map(r => r.assignmentId)))
                  .filter(id => id)
                  .map(id => (
                    <option key={id} value={id}>
                      Задание #{id} - {reviews.find(r => r.assignmentId === id)?.assignmentTitle}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Найдено работ на проверку: {filteredReviews.length}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-white text-lg">
                  {selectedAssignment ? 'Нет работ на проверку для этого задания' : 'Все рецензии завершены!'}
                </p>
                <p className="text-gray-400 mt-2">
                  {selectedAssignment ? 'Выберите другое задание или вернитесь позже' : 'Нет работ для проверки'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.reviewId}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>
                      Работа: {review.assignmentTitle}
                    </span>
                    {review.isCompleted ? (
                      <span className="text-green-500 text-sm flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Проверено
                      </span>
                    ) : (
                      <span className="text-yellow-500 text-sm flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Ожидает проверки
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Студент:</p>
                      <p className="text-white">{review.studentName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Работа:</p>
                      <div className="bg-gray-800 rounded-lg p-4 text-white whitespace-pre-wrap">
                        {review.content}
                      </div>
                    </div>

                    {review.attachments && review.attachments.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Вложения:</p>
                        <div className="flex gap-2 flex-wrap">
                          {review.attachments.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline text-sm"
                            >
                              Вложение {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {!review.isCompleted && (
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <h3 className="text-white font-semibold mb-4">Ваша рецензия</h3>

                        {/* Критерии проверки */}
                        {review.peerReviewCriteria && (
                          <div className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                            <h4 className="text-blue-400 font-semibold mb-2">📋 Критерии оценки:</h4>
                            <p className="text-white whitespace-pre-wrap">{review.peerReviewCriteria}</p>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Оценка (0-100):
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={score}
                              onChange={(e) => setScore(Number(e.target.value))}
                              className="w-full"
                            />
                            <div className="text-center text-white text-lg font-bold">
                              {score}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">
                              Комментарий (обязательно) *:
                            </label>
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Напишите развернутый отзыв о работе согласно критериям..."
                              rows={6}
                              className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              * Комментарий обязателен для отправки рецензии
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleSubmit}
                              disabled={isSubmitting || !feedback.trim()}
                              className="flex-1"
                            >
                              {isSubmitting ? 'Отправка...' : 'Отправить рецензию'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {review.isCompleted && (
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <h3 className="text-white font-semibold mb-4">Ваша рецензия</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Оценка:</span>
                            <span className="text-white font-bold">{review.score}/100</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Комментарий:</span>
                            <p className="text-white mt-1">{review.feedback}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
