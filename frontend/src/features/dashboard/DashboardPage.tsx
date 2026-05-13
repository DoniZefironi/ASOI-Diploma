// features/dashboard/DashboardPage.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card, StatCard } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import Link from 'next/link';
import { useUserSchedule, ScheduleItem } from '@/shared/api/admin/schedule';
import { useUserRegistrations, useGroupStudentsRating, StudentRating } from '@/shared/api/admin/course-groups';
import { Calendar, Trophy, BookOpen, CheckCircle, Star, GraduationCap, ArrowRight, Briefcase } from 'lucide-react';

type ScheduleItemType = 'lecture' | 'lab' | 'practice';

interface DayScheduleItem {
  id: number;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  classroom: string;
  type: ScheduleItemType;
}

interface GroupRating extends StudentRating {
  rank: number;
}

// ── Lucide icon wrappers ──────────────────────────────────────────
const CalendarIcon = () => <Calendar size={16} />;
const TrophyIcon = () => <Trophy size={16} />;
const BookIcon = () => <BookOpen size={16} />;
const CheckCircleIcon = () => <CheckCircle size={16} />;
const StarIcon = () => <Star size={16} />;
const GraduationCapIcon = () => <GraduationCap size={16} />;
const ArrowRightIcon = () => <ArrowRight size={14} />;

// ── Score color ──────────────────────────────────────────────────
function scoreVariant(score: number): 'success' | 'accent' | 'attention' | 'danger' {
  if (score >= 4.5) return 'success';
  if (score >= 4.0) return 'accent';
  if (score >= 3.5) return 'attention';
  return 'danger';
}

// ── Schedule type style ──────────────────────────────────────────
const typeConfig: Record<ScheduleItemType, { label: string; color: string; border: string }> = {
  lecture:  { label: 'Лекция',        color: 'rgba(31,111,235,0.15)',  border: 'rgba(31,111,235,0.4)' },
  lab:      { label: 'Лабораторная',  color: 'rgba(46,160,67,0.15)',   border: 'rgba(46,160,67,0.4)' },
  practice: { label: 'Практика',      color: 'rgba(187,128,9,0.15)',   border: 'rgba(187,128,9,0.4)' },
};

const typeFg: Record<ScheduleItemType, string> = {
  lecture:  'var(--color-accent-fg)',
  lab:      'var(--color-success-fg)',
  practice: 'var(--color-attention-fg)',
};

const typeBorderLeft: Record<ScheduleItemType, string> = {
  lecture:  'var(--color-accent-fg)',
  lab:      'var(--color-success-fg)',
  practice: 'var(--color-attention-fg)',
};

