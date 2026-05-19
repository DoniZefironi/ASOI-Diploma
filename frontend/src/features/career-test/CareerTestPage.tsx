'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  useTestQuestions,
  submitTest,
  useProfessionalOrientation,
  type TestResult,
  type HollandQuestion,
  type KlimovQuestion,
} from '@/shared/api/admin/professional-orientation';
import { CheckCircle, ChevronLeft, Loader2, X, Check } from 'lucide-react';

interface Props {
  testType: string;
}

export default function CareerTestPage({ testType }: Props) {
  const { data, isLoading } = useTestQuestions(testType);
  const { result: savedRecord } = useProfessionalOrientation();

  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);

  const questions: any[] = data?.questions ?? [];
  const answerFormat: string = data?.answerFormat ?? '';
  const isHolland = answerFormat === 'yes_no';
  const testTitle = isHolland ? 'Опросник Холланда' : 'ДДО Климова';
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions && totalQuestions > 0;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const currentAnswered = currentQuestion !== undefined && answers[currentQuestion.id] !== undefined;

  const bothTestsDone =
    savedRecord?.testResult?.holland !== undefined &&
    savedRecord?.testResult?.klimov !== undefined;

  const goToNext = useCallback(() => {
    if (transitioning) return;
    if (currentIndex >= totalQuestions - 1) return;
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
      setVisible(true);
      setTransitioning(false);
    }, 220);
  }, [transitioning, currentIndex, totalQuestions]);

  const goToPrev = useCallback(() => {
    if (transitioning) return;
    if (currentIndex <= 0) return;
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex(i => i - 1);
      setVisible(true);
      setTransitioning(false);
    }, 220);
  }, [transitioning, currentIndex]);

  const handleAnswer = useCallback(
    (value: any) => {
      if (!currentQuestion) return;
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
      // Auto-advance after 300ms
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setTransitioning(true);
          setVisible(false);
          setTimeout(() => {
            setCurrentIndex(i => i + 1);
            setVisible(true);
            setTransitioning(false);
          }, 220);
        }
      }, 300);
    },
    [currentQuestion, currentIndex, totalQuestions],
  );

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setIsSubmitting(true);
    try {
      const orderedAnswers = questions.map(q => answers[q.id]);
      const saved = await submitTest(testType, orderedAnswers);
      const testResult = saved.testResult?.[testType];
      if (testResult) setResult(testResult);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gh-canvas flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gh-canvas flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-white">Тест не найден.</p>
          <Link href="/career">
            <Button variant="secondary" className="mt-4">
              ← Назад
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (result) {
    return (
      <ResultView
        result={result}
        testType={testType}
        bothTestsDone={bothTestsDone}
      />
    );
  }

  // ── Progress dots ─────────────────────────────────────────────────────────
  const MAX_DOTS = 15;
  const showDots = totalQuestions <= MAX_DOTS;

  return (
    <div className="min-h-screen bg-gh-canvas py-10">
      <div className="container mx-auto px-4 max-w-2xl">

        {/* Back link */}
        <Link href="/career">
          <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Назад к тестам
          </button>
        </Link>

        {/* Test title */}
        <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">{testTitle}</p>

        {/* Large question counter */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-6xl font-black text-white leading-none tabular-nums">
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-2xl text-gray-600 font-light">
            / {String(totalQuestions).padStart(2, '0')}
          </span>
        </div>

        {/* Progress dots */}
        {showDots ? (
          <div className="flex gap-1.5 mb-8 flex-wrap">
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    if (transitioning) return;
                    setTransitioning(true);
                    setVisible(false);
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setVisible(true);
                      setTransitioning(false);
                    }, 220);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-4 h-4 bg-blue-400 animate-pulse'
                      : answered
                      ? 'w-3 h-3 bg-blue-600'
                      : 'w-3 h-3 bg-gray-700'
                  }`}
                  aria-label={`Вопрос ${idx + 1}`}
                />
              );
            })}
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
              <span>{answeredCount} из {totalQuestions} отвечено</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question card */}
        <div
          className="transition-all duration-200"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          {currentQuestion && isHolland && (
            <HollandQuestionCard
              question={currentQuestion as HollandQuestion}
              answer={answers[currentQuestion.id]}
              onChange={handleAnswer}
            />
          )}
          {currentQuestion && !isHolland && (
            <KlimovQuestionCard
              question={currentQuestion as KlimovQuestion}
              answer={answers[currentQuestion.id]}
              onChange={handleAnswer}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0 || transitioning}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Предыдущий
          </button>

          {isLastQuestion && allAnswered && (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Обработка...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Завершить тест
                </>
              )}
            </Button>
          )}

          {isLastQuestion && !allAnswered && (
            <p className="text-yellow-400 text-sm">
              Ответьте на все вопросы
            </p>
          )}
        </div>

        {/* Answered count */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Отвечено: {answeredCount} / {totalQuestions}
        </p>
      </div>
    </div>
  );
}

// ── Holland question card ─────────────────────────────────────────────────────
function HollandQuestionCard({
  question,
  answer,
  onChange,
}: {
  question: HollandQuestion;
  answer: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="text-white text-xl font-medium leading-relaxed mb-8">{question.text}</p>
      <div className="flex gap-4">
        <button
          onClick={() => onChange(1)}
          className={`flex-1 py-5 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-200 border-2 ${
            answer === 1
              ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/40 scale-[1.02]'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-600'
          }`}
        >
          <Check className="h-5 w-5" />
          Да
        </button>
        <button
          onClick={() => onChange(0)}
          className={`flex-1 py-5 rounded-2xl text-base font-semibold flex items-center justify-center gap-3 transition-all duration-200 border-2 ${
            answer === 0
              ? 'bg-red-700 border-red-600 text-white shadow-lg shadow-red-900/40 scale-[1.02]'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-600'
          }`}
        >
          <X className="h-5 w-5" />
          Нет
        </button>
      </div>
    </div>
  );
}

// ── Klimov question card ──────────────────────────────────────────────────────
function KlimovQuestionCard({
  question,
  answer,
  onChange,
}: {
  question: KlimovQuestion;
  answer: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-gray-400 text-sm uppercase tracking-wide mb-6">Что вам ближе?</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChange('a')}
          className={`p-6 rounded-2xl text-sm text-left transition-all duration-200 border-2 flex flex-col gap-3 h-full ${
            answer === 'a'
              ? 'bg-blue-700/30 border-blue-500 text-white shadow-lg shadow-blue-900/30'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-750'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
            answer === 'a' ? 'bg-blue-500/30 text-blue-300' : 'bg-gray-700 text-gray-500'
          }`}>
            A
          </span>
          <span className="leading-relaxed">{question.a.text}</span>
        </button>
        <button
          onClick={() => onChange('b')}
          className={`p-6 rounded-2xl text-sm text-left transition-all duration-200 border-2 flex flex-col gap-3 h-full ${
            answer === 'b'
              ? 'bg-blue-700/30 border-blue-500 text-white shadow-lg shadow-blue-900/30'
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-750'
          }`}
        >
          <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
            answer === 'b' ? 'bg-blue-500/30 text-blue-300' : 'bg-gray-700 text-gray-500'
          }`}>
            B
          </span>
          <span className="leading-relaxed">{question.b.text}</span>
        </button>
      </div>
    </div>
  );
}

