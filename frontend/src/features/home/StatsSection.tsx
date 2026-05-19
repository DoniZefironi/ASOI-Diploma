'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 12,  suffix: '+', label: 'Курсов' },
  { value: 850, suffix: '+', label: 'Студентов' },
  { value: 94,  suffix: '%', label: 'Завершили курс' },
  { value: 8,   suffix: '',  label: 'Технологий' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(ease * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export const StatsSection = () => (
  <section className="py-12 border-t border-b" style={{ borderColor: 'var(--color-border-default)' }}>
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <div
              className="text-4xl font-bold mb-1"
              style={{ color: 'var(--color-accent-fg)' }}
            >
              <Counter target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
