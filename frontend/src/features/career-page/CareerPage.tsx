'use client';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  useTestList,
  useProfessionalOrientation,
  useExpertAnalysis,
  type ExpertCareer,
} from '@/shared/api/admin/professional-orientation';
import { Clock, CheckCircle, ArrowRight, Loader2, Brain, TrendingUp, RefreshCw } from 'lucide-react';

// ── SVG Confidence ring ───────────────────────────────────────────────────────
function ConfidenceRing({
  value,
  size = 72,
  strokeWidth = 6,
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

// ── Expert career card ────────────────────────────────────────────────────────
function ExpertCareerCard({ career }: { career: ExpertCareer }) {
  return (
    <Card className="p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <ConfidenceRing value={career.confidence} size={64} strokeWidth={5} />
          <span className="absolute inset-0 flex items-center justify-center text-xl">
            {career.emoji}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-base leading-snug">{career.title}</h4>
          <p className="text-blue-400 text-xs mt-0.5">{career.confidence}% совпадение</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed flex-1">{career.description}</p>

      {/* Skills */}
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Навыки</p>
        <div className="flex flex-wrap gap-1.5">
          {career.skills.slice(0, 5).map(skill => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-blue-900/30 border border-blue-800/50 text-blue-300 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Salary & demand */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-green-400 font-medium">{career.salaryRange}</span>
        <span className={`px-2 py-0.5 rounded-full ${
          career.demandLevel === 'Очень высокий'
            ? 'bg-green-900/40 text-green-400'
            : career.demandLevel === 'Высокий'
            ? 'bg-blue-900/40 text-blue-400'
            : 'bg-gray-700 text-gray-400'
        }`}>
          {career.demandLevel}
        </span>
      </div>

      {/* Growth path */}
      {career.growthPath.length > 0 && (
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Карьерный путь</p>
          <div className="flex items-center gap-1 flex-wrap">
            {career.growthPath.map((step, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="text-gray-400 text-xs">{step}</span>
                {idx < career.growthPath.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-gray-600 flex-shrink-0" />
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Expert Analysis Section ───────────────────────────────────────────────────
function ExpertAnalysisSection() {
  const { analysis, isLoading: isLoadingAnalysis } = useExpertAnalysis();

  if (isLoadingAnalysis) {
    return (
      <section id="expert" className="mb-16">
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      </section>
    );
  }

  if (!analysis) return null;

  const top3 = analysis.topCareers.slice(0, 3);

  return (
    <section id="expert" className="mb-16">
      {/* Title */}
      <div className="flex items-center gap-3 mb-2">
        <Brain className="h-7 w-7 text-blue-400" />
        <h2 className="text-3xl font-bold text-gh-fg">Экспертный анализ</h2>
      </div>
      <p className="text-gray-400 mb-8">
        Персонализированные рекомендации на основе обоих пройденных тестов
      </p>

      {/* Type header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Тип Холланда</p>
          <p className="text-white font-semibold text-lg">{analysis.hollandLabel}</p>
          <p className="text-blue-400 text-xs mt-1">Код: {analysis.hollandType}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Тип Климова</p>
          <p className="text-white font-semibold text-lg">{analysis.klimovLabel}</p>
        </div>
      </div>

      {/* Personality insight */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-blue-400" />
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-wide">
            Ваш профессиональный профиль
          </p>
        </div>
        <p className="text-gray-200 text-sm leading-relaxed">{analysis.personalityInsight}</p>
      </div>

      {/* Top 3 career cards */}
      <h3 className="text-xl font-semibold text-gh-fg mb-4">
        Топ профессии для вас
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {top3.map(career => (
          <ExpertCareerCard key={career.title} career={career} />
        ))}
      </div>

      {/* Update link */}
      <div className="text-center">
        <Link href="/career/test/holland">
          <button className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <RefreshCw className="h-4 w-4" />
            Обновить анализ (пересдать тест)
          </button>
        </Link>
      </div>
    </section>
  );
}

// ── Main CareerPage ───────────────────────────────────────────────────────────
export const CareerPage = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { tests, isLoading: isLoadingTests } = useTestList();
  const { result: savedResult } = useProfessionalOrientation();
  const { analysis } = useExpertAnalysis();

  const bothTestsDone =
    savedResult?.testResult?.holland !== undefined &&
    savedResult?.testResult?.klimov !== undefined;

  const careers = [
    {
      name: 'Разработчик ПО',
      image: '/icons/software-developer.png',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Data Scientist',
      image: '/icons/data-scientist.png',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Аналитик кибербезопасности',
      image: '/icons/cybersecurity.png',
      color: 'from-red-500 to-red-600',
    },
    {
      name: 'Инженер IoT',
      image: '/icons/iot-engineer.png',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'Инженер-электронщик',
      image: '/icons/electronics-engineer.png',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      name: 'Технический писатель',
      image: '/icons/technical-writer.png',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      name: 'Инженер ИИ',
      image: '/icons/ai-engineer.png',
      color: 'from-pink-500 to-pink-600',
    },
    {
      name: 'DevOps инженер',
      image: '/icons/devops-engineer.png',
      color: 'from-teal-500 to-teal-600',
    },
    {
      name: 'UX/UI дизайнер',
      image: '/icons/ux-designer.png',
      color: 'from-orange-500 to-orange-600',
    },
    {
      name: 'Продуктовый менеджер',
      image: '/icons/product-manager.png',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  const duplicatedCareers = [...careers, ...careers];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animateScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animateScroll);
    };

    animationId = requestAnimationFrame(animateScroll);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="min-h-screen bg-gh-canvas py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Карьерное ориентирование
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            Исследуйте свой потенциал и найдите идеальный карьерный путь в мире технологий.
          </p>
        </div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-4 animate-fade-in-up">
            Профориентационные тесты
          </h2>
          <p className="text-center text-gray-400 mb-10">
            Пройдите один или несколько тестов, чтобы узнать какие IT-профессии вам подходят
          </p>

          {/* Saved results */}
          {savedResult?.testResult && Object.keys(savedResult.testResult).length > 0 && (
            <div className="mb-8 p-4 bg-green-900/20 border border-green-700 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-medium">Ваши последние результаты</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(savedResult.testResult).map(([type, res]: [string, any]) => (
                  <div
                    key={type}
                    className="bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <span className="text-gray-400 text-sm">
                      {type === 'holland' ? 'Холланд:' : 'ДДО Климова:'}
                    </span>
                    <span className="text-white font-medium text-sm">{res.topTypeLabel}</span>
                    <span className="text-blue-400 text-xs">→ {res.topCareers?.[0]}</span>
                  </div>
                ))}
              </div>
              {bothTestsDone && (
                <div className="mt-3">
                  <a
                    href="#expert"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    <Brain className="h-4 w-4" />
                    Перейти к экспертному анализу
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Test cards */}
          {isLoadingTests && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map(test => {
              const hasResult = savedResult?.testResult?.[test.type];
              return (
                <Card key={test.type} className="p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gh-fg">{test.title}</h3>
                    {hasResult && (
                      <span className="flex items-center gap-1 text-green-400 text-xs bg-green-900/30 px-2 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3" />
                        Пройден
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm flex-1 mb-4">{test.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-5">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {test.duration}
                    </span>
                    <span>{test.questionCount} вопросов</span>
                  </div>
                  <Link href={`/career/test/${test.type}`}>
                    <Button
                      variant={hasResult ? 'secondary' : 'primary'}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {hasResult ? 'Пройти снова' : 'Начать тест'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Expert Analysis Section — shown only when analysis is available */}
        {analysis && <ExpertAnalysisSection />}

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12 animate-fade-in-up">
            Исследуйте карьерные пути
          </h2>

          <div
            ref={scrollContainerRef}
            className="relative mb-12 overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex space-x-4 py-4">
              {duplicatedCareers.map((career, index) => (
                <div
                  key={`${career.name}-${index}`}
                  className="flex-shrink-0 w-32 bg-gray-800 rounded-xl p-4 text-center border border-gray-700 hover:scale-110 hover:border-blue-500 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={career.image}
                      alt={career.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-tight group-hover:text-blue-300 transition-colors duration-300">
                    {career.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gh-fg mb-8 text-center">
              Рекомендуемые статьи
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/TechIndustry.jpg"
                    alt="Топ-навыки для IT-специалистов в 2024 году"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-gh-fg mb-3">
                    Топ-навыки для IT-специалистов в 2024 году
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Будьте впереди всех с самыми востребованными навыками в IT-индустрии.
                  </p>
                  <Button variant="primary" className="w-full">
                    Читать далее
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/ProgrammingLanguage.png"
                    alt="Выбор подходящего языка программирования"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-gh-fg mb-3">
                    Выбор подходящего языка программирования для вашей карьеры
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Руководство по выбору лучшего языка программирования в зависимости от ваших
                    карьерных целей.
                  </p>
                  <Button variant="primary" className="w-full">
                    Читать далее
                  </Button>
                </div>
              </Card>

              <Card className="hover:shadow-xl flex flex-col transition-all duration-300 overflow-hidden h-full">
                <div className="relative h-48 bg-gray-700 overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/TechProfessionals.png"
                    alt="Будущее работы в IT-сфере"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-semibold text-gh-fg mb-3">
                    Будущее работы в IT-индустрии
                  </h4>
                  <p className="text-gray-300 mb-4 flex-grow">
                    Анализ новых трендов и перспективных карьерных возможностей в IT-секторе.
                  </p>
                  <Button variant="primary" className="w-full">
                    Читать далее
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
