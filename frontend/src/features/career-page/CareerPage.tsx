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
import {
  Clock, CheckCircle, ArrowRight, Loader2, Brain, TrendingUp, RefreshCw, Target,
} from 'lucide-react';

// ── Confidence ring ───────────────────────────────────────────────
function ConfidenceRing({ value, size = 72, strokeWidth = 6 }: { value: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-border-default)" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#3B82F6" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }} />
    </svg>
  );
}

// ── Expert career card ────────────────────────────────────────────
function ExpertCareerCard({ career }: { career: ExpertCareer }) {
  return (
    <Card className="p-5 flex flex-col gap-4 h-full">
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <ConfidenceRing value={career.confidence} size={64} strokeWidth={5} />
          <span className="absolute inset-0 flex items-center justify-center text-xl">{career.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-gh-fg font-semibold text-base leading-snug">{career.title}</h4>
          <p className="text-blue-400 text-xs mt-0.5">{career.confidence}% совпадение</p>
        </div>
      </div>
      <p className="text-gh-fg-muted text-sm leading-relaxed flex-1">{career.description}</p>
      <div>
        <p className="text-gh-fg-subtle text-xs uppercase tracking-wide mb-2">Навыки</p>
        <div className="flex flex-wrap gap-1.5">
          {career.skills.slice(0, 5).map(s => (
            <span key={s} className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 text-blue-500 rounded-full text-xs">{s}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-green-400 font-medium">{career.salaryRange}</span>
        <span className={`px-2 py-0.5 rounded-full ${career.demandLevel === 'Очень высокий' ? 'bg-green-500/15 text-green-600 dark:text-green-400' : career.demandLevel === 'Высокий' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' : 'bg-gh-canvas-inset text-gh-fg-muted'}`}>
          {career.demandLevel}
        </span>
      </div>
      {career.growthPath.length > 0 && (
        <div>
          <p className="text-gh-fg-subtle text-xs uppercase tracking-wide mb-2">Карьерный путь</p>
          <div className="flex items-center gap-1 flex-wrap">
            {career.growthPath.map((step, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-gh-fg-muted text-xs">{step}</span>
                {i < career.growthPath.length - 1 && <ArrowRight className="h-3 w-3 text-gh-fg-subtle flex-shrink-0" />}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Expert Analysis ───────────────────────────────────────────────
function ExpertAnalysisSection() {
  const { analysis, isLoading } = useExpertAnalysis();
  if (isLoading) return <section style={{ marginBottom: 48 }}><div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Loader2 size={28} color="var(--color-accent-fg)" style={{ animation: 'spin 1s linear infinite' }} /></div></section>;
  if (!analysis) return null;
  const top3 = analysis.topCareers.slice(0, 3);
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Brain size={22} color="var(--color-accent-fg)" />
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--color-fg-default)' }}>Экспертный анализ</h2>
      </div>
      <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--color-fg-muted)' }}>Персонализированные рекомендации на основе обоих тестов</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ background: 'var(--color-canvas-overlay)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--color-border-default)' }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Тип Холланда</p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-fg-default)' }}>{analysis.hollandLabel}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-accent-fg)' }}>Код: {analysis.hollandType}</p>
        </div>
        <div style={{ background: 'var(--color-canvas-overlay)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--color-border-default)' }}>
          <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Тип Климова</p>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-fg-default)' }}>{analysis.klimovLabel}</p>
        </div>
      </div>

      <div style={{ background: 'rgba(47,129,247,0.06)', border: '1px solid rgba(47,129,247,0.25)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
        <TrendingUp size={16} color="var(--color-accent-fg)" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-default)', lineHeight: 1.6 }}>{analysis.personalityInsight}</p>
      </div>

      <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: 'var(--color-fg-default)' }}>Топ профессии для вас</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {top3.map(c => <ExpertCareerCard key={c.title} career={c} />)}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Link href="/career/test/holland" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-fg-muted)', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-fg-default)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-fg-muted)')}
        >
          <RefreshCw size={13} /> Обновить анализ
        </Link>
      </div>
    </section>
  );
}

