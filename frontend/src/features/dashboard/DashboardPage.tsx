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

// ── Octicon-style inline icons ──────────────────────────────────
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5Z" />
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.78 4.97a.749.749 0 0 0-1.06 0L6.75 8.94 5.28 7.47a.749.749 0 1 0-1.06 1.06l2 2a.749.749 0 0 0 1.06 0l4.5-4.5a.749.749 0 0 0 0-1.06Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
);

const GraduationCapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.693 1.066a.75.75 0 0 1 .614 0l7.25 3.25a.75.75 0 0 1 0 1.368L13 6.831V10a1 1 0 0 1 .37.217l2 1.75a1 1 0 0 1-1.34 1.483L12 11.968V13.5a.75.75 0 0 1-1.5 0v-2.034l-2.807-2.456A.75.75 0 0 1 7 8.25V6.831L4.193 5.618 8 3.99l3.25 1.458L8 6.906 4.75 5.448l-3.443 1.25L8 9.013l3.25-1.463V8.25a.75.75 0 0 1-.263.573L8.5 11.052V13.5a.75.75 0 0 1-1.5 0v-2.448L4.013 8.823A.75.75 0 0 1 3.75 8.25V6.831L.443 5.684a.75.75 0 0 1 0-1.368Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.042-.018.75.75 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

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
  lecture:  '#2f81f7',
  lab:      '#3fb950',
  practice: '#f0883e',
};