// ── SVG Radar Chart ───────────────────────────────────────────────────────────
function RadarChart({
  data,
  size = 260,
}: {
  data: { label: string; value: number; maxValue: number }[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const levels = 4;
  const n = data.length;
  if (n < 3) return null;

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i: number, r: number) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Grid rings
  const gridRings = Array.from({ length: levels }, (_, l) => {
    const r = (radius * (l + 1)) / levels;
    const pts = Array.from({ length: n }, (_, i) => getPoint(i, r));
    return pts.map(p => `${p.x},${p.y}`).join(' ');
  });

  // Axes
  const axes = Array.from({ length: n }, (_, i) => {
    const p = getPoint(i, radius);
    return { x: p.x, y: p.y };
  });

  // Data polygon
  const dataPoints = data.map((d, i) => {
    const pct = d.maxValue > 0 ? Math.min(d.value / d.maxValue, 1) : 0;
    const p = getPoint(i, radius * pct);
    return `${p.x},${p.y}`;
  });

  // Labels
  const labels = data.map((d, i) => {
    const p = getPoint(i, radius + 20);
    return { x: p.x, y: p.y, label: d.label };
  });

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid rings */}
      {gridRings.map((pts, l) => (
        <polygon
          key={l}
          points={pts}
          fill="none"
          stroke="#374151"
          strokeWidth={1}
        />
      ))}
      {/* Axes */}
      {axes.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#374151" strokeWidth={1} />
      ))}
      {/* Data area */}
      <polygon
        points={dataPoints.join(' ')}
        fill="rgba(59,130,246,0.25)"
        stroke="#3B82F6"
        strokeWidth={2}
      />
      {/* Data dots */}
      {data.map((d, i) => {
        const pct = d.maxValue > 0 ? Math.min(d.value / d.maxValue, 1) : 0;
        const p = getPoint(i, radius * pct);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3B82F6" />
        );
      })}
      {/* Labels */}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9CA3AF"
          fontSize={10}
          fontFamily="sans-serif"
        >
          {l.label}
        </text>
      ))}
    </svg>
  );
}