// ── IT careers data ───────────────────────────────────────────────
const IT_CAREERS = [
  { title: 'Frontend',          salary: '80–200 т.р.',  icon: '🖥', bg: 'rgba(47,129,247,0.1)',  accent: '#2f81f7', tags: ['React', 'TypeScript'] },
  { title: 'Backend',           salary: '90–220 т.р.',  icon: '⚙',  bg: 'rgba(63,185,80,0.1)',   accent: '#3fb950', tags: ['Node.js', 'Python'] },
  { title: 'Data Scientist',    salary: '100–250 т.р.', icon: '📊', bg: 'rgba(163,113,247,0.1)', accent: '#a371f7', tags: ['Python', 'ML'] },
  { title: 'DevOps',            salary: '100–230 т.р.', icon: '🔧', bg: 'rgba(240,136,62,0.1)',  accent: '#f0883e', tags: ['Docker', 'K8s'] },
  { title: 'Кибербезопасность', salary: '90–240 т.р.',  icon: '🔐', bg: 'rgba(248,81,73,0.1)',   accent: '#f85149', tags: ['Pentest', 'Linux'] },
  { title: 'Инженер IoT',       salary: '70–170 т.р.',  icon: '📡', bg: 'rgba(57,211,83,0.1)',  accent: '#39d353', tags: ['Arduino', 'MQTT'] },
  { title: 'UX/UI-дизайнер',    salary: '60–160 т.р.',  icon: '🎨', bg: 'rgba(210,153,34,0.1)', accent: '#d29922', tags: ['Figma', 'Research'] },
  { title: 'QA-инженер',        salary: '60–150 т.р.',  icon: '✅', bg: 'rgba(31,111,235,0.1)', accent: '#1f6feb', tags: ['Selenium', 'Jest'] },
];