const typeBorderLeft: Record<ScheduleItemType, string> = {
  lecture:  '#2f81f7',
  lab:      '#3fb950',
  practice: '#f0883e',
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
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: '32px' }}>
          <h2 style={{ color: '#e6edf3', marginBottom: 8 }}>Доступ запрещён</h2>
          <p style={{ color: '#8b949e', marginBottom: 24, fontSize: 14 }}>
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
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 24, height: 24, border: '2px solid #30363d',
              borderTopColor: '#2f81f7', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 12px',
            }}
          />
          <p style={{ color: '#8b949e', fontSize: 14 }}>Загрузка данных...</p>
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
    <div style={{ minHeight: '100vh', background: '#0d1117', padding: '24px 0' }}>
      <div className="gh-container">

        {/* ── Page header ─────────────────────────────────────── */}
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #21262d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#2f81f7', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}
            >
              {getDisplayName().charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e6edf3', margin: 0 }}>
                Привет, {getDisplayName().split(' ')[0]}
              </h1>
              <p style={{ fontSize: 13, color: '#8b949e', margin: 0 }}>
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
              padding: '12px 16px', borderBottom: '1px solid #21262d',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e6edf3', fontWeight: 600, fontSize: 14 }}>
                <span style={{ color: '#8b949e' }}><CalendarIcon /></span>
                Расписание занятий
              </div>
              <Link href="/schedule" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#2f81f7', textDecoration: 'none' }}>
                Всё расписание <ArrowRightIcon />
              </Link>
            </div>

            {/* Day tabs */}
            {scheduleDays.length > 0 ? (
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto', borderBottom: '1px solid #21262d' }}>
                {scheduleDays.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      padding: '8px 12px',
                      fontSize: 12,
                      fontWeight: selectedDay === day ? 600 : 400,
                      color: selectedDay === day ? '#e6edf3' : '#8b949e',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: selectedDay === day ? '2px solid #f0883e' : '2px solid transparent',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'color 80ms',
                    }}
                    onMouseEnter={e => { if (selectedDay !== day) e.currentTarget.style.color = '#e6edf3'; }}
                    onMouseLeave={e => { if (selectedDay !== day) e.currentTarget.style.color = '#8b949e'; }}
                  >
                    {day.slice(0, 2)}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Schedule items */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
              {scheduleDays.length === 0 ? (
                <p style={{ color: '#8b949e', fontSize: 13, textAlign: 'center', paddingTop: 24 }}>
                  Расписание пусто
                </p>
              ) : currentDaySchedule.length === 0 ? (
                <p style={{ color: '#8b949e', fontSize: 13, textAlign: 'center', paddingTop: 24 }}>
                  {selectedDay ? `На ${selectedDay.toLowerCase()} занятий нет` : 'Выберите день'}
                </p>
              ) : (
                currentDaySchedule.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderLeft: `3px solid ${typeBorderLeft[item.type]}`,
                      borderRadius: '0 6px 6px 0',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>{item.subject}</span>
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
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#8b949e' }}>
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
              padding: '12px 16px', borderBottom: '1px solid #21262d',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e6edf3', fontWeight: 600, fontSize: 14 }}>
                <span style={{ color: '#8b949e' }}><TrophyIcon /></span>
                Рейтинг группы
              </div>
              {userRank && (
                <Badge variant="done" size="sm">#{userRank.rank} место</Badge>
              )}
            </div>

            <div style={{ padding: '0', overflow: 'hidden' }}>
              {!userGroup ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <p style={{ color: '#8b949e', fontSize: 13, marginBottom: 12 }}>
                    Вы не зачислены ни в одну группу
                  </p>
                  <Link href="/courses">
                    <Button variant="primary" size="sm">Записаться на курс</Button>
                  </Link>
                </div>
              ) : groupRating.length === 0 ? (
                <p style={{ color: '#8b949e', fontSize: 13, textAlign: 'center', padding: '32px 16px' }}>
                  Рейтинг пока пуст
                </p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #21262d' }}>
                      {['#', 'Студент', 'Балл', 'Задания'].map(h => (
                        <th key={h} style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, color: '#8b949e', textAlign: h === '#' || h === 'Балл' || h === 'Задания' ? 'center' : 'left' }}>
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
                            borderBottom: '1px solid #21262d',
                            background: isMe ? 'rgba(31,111,235,0.06)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                            {student.rank <= 3 ? (
                              <span style={{ fontSize: 16 }}>
                                {student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : '🥉'}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, color: '#6e7681' }}>{student.rank}</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 16px' }}>
                            <Link
                              href={`/profile/${student.id}`}
                              style={{ fontSize: 13, color: isMe ? '#2f81f7' : '#e6edf3', fontWeight: isMe ? 600 : 400, textDecoration: 'none' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
                              onMouseLeave={e => (e.currentTarget.style.color = isMe ? '#2f81f7' : '#e6edf3')}
                            >
                              {student.lastName} {student.firstName}
                              {isMe && <span style={{ fontSize: 11, color: '#8b949e', marginLeft: 6 }}>(Вы)</span>}
                            </Link>
                          </td>
                          <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                            <Badge variant={scoreVariant(student.averageScore)} size="sm">
                              {student.averageScore.toFixed(1)}
                            </Badge>
                          </td>
                          <td style={{ padding: '8px 16px', textAlign: 'center', fontSize: 13, color: '#8b949e' }}>
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
  accent:    { fg: '#2f81f7', bg: '#1c2d3f', border: 'rgba(31,111,235,0.3)' },
  success:   { fg: '#3fb950', bg: '#1a2d1a', border: 'rgba(46,160,67,0.3)' },
  attention: { fg: '#f0883e', bg: '#2d1f0a', border: 'rgba(187,128,9,0.3)' },
  danger:    { fg: '#f85149', bg: '#2d0f0f', border: 'rgba(248,81,73,0.3)' },
  done:      { fg: '#a371f7', bg: '#1e1530', border: 'rgba(163,113,247,0.3)' },
  career:    { fg: '#39d353', bg: '#0f2d12', border: 'rgba(57,211,83,0.3)' },
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
          <p style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', margin: 0 }}>{title}</p>
          <p style={{ fontSize: 11, color: '#8b949e', margin: 0 }}>{subtitle}</p>
        </div>
        <span style={{ marginLeft: 'auto', color: c.fg }}><ArrowRightIcon /></span>
      </div>
    </Link>
  );
}

// ── Extra icons ───────────────────────────────────────────────────
function BriefcaseIconLg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.5 1.75C6.5.784 7.284 0 8.25 0h-.5C8.716 0 9.5.784 9.5 1.75V3h2.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5V1.75ZM8 1.5a.25.25 0 0 0-.25.25V3h.5V1.75A.25.25 0 0 0 8 1.5ZM3.5 5v7.5c0 .276.224.5.5.5h8a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H4a.5.5 0 0 0-.5.5Z" />
    </svg>
  );
}