// ── Animated confidence ring ──────────────────────────────────────────────────
function ConfidenceRing({
  value,
  size = 80,
  strokeWidth = 7,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#1F2937"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
    </svg>
  );
}

// ── ResultView ────────────────────────────────────────────────────────────────
function ResultView({
  result,
  testType,
  bothTestsDone,
}: {
  result: TestResult;
  testType: string;
  bothTestsDone: boolean;
}) {
  const isHolland = testType === 'holland';
  const testLabel = isHolland ? 'Опросник Холланда' : 'ДДО Климова';
  const heroEmoji = isHolland ? '🧠' : '🌐';

  const radarData = result.allTypes.map(t => ({
    label: t.label.length > 12 ? t.label.slice(0, 12) + '…' : t.label,
    value: t.score,
    maxValue: t.maxScore,
  }));

  const topPercent = result.allTypes[0]?.maxScore > 0
    ? Math.round((result.allTypes[0].score / result.allTypes[0].maxScore) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Hero section */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <ConfidenceRing value={topPercent} size={120} strokeWidth={10} />
            <span className="absolute inset-0 flex items-center justify-center text-4xl">
              {heroEmoji}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gh-fg mb-1">{result.topTypeLabel}</h1>
          <p className="text-gray-400 text-sm">{testLabel}</p>
        </div>

        {/* Top type card */}
        <Card className="p-6 mb-6 border-blue-500/50 bg-blue-900/10">
          <p className="text-xs text-blue-400 uppercase font-semibold mb-1">Ваш основной тип</p>
          <h2 className="text-xl font-bold text-gh-fg mb-2">{result.topTypeLabel}</h2>
          <p className="text-gray-300 text-sm leading-relaxed">{result.topTypeDescription}</p>
        </Card>

        {/* Radar chart */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gh-fg mb-4 text-center">Профиль по типам</h3>
          {radarData.length >= 3 && <RadarChart data={radarData} size={280} />}
        </Card>

        {/* Career cards grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gh-fg mb-4">Подходящие профессии</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.topCareers.map((career, idx) => (
              <Card key={idx} className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💼</span>
                  <span className="text-white font-semibold">{career}</span>
                </div>
                {/* Confidence bar */}
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Совпадение</span>
                    <span>{Math.round((result.allTypes[0]?.score / (result.allTypes[0]?.maxScore || 1)) * 100)}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${(result.allTypes[0]?.score / (result.allTypes[0]?.maxScore || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Score breakdown */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gh-fg mb-4">Детализация по типам</h3>
          <div className="space-y-3">
            {result.allTypes.map(t => (
              <div key={t.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={t.type === result.topType ? 'text-blue-300 font-medium' : 'text-gray-400'}>
                    {t.label}
                  </span>
                  <span className="text-gray-400">{t.score} / {t.maxScore}</span>
                </div>
                <div className="bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      t.type === result.topType ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${(t.score / t.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {!bothTestsDone && (
            <Link href="/career">
              <Button variant="primary" className="w-full">
                Пройти второй тест →
              </Button>
            </Link>
          )}
          {bothTestsDone && (
            <Link href="/career#expert">
              <Button variant="primary" className="w-full">
                🔬 Экспертный анализ
              </Button>
            </Link>
          )}
          <Link href="/career">
            <Button variant="secondary" className="w-full">
              ← К тестам
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