// ── Main ──────────────────────────────────────────────────────────
export const CareerPage = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { tests, isLoading: isLoadingTests } = useTestList();
  const { result: savedResult } = useProfessionalOrientation();
  const { analysis } = useExpertAnalysis();

  const bothTestsDone =
    savedResult?.testResult?.holland !== undefined &&
    savedResult?.testResult?.klimov !== undefined;

  const careers = [
    { name: 'Разработчик ПО',             image: '/icons/software-developer.png' },
    { name: 'Data Scientist',              image: '/icons/data-scientist.png' },
    { name: 'Аналитик кибербезопасности', image: '/icons/cybersecurity.png' },
    { name: 'Инженер IoT',                image: '/icons/iot-engineer.png' },
    { name: 'Инженер-электронщик',        image: '/icons/electronics-engineer.png' },
    { name: 'Технический писатель',       image: '/icons/technical-writer.png' },
    { name: 'Инженер ИИ',                 image: '/icons/ai-engineer.png' },
    { name: 'DevOps инженер',             image: '/icons/devops-engineer.png' },
    { name: 'UX/UI дизайнер',             image: '/icons/ux-designer.png' },
    { name: 'Продуктовый менеджер',       image: '/icons/product-manager.png' },
  ];
  const duplicated = [...careers, ...careers];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let id: number, pos = 0;
    const tick = () => {
      if (!isPaused && el) { pos += 0.5; if (pos >= el.scrollWidth / 2) pos = 0; el.scrollLeft = pos; }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isPaused]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '32px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Target size={22} color="var(--color-accent-fg)" />
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-fg-default)' }}>Карьерное ориентирование</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
            Пройдите тесты, узнайте подходящие IT-профессии и получите экспертный анализ
          </p>
          <div style={{ height: 3, width: 48, borderRadius: 2, background: 'var(--color-accent-emphasis)', marginTop: 14 }} />
        </div>

        {/* ── Tests ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--color-fg-default)' }}>Профориентационные тесты</h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--color-fg-muted)' }}>
            Пройдите один или несколько тестов, чтобы узнать какие IT-профессии вам подходят
          </p>

          {/* Saved results */}
          {savedResult?.testResult && Object.keys(savedResult.testResult).length > 0 && (
            <div style={{ marginBottom: 20, padding: '14px 18px', background: 'rgba(63,185,80,0.06)', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <CheckCircle size={15} color="var(--color-success-fg)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success-fg)' }}>Последние результаты</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(savedResult.testResult).map(([type, res]: [string, any]) => (
                  <div key={type} style={{ background: 'var(--color-canvas-overlay)', borderRadius: 8, padding: '5px 12px', border: '1px solid var(--color-border-default)', fontSize: 12 }}>
                    <span style={{ color: 'var(--color-fg-muted)' }}>{type === 'holland' ? 'Холланд' : 'ДДО Климова'}: </span>
                    <strong style={{ color: 'var(--color-fg-default)' }}>{res.topTypeLabel}</strong>
                    <span style={{ color: 'var(--color-accent-fg)', marginLeft: 6 }}>→ {res.topCareers?.[0]}</span>
                  </div>
                ))}
              </div>
              {bothTestsDone && (
                <a href="#expert" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12, color: 'var(--color-accent-fg)', textDecoration: 'none' }}>
                  <Brain size={13} /> Перейти к экспертному анализу <ArrowRight size={11} />
                </a>
              )}
            </div>
          )}

          {isLoadingTests ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <Loader2 size={28} color="var(--color-accent-fg)" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, maxWidth: 760, margin: '0 auto' }}>
              {tests.map(test => {
                const hasResult = savedResult?.testResult?.[test.type];
                return (
                  <div key={test.type} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 150ms, transform 150ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent-fg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-default)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-fg-default)', lineHeight: 1.3 }}>{test.title}</h3>
                      {hasResult && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--color-success-fg)', background: 'rgba(63,185,80,0.1)', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
                          <CheckCircle size={10} /> Пройден
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.55, flex: 1 }}>{test.description}</p>
                    <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--color-fg-subtle)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {test.duration}</span>
                      <span>{test.questionCount} вопросов</span>
                    </div>
                    <Link href={`/career/test/${test.type}`}>
                      <Button variant={hasResult ? 'secondary' : 'primary'} className="w-full flex items-center justify-center gap-2">
                        {hasResult ? 'Пройти снова' : 'Начать тест'} <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── IT Careers grid ───────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--color-fg-default)' }}>Популярные IT-направления</h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--color-fg-muted)' }}>Тесты помогут определить, какие из этих профессий подходят вам больше всего</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {IT_CAREERS.map(c => (
              <div key={c.title} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderLeft: `3px solid ${c.accent}`, borderRadius: 10, padding: '14px 16px', transition: 'transform 150ms, box-shadow 150ms', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{c.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>{c.title}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-success-fg)', fontWeight: 600, marginBottom: 8 }}>{c.salary}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {c.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, color: 'var(--color-fg-muted)', background: 'var(--color-canvas-inset)', border: '1px solid var(--color-border-muted)', padding: '1px 7px', borderRadius: 20 }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Expert analysis ───────────────────────────────────── */}
        <div id="expert"><ExpertAnalysisSection /></div>

        {/* ── Career scroll ─────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: 'var(--color-fg-default)', textAlign: 'center' }}>Исследуйте карьерные пути</h2>
          <div ref={scrollRef} style={{ overflow: 'hidden' }} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div style={{ display: 'flex', gap: 12, padding: '4px 0' }}>
              {duplicated.map((c, i) => (
                <div key={`${c.name}-${i}`} style={{ flexShrink: 0, width: 112, background: 'var(--color-canvas-overlay)', borderRadius: 12, padding: 12, textAlign: 'center', border: '1px solid var(--color-border-default)', cursor: 'pointer', transition: 'all 200ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent-fg)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-default)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 8px', position: 'relative', background: 'var(--color-canvas-inset)' }}>
                    <Image src={c.image} alt={c.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: 'var(--color-fg-default)', lineHeight: 1.3 }}>{c.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Articles ──────────────────────────────────────────── */}
        <section>
          <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: 'var(--color-fg-default)', textAlign: 'center' }}>Рекомендуемые статьи</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {[
              { img: '/images/TechIndustry.jpg',       title: 'Топ-навыки для IT-специалистов в 2024 году',    desc: 'Будьте впереди всех с самыми востребованными навыками.' },
              { img: '/images/ProgrammingLanguage.png', title: 'Выбор языка программирования для карьеры',     desc: 'Руководство по выбору лучшего языка под ваши цели.' },
              { img: '/images/TechProfessionals.png',   title: 'Будущее работы в IT-индустрии',                desc: 'Анализ новых трендов и перспективных возможностей.' },
            ].map(({ img, title, desc }) => (
              <div key={title} style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 150ms, transform 150ms' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent-fg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-default)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                <div style={{ height: 150, position: 'relative', background: 'var(--color-canvas-inset)' }}>
                  <Image src={img} alt={title} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                </div>
                <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--color-fg-default)', lineHeight: 1.4 }}>{title}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-fg-muted)', lineHeight: 1.5, flex: 1 }}>{desc}</p>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'var(--color-accent-emphasis)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-fg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent-emphasis)')}
                  >
                    Читать <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};
