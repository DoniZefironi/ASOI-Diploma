'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const FEATURES = [
  {
    letter: 'Схм',
    title: 'Эмулятор схем',
    description: 'Проектируйте логические схемы, тестируйте вентили и триггеры в реальном времени с ИИ-помощником.',
    href: '/circuit',
    accentVar: 'var(--color-accent-fg)',
    bgVar: 'var(--color-accent-subtle)',
  },
  {
    letter: 'IoT',
    title: 'IoT-симулятор',
    description: 'Моделируйте устройства интернета вещей, управляйте виртуальными датчиками и исполнительными устройствами.',
    href: '/shematic',
    accentVar: 'var(--color-done-fg)',
    bgVar: 'var(--color-done-subtle)',
  },
  {
    letter: 'Кур',
    title: 'Курсы',
    description: 'Структурированные учебные материалы по информатике, электронике, английскому языку и программированию.',
    href: '/courses',
    accentVar: 'var(--color-success-fg)',
    bgVar: 'var(--color-success-subtle)',
  },
  {
    letter: 'Хак',
    title: 'Хакатоны',
    description: 'Командные инженерные соревнования с реальными задачами и оценкой проектов.',
    href: '/hackathons',
    accentVar: 'var(--color-attention-fg)',
    bgVar: 'var(--color-attention-subtle)',
  },
  {
    letter: 'Фор',
    title: 'Форум',
    description: 'Задавайте вопросы, делитесь решениями и обсуждайте темы с сообществом студентов и преподавателей.',
    href: '/forum',
    accentVar: 'var(--color-success-emphasis)',
    bgVar: 'var(--color-success-subtle)',
  },
  {
    letter: 'Кар',
    title: 'Карьера',
    description: 'Пройдите диагностику навыков, получите рекомендации по IT-специальностям и подготовьтесь к собеседованию.',
    href: '/career',
    accentVar: 'var(--color-danger-fg)',
    bgVar: 'var(--color-danger-subtle)',
  },
];

export const FeaturesSection = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--color-fg-default)' }}
          >
            Всё для обучения — в одном месте
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-fg-muted)' }}>
            Практические инструменты, симуляторы и сообщество для уверенного старта в IT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Link
              key={f.href + f.title}
              href={f.href}
              className={`group block rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{
                borderColor: 'var(--color-border-default)',
                background: 'var(--color-canvas-overlay)',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold mb-4"
                style={{ background: f.bgVar, color: f.accentVar }}
              >
                {f.letter}
              </div>
              <h3
                className="text-lg font-semibold mb-2 group-hover:underline"
                style={{ color: 'var(--color-fg-default)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
                {f.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
