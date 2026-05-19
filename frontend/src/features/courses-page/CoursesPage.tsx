// features/courses-page/CoursesPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CourseCardWithRegistration } from '@/shared/ui/card';
import { useCourses } from '@/shared/api/admin';
import { useAuth } from '@/shared/lib/auth-context';
import Link from 'next/link';
import { BookOpen, Cpu, Globe, Zap, Terminal, CircuitBoard, GraduationCap, Clock, Users, ArrowRight } from 'lucide-react';

interface Course {
  id: number; name: string; type: string; description: string; duration: number; imageUrl: string; isActive: boolean;
}

const TYPE_MAP: Record<string, { category: string; level: string; levelColor: string }> = {
  'computer_science': { category: 'computer-science', level: 'НАЧИНАЮЩИЙ', levelColor: 'bg-green-100 text-green-800' },
  'electronics':      { category: 'electronics',      level: 'НАЧИНАЮЩИЙ', levelColor: 'bg-green-100 text-green-800' },
  'language':         { category: 'language',          level: 'ВСЕ УРОВНИ', levelColor: 'bg-blue-100 text-blue-800' },
  'iot':              { category: 'iot',               level: 'СРЕДНИЙ',    levelColor: 'bg-yellow-100 text-yellow-800' },
};

function mapCourse(c: Course) {
  const m = TYPE_MAP[c.type] ?? { category: c.type, level: 'НАЧИНАЮЩИЙ', levelColor: 'bg-gray-100 text-gray-800' };
  return { id: c.id, title: c.name, description: c.description, level: m.level, levelColor: m.levelColor, category: m.category, duration: c.duration, imageUrl: c.imageUrl, isActive: c.isActive };
}

const CATEGORIES = [
  { type: 'all',            label: 'Все курсы',    Icon: BookOpen,      accent: 'var(--color-accent-fg)' },
  { type: 'electronics',    label: 'Электроника',  Icon: Zap,           accent: '#f0883e' },
  { type: 'computer-science', label: 'Информатика', Icon: Terminal,     accent: '#2f81f7' },
  { type: 'iot',            label: 'IoT',          Icon: Globe,         accent: '#3fb950' },
  { type: 'language',       label: 'Английский',   Icon: GraduationCap, accent: '#a371f7' },
];

const TOOLS = [
  { href: '/circuit',    label: 'Симулятор схем',  Icon: CircuitBoard, desc: 'Цифровая логика' },
  { href: '/complilier', label: 'Компилятор',       Icon: Terminal,     desc: 'Запуск кода онлайн' },
  { href: '/shematic',   label: 'IoT-симулятор',    Icon: Cpu,          desc: 'Виртуальные устройства' },
];