// ── Component ────────────────────────────────────────────────────
export const DashboardPage = () => {
  const { user } = useAuth();
  const { schedule: userSchedule, isLoading: isLoadingSchedule } = useUserSchedule();
  const { registrations, isLoading: isLoadingRegistrations } = useUserRegistrations();

  const [selectedDay, setSelectedDay] = useState<string>('');
  const [groupRating, setGroupRating] = useState<GroupRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userGroup = useMemo(() => {
    const approved = registrations?.filter(r => r.status === 'approved');
    return approved?.[0]?.courseGroup || null;
  }, [registrations]);

  const { students: groupStudents, isLoading: isLoadingRating } = useGroupStudentsRating(
    userGroup?.id || 0
  );

  useEffect(() => {
    setIsLoading(isLoadingSchedule || isLoadingRegistrations || isLoadingRating);
  }, [isLoadingSchedule, isLoadingRegistrations, isLoadingRating]);

  const scheduleItems: DayScheduleItem[] = useMemo(() => {
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return userSchedule.map(item => {
      const startTime = new Date(item.startTime);
      const day = dayNames[startTime.getDay()];
      let type: ScheduleItemType = 'practice';
      if (item.type.toLowerCase().includes('lecture')) type = 'lecture';
      else if (item.type.toLowerCase().includes('lab') || item.type.toLowerCase().includes('test')) type = 'lab';
      const time = startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      const teacher = item.instructor
        ? `${item.instructor.firstName} ${item.instructor.lastName}`
        : 'Не указан';
      return { id: item.id, day, time, subject: item.title, teacher, classroom: item.location || '—', type };
    });
  }, [userSchedule]);

  useEffect(() => {
    if (groupStudents && groupStudents.length > 0) {
      const sorted = [...groupStudents].sort((a, b) => b.averageScore - a.averageScore);
      setGroupRating(sorted.map((s, i) => ({ ...s, rank: i + 1 })));
    } else {
      setGroupRating([]);
    }
  }, [groupStudents]);

  useEffect(() => {
    const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    setSelectedDay(dayNames[new Date().getDay()]);
  }, []);

  const getScheduleForDay = (day: string) => scheduleItems.filter(i => i.day === day);
  const scheduleDays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    .filter(day => scheduleItems.some(i => i.day === day));

  const getUserRank = () => {
    if (!user) return null;
    return groupRating.find(r =>
      r.firstName.toLowerCase() === user.firstName?.toLowerCase() &&
      r.lastName.toLowerCase() === user.lastName?.toLowerCase()
    ) || null;
  };

  // ── Guards ────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: '32px' }}>
          <h2 style={{ color: 'var(--color-fg-default)', marginBottom: 8 }}>Доступ запрещён</h2>
          <p style={{ color: 'var(--color-fg-muted)', marginBottom: 24, fontSize: 14 }}>
            Пожалуйста, войдите в систему чтобы просмотреть дашборд.
          </p>
          <Button variant="primary" onClick={() => (window.location.href = '/auth')}>
            Войти
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 24, height: 24, border: '2px solid var(--color-border-default)',
              borderTopColor: 'var(--color-accent-fg)', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 12px',
            }}
          />
          <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const userRank = getUserRank();
  const currentDaySchedule = getScheduleForDay(selectedDay);
  const activeCoursesCount = registrations?.filter(r => r.status === 'approved').length || 0;
  const completedAssignmentsCount = userRank?.completedAssignments || 0;

  const getDisplayName = () => {
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.email?.split('@')[0] || 'Пользователь';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '24px 0' }}>
      <div className="gh-container">

        {/* ── Page header ─────────────────────────────────────── */}
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--color-border-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--color-accent-fg)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#ffffff', flexShrink: 0,
              }}
            >
              {getDisplayName().charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>
                Привет, {getDisplayName().split(' ')[0]}
              </h1>
              <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: 0 }}>
                Вот что происходит сегодня
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat row ────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          <StatCard
            label="Активных курсов"
            value={activeCoursesCount}
            icon={<BookIcon />}
            color="accent"
          />
          <StatCard
            label="Выполнено заданий"
            value={completedAssignmentsCount}
            icon={<CheckCircleIcon />}
            color="success"
          />
          <StatCard
            label="Средний балл"
            value={userRank?.averageScore.toFixed(1) || '—'}
            icon={<StarIcon />}
            color="attention"
          />
          {userRank && (
            <StatCard
              label="Место в рейтинге"
              value={`#${userRank.rank}`}
              icon={<TrophyIcon />}
              color="done"
            />
          )}
        </div>

        {/* ── Main 2-col grid ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Schedule card */}
          <Card noPadding>
            {/* Card header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid var(--color-border-muted)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-fg-default)', fontWeight: 600, fontSize: 14 }}>
                <span style={{ color: 'var(--color-fg-muted)' }}><CalendarIcon /></span>
                Расписание занятий
              </div>
              <Link href="/schedule" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-accent-fg)', textDecoration: 'none' }}>
                Всё расписание <ArrowRightIcon />
              </Link>
            </div>

            {/* Day tabs */}
            {scheduleDays.length > 0 ? (
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid var(--color-border-muted)' }}>
                {scheduleDays.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      padding: '8px 12px',
                      fontSize: 12,
                      fontWeight: selectedDay === day ? 600 : 400,
                      color: selectedDay === day ? 'var(--color-fg-default)' : 'var(--color-fg-muted)',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: selectedDay === day ? '2px solid #f0883e' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'color 80ms',
                    }}
                    onMouseEnter={e => { if (selectedDay !== day) e.currentTarget.style.color = 'var(--color-fg-default)'; }}
                    onMouseLeave={e => { if (selectedDay !== day) e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
                  >
                    {day.slice(0, 2)}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Schedule items */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
              {scheduleDays.length === 0 ? (
                <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, textAlign: 'center', paddingTop: 24 }}>
                  Расписание пусто
                </p>
              ) : currentDaySchedule.length === 0 ? (
                <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, textAlign: 'center', paddingTop: 24 }}>
                  {selectedDay ? `На ${selectedDay.toLowerCase()} занятий нет` : 'Выберите день'}
                </p>
              ) : (
                currentDaySchedule.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--color-canvas-default)',
                      border: '1px solid var(--color-border-default)',
                      borderLeft: `3px solid ${typeBorderLeft[item.type]}`,
                      borderRadius: '0 6px 6px 0',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)' }}>{item.subject}</span>
                      <span
                        style={{
                          fontSize: 11, fontWeight: 500, padding: '1px 6px',
                          borderRadius: 20, background: typeConfig[item.type].color,
                          color: typeFg[item.type], border: `1px solid ${typeConfig[item.type].border}`,
                          flexShrink: 0,
                        }}
                      >
                        {typeConfig[item.type].label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--color-fg-muted)' }}>
                      <span>{item.time}</span>
                      <span>{item.teacher}</span>
                      <span>Ауд. {item.classroom}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Rating card */}
          <Card noPadding>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid var(--color-border-muted)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-fg-default)', fontWeight: 600, fontSize: 14 }}>
                <span style={{ color: 'var(--color-fg-muted)' }}><TrophyIcon /></span>
                Рейтинг группы
              </div>
              {userRank && (
                <Badge variant="done" size="sm">#{userRank.rank} место</Badge>
              )}
            </div>

            <div style={{ padding: '0', overflow: 'hidden' }}>
              {!userGroup ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, marginBottom: 12 }}>
                    Вы не зачислены ни в одну группу
                  </p>
                  <Link href="/courses">
                    <Button variant="primary" size="sm">Записаться на курс</Button>
                  </Link>
                </div>
              ) : groupRating.length === 0 ? (
                <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, textAlign: 'center', padding: '32px 16px' }}>
                  Рейтинг пока пуст
                </p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border-muted)' }}>
                      {['#', 'Студент', 'Балл', 'Задания'].map(h => (
                        <th key={h} style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, color: 'var(--color-fg-muted)', textAlign: h === '#' || h === 'Балл' || h === 'Задания' ? 'center' : 'left' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groupRating.map(student => {
                      const isMe = userRank && student.id === userRank.id;
                      return (
                        <tr
                          key={student.id}
                          style={{
                            borderBottom: '1px solid var(--color-border-muted)',
                            background: isMe ? 'rgba(31,111,235,0.06)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                            {student.rank <= 3 ? (
                              <span style={{ fontSize: 16 }}>
                                {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : '🥉'}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, color: 'var(--color-fg-subtle)' }}>{student.rank}</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 16px' }}>
                            <Link
                              href={`/profile/${student.id}`}
                              style={{ fontSize: 13, color: isMe ? 'var(--color-accent-fg)' : 'var(--color-fg-default)', fontWeight: isMe ? 600 : 400, textDecoration: 'none' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent-fg)')}
                              onMouseLeave={e => (e.currentTarget.style.color = isMe ? 'var(--color-accent-fg)' : 'var(--color-fg-default)')}
                            >
                              {student.lastName} {student.firstName}
                              {isMe && <span style={{ fontSize: 11, color: 'var(--color-fg-muted)', marginLeft: 6 }}>(Вы)</span>}
                            </Link>
                          </td>
                          <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                            <Badge variant={scoreVariant(student.averageScore)} size="sm">
                              {student.averageScore.toFixed(1)}
                            </Badge>
                          </td>
                          <td style={{ padding: '8px 16px', textAlign: 'center', fontSize: 13, color: 'var(--color-fg-muted)' }}>
                            {student.completedAssignments}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

        {/* ── Quick links row ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16 }}>
          <QuickLink
            href="/electives"
            title="Факультативы"
            subtitle="Дополнительные занятия"
            icon={<GraduationCapIcon />}
            color="career"
          />
          <QuickLink
            href="/internships"
            title="Стажировки"
            subtitle="Вакансии и открытые позиции"
            icon={<BriefcaseIconLg />}
            color="accent"
          />
          <QuickLink
            href="/hackathons"
            title="Хакатоны"
            subtitle="Соревнования и события"
            icon={<TrophyIcon />}
            color="attention"
          />
          <QuickLink
            href="/peer-review"
            title="Peer Review"
            subtitle="Задания на проверку"
            icon={<CheckCircleIcon />}
            color="success"
          />
        </div>

      </div>

      {/* spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ── QuickLink tile ────────────────────────────────────────────────
const colorMap = {
  accent:    { fg: 'var(--color-accent-fg)',     bg: 'var(--color-accent-subtle)',     border: 'var(--color-accent-muted)' },
  success:   { fg: 'var(--color-success-fg)',    bg: 'var(--color-success-subtle)',    border: 'var(--color-success-muted)' },
  attention: { fg: 'var(--color-attention-fg)',  bg: 'var(--color-attention-subtle)',  border: 'var(--color-attention-muted)' },
  danger:    { fg: 'var(--color-danger-fg)',     bg: 'var(--color-danger-subtle)',     border: 'var(--color-danger-muted)' },
  done:      { fg: 'var(--color-done-fg)',       bg: 'var(--color-done-subtle)',       border: 'var(--color-done-muted)' },
  career:    { fg: 'var(--color-career-fg)',     bg: 'var(--color-career-subtle)',     border: 'rgba(57,211,83,0.3)' },
};

function QuickLink({ href, title, subtitle, icon, color }: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
}) {
  const c = colorMap[color];
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: 6,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          transition: 'border-color 80ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = c.fg)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}
      >
        <span style={{ color: c.fg, flexShrink: 0 }}>{icon}</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>{title}</p>
          <p style={{ fontSize: 11, color: 'var(--color-fg-muted)', margin: 0 }}>{subtitle}</p>
        </div>
        <span style={{ marginLeft: 'auto', color: c.fg }}><ArrowRightIcon /></span>
      </div>
    </Link>
  );
}

// ── Extra icons ───────────────────────────────────────────────────
function BriefcaseIconLg() {
  return <Briefcase size={16} />;
}
