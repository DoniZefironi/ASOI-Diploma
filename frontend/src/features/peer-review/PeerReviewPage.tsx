// features/peer-review/PeerReviewPage.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { usePeerReviewsToReview, useCreatePeerReview, useMyActiveSessions, type PeerReview, type ReviewCriterion } from '@/shared/api/admin/peer-reviews';
import { CheckCircle, Loader2, Star, ExternalLink, Send, ChevronDown, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// ── Criterion scoring ─────────────────────────────────────────────
function CriteriaForm({ criteria, scores, onChange }: {
  criteria: ReviewCriterion[];
  scores: Record<string, number>;
  onChange: (name: string, value: number) => void;
}) {
  const total    = criteria.reduce((s, c) => s + (scores[c.name] ?? 0), 0);
  const maxTotal = criteria.reduce((s, c) => s + c.maxScore, 0);
  const pct      = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {criteria.map(c => {
        const val = scores[c.name] ?? 0;
        const cpct = c.maxScore > 0 ? (val / c.maxScore) * 100 : 0;
        return (
          <div key={c.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>{c.name}</label>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent-fg)' }}>{val} / {c.maxScore}</span>
            </div>
            {c.description && <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--color-fg-muted)' }}>{c.description}</p>}
            <div style={{ position: 'relative' }}>
              <input type="range" min={0} max={c.maxScore} value={val} onChange={e => onChange(c.name, +e.target.value)}
                style={{ width: '100%', accentColor: 'var(--color-accent-fg)' }} />
              <div style={{ height: 4, background: 'var(--color-canvas-inset)', borderRadius: 2, marginTop: 2 }}>
                <div style={{ height: '100%', width: `${cpct}%`, background: 'var(--color-accent-emphasis)', borderRadius: 2, transition: 'width 80ms' }} />
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--color-border-muted)' }}>
        <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Итого</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 80, height: 6, background: 'var(--color-canvas-inset)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? 'var(--color-success-emphasis)' : pct >= 40 ? 'var(--color-attention-emphasis)' : 'var(--color-danger-emphasis)', borderRadius: 3, transition: 'width 150ms' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-fg-default)' }}>{total} / {maxTotal}</span>
        </div>
      </div>
    </div>
  );
}

// ── Review card ───────────────────────────────────────────────────
function ReviewCard({ review, onSubmitted }: { review: PeerReview; onSubmitted: () => void }) {
  const { createReview, isSubmitting } = useCreatePeerReview();
  const hasCriteria = review.criteria && review.criteria.length > 0;
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(() =>
    hasCriteria ? Object.fromEntries((review.criteria as ReviewCriterion[]).map(c => [c.name, 0])) : {}
  );
  const [score, setScore]       = useState(50);
  const [feedback, setFeedback] = useState('');
  const [expanded, setExpanded] = useState(!review.isCompleted);

  const handleSubmit = async () => {
    if (!feedback.trim()) { alert('Комментарий обязателен'); return; }
    try {
      if (hasCriteria) {
        await createReview({ submissionId: review.submissionId, criteriaScores: (review.criteria as ReviewCriterion[]).map(c => ({ name: c.name, score: criteriaScores[c.name] ?? 0, maxScore: c.maxScore })), feedback });
      } else {
        await createReview({ submissionId: review.submissionId, score, feedback });
      }
      onSubmitted();
    } catch (e: any) { alert('Ошибка: ' + (e?.message || 'Неизвестная ошибка')); }
  };

  return (
    <div style={{ background: 'var(--color-canvas-overlay)', border: `1px solid ${review.isCompleted ? 'rgba(63,185,80,0.3)' : 'var(--color-border-default)'}`, borderRadius: 12, overflow: 'hidden' }}>
      {/* Card header */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: review.isCompleted ? 'rgba(63,185,80,0.1)' : 'rgba(210,153,34,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {review.isCompleted
              ? <CheckCircle size={16} color="var(--color-success-fg)" />
              : <Loader2 size={16} color="#d29922" style={{ animation: 'spin 1s linear infinite' }} />
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-fg-default)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.assignmentTitle}</p>
            <p style={{ margin: '1px 0 0', fontSize: 12, color: 'var(--color-fg-muted)' }}>Студент: {review.studentName}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {review.isCompleted && review.score != null && (
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success-fg)', background: 'rgba(63,185,80,0.1)', padding: '2px 10px', borderRadius: 20 }}>
              {review.score} баллов
            </span>
          )}
          {!review.isCompleted && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#d29922', background: 'rgba(210,153,34,0.1)', padding: '2px 8px', borderRadius: 20 }}>Нужна проверка</span>
          )}
          <ChevronDown size={14} color="var(--color-fg-muted)" style={{ transform: expanded ? 'rotate(180deg)' : '', transition: 'transform 150ms' }} />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--color-border-muted)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Work links */}
          {(review.repositoryUrl || (review.attachments && review.attachments.length > 0) || review.content) && (
            <div>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Работа студента</p>
              {review.repositoryUrl && (
                <a href={review.repositoryUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-accent-fg)', textDecoration: 'none', marginBottom: 8 }}>
                  <ExternalLink size={13} /> GitHub репозиторий
                </a>
              )}
              {review.attachments && review.attachments.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {review.attachments.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--color-accent-fg)', textDecoration: 'none' }}>
                      Вложение {i + 1}
                    </a>
                  ))}
                </div>
              )}
              {review.content && (
                <pre style={{ margin: '8px 0 0', padding: '12px 14px', background: 'var(--color-canvas-inset)', borderRadius: 8, fontSize: 13, color: 'var(--color-fg-default)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid var(--color-border-muted)' }}>
                  {review.content}
                </pre>
              )}
            </div>
          )}

          {/* Criteria hint */}
          {!review.isCompleted && !hasCriteria && review.peerReviewCriteria && (
            <div style={{ padding: '12px 14px', background: 'rgba(47,129,247,0.06)', border: '1px solid rgba(47,129,247,0.2)', borderRadius: 8 }}>
              <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: 'var(--color-accent-fg)' }}>Критерии оценки</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-default)', whiteSpace: 'pre-wrap' }}>{review.peerReviewCriteria}</p>
            </div>
          )}

          {/* Review form — pending */}
          {!review.isCompleted && (
            <div>
              <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: 'var(--color-fg-default)' }}>Ваша рецензия</p>
              {hasCriteria ? (
                <CriteriaForm criteria={review.criteria as ReviewCriterion[]} scores={criteriaScores} onChange={(n, v) => setCriteriaScores(p => ({ ...p, [n]: v }))} />
              ) : (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Оценка (0–100)</label>
                    <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-fg-default)' }}>{score}</span>
                  </div>
                  <input type="range" min={0} max={100} value={score} onChange={e => setScore(+e.target.value)} style={{ width: '100%', accentColor: 'var(--color-accent-fg)' }} />
                  <div style={{ height: 4, background: 'var(--color-canvas-inset)', borderRadius: 2, marginTop: 4 }}>
                    <div style={{ height: '100%', width: `${score}%`, background: score >= 70 ? 'var(--color-success-emphasis)' : score >= 40 ? 'var(--color-attention-emphasis)' : 'var(--color-danger-emphasis)', borderRadius: 2, transition: 'width 80ms' }} />
                  </div>
                </div>
              )}

              <div style={{ marginTop: 14 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--color-fg-muted)', marginBottom: 6 }}>Комментарий <span style={{ color: 'var(--color-danger-fg)' }}>*</span></label>
                <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Напишите развернутый отзыв о работе..." rows={4}
                  style={{ width: '100%', padding: '10px 12px', fontSize: 13, color: 'var(--color-fg-default)', background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 8, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              <button onClick={handleSubmit} disabled={isSubmitting || !feedback.trim()}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '8px 20px', fontSize: 14, fontWeight: 600, background: feedback.trim() ? 'var(--color-accent-emphasis)' : 'var(--color-canvas-inset)', color: feedback.trim() ? '#fff' : 'var(--color-fg-subtle)', border: 'none', borderRadius: 8, cursor: feedback.trim() ? 'pointer' : 'not-allowed', transition: 'all 120ms' }}>
                {isSubmitting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
                {isSubmitting ? 'Отправка...' : 'Отправить рецензию'}
              </button>
            </div>
          )}

          {/* Completed view */}
          {review.isCompleted && (
            <div>
              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--color-fg-default)' }}>Ваша рецензия</p>
              {review.criteriaScores && review.criteriaScores.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {review.criteriaScores.map(cs => (
                    <div key={cs.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-muted)' }}>
                      <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>{cs.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 4, background: 'var(--color-canvas-inset)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${cs.maxScore > 0 ? (cs.score / cs.maxScore) * 100 : 0}%`, background: 'var(--color-accent-emphasis)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-fg-default)', minWidth: 48, textAlign: 'right' }}>{cs.score} / {cs.maxScore}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Итог</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-success-fg)' }}>{review.score}</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Оценка:</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-success-fg)' }}>{review.score}</span>
                </div>
              )}
              {review.feedback && (
                <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--color-canvas-inset)', borderRadius: 8 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Комментарий</p>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-default)', lineHeight: 1.55 }}>{review.feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function PeerReviewPage() {
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const { reviews, isLoading, mutate } = usePeerReviewsToReview();
  const { sessions } = useMyActiveSessions();

  const filtered = selectedAssignment ? reviews.filter(r => r.assignmentId?.toString() === selectedAssignment) : reviews;
  const pending   = reviews.filter(r => !r.isCompleted);
  const done      = reviews.filter(r => r.isCompleted);
  const assignmentIds = Array.from(new Set(reviews.map(r => r.assignmentId))).filter(Boolean);

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas-default)' }}>
        <Loader2 size={28} color="var(--color-accent-fg)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Star size={22} color="#d29922" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-fg-default)' }}>Peer Review</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
            Оцените работы других студентов — это часть учебного процесса
          </p>
          <div style={{ height: 3, width: 48, borderRadius: 2, background: '#d29922', marginTop: 14 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>

          {/* ── Main ────────────────────────────────────────────── */}
          <div>
            {/* Assignment filter */}
            {assignmentIds.length > 1 && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)', marginBottom: 6 }}>Фильтр по заданию</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => setSelectedAssignment(null)}
                    style={{ padding: '5px 12px', fontSize: 12, borderRadius: 20, border: '1px solid', borderColor: !selectedAssignment ? 'transparent' : 'var(--color-border-default)', background: !selectedAssignment ? 'var(--color-accent-emphasis)' : 'transparent', color: !selectedAssignment ? '#fff' : 'var(--color-fg-muted)', cursor: 'pointer' }}>
                    Все ({reviews.length})
                  </button>
                  {assignmentIds.map(id => {
                    const title = reviews.find(r => r.assignmentId === id)?.assignmentTitle ?? `Задание #${id}`;
                    const active = selectedAssignment === id?.toString();
                    return (
                      <button key={id} onClick={() => setSelectedAssignment(active ? null : id?.toString() ?? null)}
                        style={{ padding: '5px 12px', fontSize: 12, borderRadius: 20, border: '1px solid', borderColor: active ? 'transparent' : 'var(--color-border-default)', background: active ? 'var(--color-accent-emphasis)' : 'transparent', color: active ? '#fff' : 'var(--color-fg-muted)', cursor: 'pointer' }}>
                        {title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active sessions — shown when reviews not yet distributed */}
            {sessions.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Активные сессии взаимопроверки
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sessions.map((s: any) => {
                    const now = new Date();
                    const start = new Date(s.startDate);
                    const end   = new Date(s.endDate);
                    const active = now >= start && now <= end;
                    const upcoming = now < start;
                    return (
                      <div key={s.id} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: active ? 'rgba(63,185,80,0.1)' : 'rgba(210,153,34,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {active ? <CheckCircle size={18} color="var(--color-success-fg)" /> : <Clock size={18} color="#d29922" />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>{s.title}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-fg-muted)' }}>
                            {s.assignmentTitle} · {start.toLocaleDateString('ru-RU')} — {end.toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                          {s.isDistributed
                            ? <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-success-fg)', background: 'rgba(63,185,80,0.1)', padding: '2px 8px', borderRadius: 20 }}>Рецензии назначены</span>
                            : <span style={{ fontSize: 11, fontWeight: 600, color: '#d29922', background: 'rgba(210,153,34,0.1)', padding: '2px 8px', borderRadius: 20 }}>Ожидает распределения</span>
                          }
                          {!s.hasSubmitted && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-danger-fg)' }}>
                              <AlertCircle size={11} /> Сдайте задание
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews list */}
            {filtered.length === 0 ? (
              <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 12, padding: '56px 24px', textAlign: 'center' }}>
                {reviews.length === 0 && sessions.length === 0 ? (
                  <>
                    <Star size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>Рецензий пока нет</p>
                    <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Ментор создаст сессию и назначит работы для проверки</p>
                  </>
                ) : reviews.length === 0 && sessions.some((s: any) => !s.isDistributed) ? (
                  <>
                    <Clock size={28} color="#d29922" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>Ожидайте распределения</p>
                    <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Ментор ещё не распределил рецензии</p>
                  </>
                ) : (
                  <>
                    <CheckCircle size={28} color="var(--color-success-fg)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 4px' }}>
                      {selectedAssignment ? 'Нет работ для этого задания' : 'Все рецензии завершены!'}
                    </p>
                    <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Отличная работа!</p>
                  </>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Pending first */}
                {filtered.filter(r => !r.isCompleted).map(r => (
                  <ReviewCard key={r.reviewId ?? r.id} review={r} onSubmitted={mutate} />
                ))}
                {/* Then done */}
                {filtered.filter(r => r.isCompleted).length > 0 && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0 4px' }}>
                      <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Проверено</span>
                      <div style={{ flex: 1, height: 1, background: 'var(--color-border-muted)' }} />
                    </div>
                    {filtered.filter(r => r.isCompleted).map(r => (
                      <ReviewCard key={r.reviewId ?? r.id} review={r} onSubmitted={mutate} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>

            {/* Progress */}
            <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
                <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Прогресс</h3>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-fg-muted)' }}>Завершено</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-fg-default)' }}>{done.length} / {reviews.length}</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-canvas-inset)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: reviews.length > 0 ? `${(done.length / reviews.length) * 100}%` : '0%', background: done.length === reviews.length && reviews.length > 0 ? 'var(--color-success-emphasis)' : 'var(--color-accent-emphasis)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#d29922', background: 'rgba(210,153,34,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    <Loader2 size={11} style={{ animation: pending.length > 0 ? 'spin 1s linear infinite' : 'none' }} /> {pending.length} ожидают
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--color-success-fg)', background: 'rgba(63,185,80,0.1)', padding: '3px 10px', borderRadius: 20 }}>
                    <CheckCircle size={11} /> {done.length} готово
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
                <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Как проверять</h3>
              </div>
              <div style={{ padding: '10px 8px' }}>
                {[
                  'Внимательно изучите работу перед оценкой',
                  'Оценивайте объективно по критериям, а не по симпатии',
                  'Комментарий должен быть конструктивным и полезным',
                  'Укажите как сильные, так и слабые стороны работы',
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 8px' }}>
                    <span style={{ fontSize: 12, color: '#d29922', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontSize: 12, color: 'var(--color-fg-muted)', lineHeight: 1.45 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to schedule */}
            <Link href="/schedule?tab=peer_review"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, textDecoration: 'none', fontSize: 13, color: 'var(--color-fg-muted)', transition: 'color 80ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
            >
              <Star size={14} /> История рецензий в расписании
            </Link>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