export const CoursesPage = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { courses, isLoading, isError } = useCourses();
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const t = searchParams?.get('type');
    if (t) setFilterType(t);
  }, [searchParams]);

  const mapped = courses?.map(mapCourse) ?? [];
  const filtered = filterType === 'all' ? mapped : mapped.filter(c => c.category === filterType);
  const totalHours = mapped.reduce((s, c) => s + (c.duration || 0), 0);

  const countByType = (type: string) =>
    type === 'all' ? mapped.length : mapped.filter(c => c.category === type).length;

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas-default)' }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--color-border-default)', borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-canvas-default)' }}>
        <p style={{ color: 'var(--color-danger-fg)' }}>Ошибка загрузки курсов</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '32px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 1200 }}>

        {/* ── Page header ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <BookOpen size={22} color="var(--color-accent-fg)" />
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--color-fg-default)' }}>Каталог курсов</h1>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
                Выберите направление и начните обучение — от основ до практики
              </p>
            </div>

            {/* Summary pills */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Pill icon={<BookOpen size={13} />} value={`${mapped.length}`} label="курсов" />
              <Pill icon={<Clock size={13} />} value={`${totalHours}ч`} label="обучения" />
              <Pill icon={<Users size={13} />} value="500+" label="студентов" />
            </div>
          </div>

          {/* Thin accent line */}
          <div style={{ height: 3, width: 48, borderRadius: 2, background: 'var(--color-accent-emphasis)' }} />
        </div>

        {/* ── Two-column layout ──────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', gap: 24, alignItems: 'start' }}>

          {/* ── Main column ──────────────────────────────────────── */}
          <div>
            {/* Inline filter tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {CATEGORIES.map(({ type, label, Icon }) => {
                const active = filterType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', fontSize: 13, fontWeight: active ? 600 : 400,
                      borderRadius: 20, cursor: 'pointer', transition: 'all 120ms',
                      background: active ? 'var(--color-accent-emphasis)' : 'var(--color-canvas-overlay)',
                      color: active ? '#fff' : 'var(--color-fg-muted)',
                      border: `1px solid ${active ? 'transparent' : 'var(--color-border-default)'}`,
                    }}
                    onMouseEnter={e => !active && (e.currentTarget.style.borderColor = 'var(--color-accent-fg)')}
                    onMouseLeave={e => !active && (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
                  >
                    <Icon size={13} /> {label}
                    <span style={{ fontSize: 11, opacity: 0.7 }}>({countByType(type)})</span>
                  </button>
                );
              })}
            </div>

            {/* Course list */}
            {filtered.length > 0 ? (
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border-default)' }}>
                {filtered.map((course, i) => (
                  <CourseCardWithRegistration key={course.id} course={course} index={i} />
                ))}
              </div>
            ) : (
              <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 10, padding: '48px 24px', textAlign: 'center' }}>
                <BookOpen size={28} color="var(--color-fg-subtle)" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 8px' }}>Курсов по этому направлению нет</p>
                <button onClick={() => setFilterType('all')} style={{ fontSize: 13, color: 'var(--color-accent-fg)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                  Показать все курсы
                </button>
              </div>
            )}

            {/* English vocabulary card */}
            {(filterType === 'all' || filterType === 'language') && (
              <Link
                href="/courses/english-vocab"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 12, padding: '14px 20px', borderRadius: 10, border: '1px solid var(--color-done-muted)', background: 'var(--color-done-subtle)', textDecoration: 'none', transition: 'border-color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-done-fg)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-done-muted)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--color-done-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={18} color="var(--color-done-fg)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 2 }}>Technical English Vocabulary</div>
                    <div style={{ fontSize: 12, color: 'var(--color-fg-muted)' }}>50 IT-терминов · транскрипция · перевод · примеры · режим карточек</div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--color-done-fg)" style={{ flexShrink: 0 }} />
              </Link>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 80 }}>

            {/* Categories nav */}
            <SideCard title="Направления">
              {CATEGORIES.filter(c => c.type !== 'all').map(({ type, label, Icon, accent }) => {
                const n = countByType(type);
                const active = filterType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: active ? 'rgba(47,129,247,0.08)' : 'transparent',
                      transition: 'background 100ms',
                    }}
                    onMouseEnter={e => !active && (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
                    onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Icon size={15} color={active ? accent : 'var(--color-fg-muted)'} />
                      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--color-fg-default)' : 'var(--color-fg-muted)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-fg-subtle)', background: 'var(--color-canvas-inset)', padding: '1px 7px', borderRadius: 20 }}>{n}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setFilterType('all')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: filterType === 'all' ? 'rgba(47,129,247,0.08)' : 'transparent', marginTop: 4,
                  borderTop: '1px solid var(--color-border-muted)', paddingTop: 12,
                }}
                onMouseEnter={e => filterType !== 'all' && (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
                onMouseLeave={e => filterType !== 'all' && (e.currentTarget.style.background = 'transparent')}
              >
                <BookOpen size={15} color={filterType === 'all' ? 'var(--color-accent-fg)' : 'var(--color-fg-muted)'} />
                <span style={{ fontSize: 13, fontWeight: filterType === 'all' ? 600 : 400, color: filterType === 'all' ? 'var(--color-fg-default)' : 'var(--color-fg-muted)' }}>Все направления</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--color-fg-subtle)', background: 'var(--color-canvas-inset)', padding: '1px 7px', borderRadius: 20 }}>{mapped.length}</span>
              </button>
            </SideCard>

            {/* Platform tools */}
            <SideCard title="Практические инструменты">
              <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginBottom: 10, lineHeight: 1.5 }}>
                Закрепляйте знания в интерактивных симуляторах прямо в браузере
              </p>
              {TOOLS.map(({ href, label, Icon, desc }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, textDecoration: 'none', transition: 'background 100ms', marginBottom: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-subtle)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: 'var(--color-canvas-inset)', border: '1px solid var(--color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="var(--color-accent-fg)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>{label}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-fg-muted)' }}>{desc}</div>
                  </div>
                  <ArrowRight size={12} color="var(--color-fg-subtle)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </Link>
              ))}
            </SideCard>

            {/* Learning path hint */}
            <SideCard title="С чего начать?">
              {[
                { step: '1', text: 'Выберите направление', sub: 'Информатика, электроника, IoT или английский' },
                { step: '2', text: 'Запишитесь на группу', sub: 'Выберите удобное время' },
                { step: '3', text: 'Практикуйтесь', sub: 'Симуляторы и задания онлайн' },
              ].map(({ step, text, sub }) => (
                <div key={step} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-accent-emphasis)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    {step}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>{text}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-fg-muted)' }}>{sub}</div>
                  </div>
                </div>
              ))}
              {!user && (
                <Link href="/auth" style={{ display: 'block', textAlign: 'center', padding: '7px', fontSize: 13, fontWeight: 600, color: '#fff', background: 'var(--color-accent-emphasis)', borderRadius: 8, textDecoration: 'none', marginTop: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-accent-fg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-accent-emphasis)')}
                >
                  Войти и начать
                </Link>
              )}
            </SideCard>

          </div>
        </div>
      </div>
    </div>
  );
};

// ── Micro UI ───────────────────────────────────────────────────────

function Pill({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', fontSize: 13 }}>
      <span style={{ color: 'var(--color-accent-fg)' }}>{icon}</span>
      <strong style={{ color: 'var(--color-fg-default)' }}>{value}</strong>
      <span style={{ color: 'var(--color-fg-muted)' }}>{label}</span>
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--color-fg-default)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h3>
      </div>
      <div style={{ padding: '12px 8px' }}>{children}</div>
    </div>
  );
}
