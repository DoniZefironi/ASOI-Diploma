// features/peer-review/PeerReviewPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { usePeerReviewsToReview, useCreatePeerReview, type PeerReview, type ReviewCriterion } from '@/shared/api/admin/peer-reviews';
import { CheckCircle, Loader2 } from 'lucide-react';

// ---- Criterion scoring form ----
function CriteriaForm({
  criteria,
  scores,
  onChange,
}: {
  criteria: ReviewCriterion[];
  scores: Record<string, number>;
  onChange: (name: string, value: number) => void;
}) {
  const total = criteria.reduce((sum, c) => sum + (scores[c.name] ?? 0), 0);
  const maxTotal = criteria.reduce((sum, c) => sum + c.maxScore, 0);

  return (
    <div className="space-y-4">
      {criteria.map(c => {
        const val = scores[c.name] ?? 0;
        return (
          <div key={c.name}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-gray-300 font-medium">{c.name}</label>
              <span className="text-sm text-white font-bold">{val} / {c.maxScore}</span>
            </div>
            {c.description && (
              <p className="text-xs text-gray-500 mb-1">{c.description}</p>
            )}
            <input
              type="range"
              min={0}
              max={c.maxScore}
              value={val}
              onChange={e => onChange(c.name, Number(e.target.value))}
              className="w-full"
            />
          </div>
        );
      })}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <span className="text-gray-400 text-sm">Итого</span>
        <span className="text-white font-bold text-lg">{total} / {maxTotal}</span>
      </div>
    </div>
  );
}

// ---- Single review card ----
function ReviewCard({
  review,
  onSubmitted,
}: {
  review: PeerReview;
  onSubmitted: () => void;
}) {
  const { createReview, isSubmitting } = useCreatePeerReview();
  const hasCriteria = review.criteria && review.criteria.length > 0;

  // per-criterion state
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(() => {
    if (!hasCriteria) return {};
    return Object.fromEntries((review.criteria as ReviewCriterion[]).map(c => [c.name, 0]));
  });

  // single-score fallback
  const [score, setScore] = useState(50);
  const [feedback, setFeedback] = useState('');

  const handleCriterionChange = (name: string, value: number) => {
    setCriteriaScores(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert('Комментарий обязателен');
      return;
    }
    try {
      if (hasCriteria) {
        const criteriaPayload = (review.criteria as ReviewCriterion[]).map(c => ({
          name: c.name,
          score: criteriaScores[c.name] ?? 0,
          maxScore: c.maxScore,
        }));
        await createReview({ submissionId: review.submissionId, criteriaScores: criteriaPayload, feedback });
      } else {
        await createReview({ submissionId: review.submissionId, score, feedback });
      }
      onSubmitted();
    } catch (e: any) {
      alert('Ошибка: ' + (e?.message || 'Неизвестная ошибка'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>{review.assignmentTitle}</span>
          {review.isCompleted ? (
            <span className="text-green-500 text-sm flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Проверено
            </span>
          ) : (
            <span className="text-yellow-500 text-sm flex items-center gap-1">
              <Loader2 className="h-4 w-4 animate-spin" /> Ожидает проверки
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
            {review.repositoryUrl && (
              <div className="mb-2">
                <a
                  href={review.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium underline-offset-2 hover:underline"
                >
                  GitHub репозиторий
                </a>
              </div>
            )}
            {review.content && (
              <div className="bg-gray-800 rounded-lg p-4 text-white whitespace-pre-wrap">
                {review.content}
              </div>
            )}
          </div>

          {review.attachments && review.attachments.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Вложения:</p>
              <div className="flex gap-2 flex-wrap">
                {review.attachments.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                    Вложение {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Review form */}
          {!review.isCompleted && (
            <div className="border-t border-gray-700 pt-4 space-y-4">
              <h3 className="text-white font-semibold">Ваша рецензия</h3>

              {hasCriteria ? (
                <CriteriaForm
                  criteria={review.criteria as ReviewCriterion[]}
                  scores={criteriaScores}
                  onChange={handleCriterionChange}
                />
              ) : (
                <div>
                  {review.peerReviewCriteria && (
                    <div className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <h4 className="text-blue-400 font-semibold mb-2">Критерии оценки:</h4>
                      <p className="text-white whitespace-pre-wrap">{review.peerReviewCriteria}</p>
                    </div>
                  )}
                  <label className="text-sm text-gray-400 mb-2 block">Оценка (0–100):</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-white text-lg font-bold">{score}</div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Комментарий *:</label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Напишите развернутый отзыв о работе..."
                  rows={5}
                  className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isSubmitting || !feedback.trim()} className="w-full">
                {isSubmitting ? 'Отправка...' : 'Отправить рецензию'}
              </Button>
            </div>
          )}

          {/* Completed view */}
          {review.isCompleted && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-white font-semibold mb-3">Ваша рецензия</h3>
              <div className="space-y-2">
                {review.criteriaScores && review.criteriaScores.length > 0 ? (
                  <div className="space-y-1">
                    {review.criteriaScores.map(cs => (
                      <div key={cs.name} className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{cs.name}:</span>
                        <span className="text-white font-semibold text-sm">{cs.score} / {cs.maxScore}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-700">
                      <span className="text-gray-400 text-sm">Итог:</span>
                      <span className="text-white font-bold">{review.score}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Оценка:</span>
                    <span className="text-white font-bold">{review.score}</span>
                  </div>
                )}
                {review.feedback && (
                  <div>
                    <span className="text-gray-400 text-sm">Комментарий:</span>
                    <p className="text-white mt-1">{review.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Main page ----
export default function PeerReviewPage() {
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const { reviews, isLoading, mutate } = usePeerReviewsToReview();

  const filteredReviews = selectedAssignment
    ? reviews.filter(r => r.assignmentId?.toString() === selectedAssignment)
    : reviews;

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
          <p className="text-gray-400">Проверьте работы других студентов</p>
        </div>

        {reviews.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <label className="text-sm text-gray-400 mb-2 block">Фильтр по заданию:</label>
              <select
                value={selectedAssignment || ''}
                onChange={e => setSelectedAssignment(e.target.value || null)}
                className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-600 rounded-lg"
              >
                <option value="">Все задания</option>
                {Array.from(new Set(reviews.map(r => r.assignmentId)))
                  .filter(Boolean)
                  .map(id => (
                    <option key={id} value={id}>
                      {reviews.find(r => r.assignmentId === id)?.assignmentTitle ?? `Задание #${id}`}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Найдено: {filteredReviews.length}</p>
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
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map(review => (
              <ReviewCard key={review.reviewId ?? review.id} review={review} onSubmitted={mutate} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
