// src/features/profile/ProfilePage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import Link from 'next/link';
import { MyCoursesModal } from './components/MyCoursesModal';
import { useInformaticsCourseRegistration } from '@/shared/api/admin/registrations';
import { useProfessionalOrientation } from '@/shared/api/admin/professional-orientation';
import { ProfOrientationTestModal } from './components/ProfOrientationTestModal';
import { hackathonsApi, HackathonTeam, HackathonSubmission } from '@/shared/api/hackathons';
import { AchievementsSection } from './AchievementsSection';

// ── Icons ─────────────────────────────────────────────────────────
const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
  </svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5Z" />
  </svg>
);

const CompassIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 .25a7.75 7.75 0 1 0 0 15.5A7.75 7.75 0 0 0 8 .25Zm0 14a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5ZM6.78 6.22a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 1 0-1.06-1.06L7.75 7.19 6.78 6.22Z" />
  </svg>
);

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Zm-1.45 3.563-1.44-1.44-6.194 6.193a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.249.249 0 0 0 .108-.064Z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
  </svg>
);

// ── GhInput helper ────────────────────────────────────────────────
function GhInput({ error = false, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{
        display: 'block', width: '100%',
        background: '#0d1117',
        border: `1px solid ${error ? '#f85149' : focused ? '#2f81f7' : '#30363d'}`,
        borderRadius: 6, padding: '5px 12px', fontSize: 14,
        color: '#e6edf3', lineHeight: 1.5, outline: 'none',
        boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(248,81,73,0.25)' : 'rgba(47,129,247,0.25)'}` : 'none',
        transition: 'border-color 80ms, box-shadow 80ms', boxSizing: 'border-box',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
}

// ── Section link in sidebar ───────────────────────────────────────
function SidebarLink({ href, icon, children, onClick }: {
  href?: string; icon: React.ReactNode; children: React.ReactNode; onClick?: () => void;
}) {
  const style: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 8px', borderRadius: 6, fontSize: 14,
    color: '#e6edf3', textDecoration: 'none', background: 'transparent',
    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
    transition: 'background 80ms',
  };
  const hoverIn = (e: React.MouseEvent<any>) => (e.currentTarget.style.background = '#21262d');
  const hoverOut = (e: React.MouseEvent<any>) => (e.currentTarget.style.background = 'transparent');

  if (href) return (
    <Link href={href} style={style} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
      <span style={{ color: '#8b949e', display: 'flex' }}>{icon}</span>
      {children}
    </Link>
  );

  return (
    <button style={style} onClick={onClick} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
      <span style={{ color: '#8b949e', display: 'flex' }}>{icon}</span>
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────
export const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [isProfOrientationModalOpen, setIsProfOrientationModalOpen] = useState(false);
  const [hackathonTeams, setHackathonTeams] = useState<HackathonTeam[]>([]);
  const [hackathonSubmissions, setHackathonSubmissions] = useState<HackathonSubmission[]>([]);
  const [isLoadingHackathons, setIsLoadingHackathons] = useState(false);

  const { data: profOrientationResult } = useProfessionalOrientation();
  const {
    registration: informaticsRegistration,
    hasAccess: hasInformaticsAccess,
    isLoading: registrationsLoading,
  } = useInformaticsCourseRegistration();

  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '' });

  const userRoles = user?.roles || [];
  const hasStudentAccess = hasStudentRole(userRoles);
  const isMentor = hasMentorRole(userRoles);
  const isAdmin = hasAdminRole(userRoles);
  const canShowProfOrientationTab = hasStudentAccess && hasInformaticsAccess && !profOrientationResult;

  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.email) return user.email.split('@')[0];
    return 'Пользователь';
  };

  useEffect(() => {
    if (user) {
      setEditForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '' });
      if (hasStudentAccess) loadHackathons();
    }
  }, [user, hasStudentAccess]);

  const loadHackathons = async () => {
    setIsLoadingHackathons(true);
    try {
      const [teams, submissions] = await Promise.all([
        hackathonsApi.getUserTeams().catch(() => []),
        hackathonsApi.getUserSubmissions().catch(() => []),
      ]);
      setHackathonTeams(teams || []);
      setHackathonSubmissions(submissions || []);
    } catch { /* silent */ }
    finally { setIsLoadingHackathons(false); }
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: 32 }}>
        <h2 style={{ color: '#e6edf3', marginBottom: 8 }}>Доступ запрещён</h2>
        <p style={{ color: '#8b949e', marginBottom: 24, fontSize: 14 }}>Войдите, чтобы просмотреть профиль.</p>
        <Button variant="primary" onClick={() => (window.location.href = '/auth')}>Войти</Button>
      </Card>
    </div>
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const updatedUser = { ...user, ...editForm };
      const token = localStorage.getItem('access_token');
      if (token) login(token, updatedUser);
      setIsEditing(false);
    } catch {
      alert('Ошибка при обновлении профиля');
    } finally { setIsSaving(false); }
  };

  const statusBadge = informaticsRegistration?.status;

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', padding: '24px 0' }}>
      <div className="gh-container">

        {/* ── Page header ───────────────────────────────────── */}
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e6edf3', margin: 0 }}>Профиль</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>

          {/* ── Left sidebar ──────────────────────────────────── */}
          <aside>
            {/* Avatar & name */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: '#2f81f7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 auto 12px',
              }}>
                {getDisplayName().charAt(0).toUpperCase()}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: '#e6edf3', margin: '0 0 2px' }}>
                {getDisplayName()}
              </h2>
              <p style={{ fontSize: 13, color: '#8b949e', margin: 0 }}>{user.email}</p>

              {/* Course registration status */}
              {hasStudentAccess && !registrationsLoading && (
                <div style={{ marginTop: 12 }}>
                  {informaticsRegistration ? (
                    <Badge
                      variant={statusBadge === 'approved' ? 'success' : statusBadge === 'pending' ? 'attention' : 'danger'}
                      dot
                    >
                      Информатика:{' '}
                      {statusBadge === 'approved' ? 'одобрено' : statusBadge === 'pending' ? 'ожидает' : 'отклонено'}
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">Не зачислен на курс</Badge>
                  )}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #21262d', paddingTop: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                Навигация
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SidebarLink href="/profile" icon={<PersonIcon />}>
                  Мой профиль
                </SidebarLink>
                {hasStudentAccess && (
                  <SidebarLink icon={<BookIcon />} onClick={() => setIsCoursesModalOpen(true)}>
                    Мои курсы
                  </SidebarLink>
                )}
                {hasStudentAccess && (
                  <SidebarLink href="/hackathons" icon={<TrophyIcon />}>
                    Мои хакатоны
                  </SidebarLink>
                )}
                {hasStudentAccess && (
                  <SidebarLink href="/peer-review" icon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h4.5a.75.75 0 0 1 .75.75v.128a2.251 2.251 0 1 0 1.5 0V9.25a2.25 2.25 0 0 0-2.25-2.25h-4.5A.75.75 0 0 1 5 6.25Zm6.5 6.625a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>
                  }>
                    Peer Review
                  </SidebarLink>
                )}
                {canShowProfOrientationTab && (
                  <SidebarLink icon={<CompassIcon />} onClick={() => setIsProfOrientationModalOpen(true)}>
                    Профориентация
                  </SidebarLink>
                )}
              </div>
            </div>

            {/* Role-based admin/mentor shortcuts */}
            {(isAdmin || isMentor) && (
              <div style={{ borderTop: '1px solid #21262d', paddingTop: 16, marginTop: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                  {isAdmin ? 'Администрирование' : 'Наставничество'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {isAdmin && <SidebarLink href="/admin" icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z"/></svg>}>Панель администратора</SidebarLink>}
                  {(isMentor || isAdmin) && <SidebarLink href="/mentor" icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V9.5A2.5 2.5 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Zm-6 0a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Zm8.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"/></svg>}>Панель ментора</SidebarLink>}
                </div>
              </div>
            )}
          </aside>

          {/* ── Main content ──────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Profile info card */}
            <Card noPadding>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #21262d' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Информация профиля</span>
                {!isEditing ? (
                  <Button variant="secondary" size="sm" leadingIcon={<PencilIcon />} onClick={() => setIsEditing(true)}>
                    Редактировать
                  </Button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="success" size="sm" leadingIcon={<CheckIcon />} loading={isSaving} onClick={handleSave}>
                      Сохранить
                    </Button>
                    <Button variant="ghost" size="sm" leadingIcon={<XIcon />} onClick={() => {
                      setEditForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '' });
                      setIsEditing(false);
                    }}>
                      Отмена
                    </Button>
                  </div>
                )}
              </div>
              <div style={{ padding: 16 }}>
                {isEditing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#e6edf3', marginBottom: 6 }}>Имя</label>
                      <GhInput
                        value={editForm.firstName}
                        onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))}
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#e6edf3', marginBottom: 6 }}>Фамилия</label>
                      <GhInput
                        value={editForm.lastName}
                        onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))}
                        disabled={isSaving}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#e6edf3', marginBottom: 6 }}>Email</label>
                      <GhInput
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                ) : (
                  <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: 0 }}>
                    <InfoItem label="Имя" value={user.firstName || '—'} />
                    <InfoItem label="Фамилия" value={user.lastName || '—'} />
                    <InfoItem label="Email" value={user.email} />
                    <InfoItem label="Статус" value={
                      <Badge variant="success" dot>Активен</Badge>
                    } />
                  </dl>
                )}
              </div>
            </Card>

            {/* Prof orientation result */}
            {hasStudentAccess && profOrientationResult && (
              <Card noPadding>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#8b949e', display: 'flex' }}><CompassIcon /></span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Результат профориентации</span>
                  <Badge variant="success" size="sm" style={{ marginLeft: 'auto' }}>Завершён</Badge>
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ color: '#8b949e', fontSize: 13, margin: '0 0 4px' }}>Рекомендуемая профессия</p>
                  <p style={{ color: '#e6edf3', fontSize: 16, fontWeight: 600, margin: 0 }}>
                    {profOrientationResult.recommendedProfession}
                  </p>
                </div>
              </Card>
            )}

            {/* Prof orientation CTA */}
            {hasStudentAccess && hasInformaticsAccess && !profOrientationResult && (
              <Card noPadding>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#8b949e', display: 'flex' }}><CompassIcon /></span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Профориентация доступна</span>
                  <Badge variant="accent" size="sm" style={{ marginLeft: 'auto' }}>Новое</Badge>
                </div>
                <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <p style={{ color: '#8b949e', fontSize: 13, margin: 0, flex: 1 }}>
                    Вы зачислены на курс информатики. Пройдите тест для получения рекомендации по карьере.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => setIsProfOrientationModalOpen(true)}>
                    Пройти тест
                  </Button>
                </div>
              </Card>
            )}

            {/* Hackathons */}
            {hasStudentAccess && (
              <Card noPadding>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #21262d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#8b949e', display: 'flex' }}><TrophyIcon /></span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Мои хакатоны</span>
                  </div>
                  <Link href="/hackathons" style={{ fontSize: 12, color: '#2f81f7', textDecoration: 'none' }}>
                    Все хакатоны →
                  </Link>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  {isLoadingHackathons ? (
                    <p style={{ color: '#8b949e', fontSize: 13 }}>Загрузка...</p>
                  ) : hackathonTeams.length === 0 ? (
                    <p style={{ color: '#8b949e', fontSize: 13 }}>
                      Вы ещё не участвуете в хакатонах.{' '}
                      <Link href="/hackathons" style={{ color: '#2f81f7' }}>Посмотреть доступные</Link>
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {hackathonTeams.map(team => (
                        <div key={team.id} style={{
                          background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 12,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', margin: 0 }}>{team.name}</p>
                              <p style={{ fontSize: 12, color: '#8b949e', margin: 0 }}>{team.hackathon?.title}</p>
                            </div>
                            <Badge
                              variant={team.status === 'approved' ? 'success' : team.status === 'pending' ? 'attention' : 'danger'}
                              size="sm"
                            >
                              {team.status === 'approved' ? 'Одобрено' : team.status === 'pending' ? 'На рассмотрении' : 'Отклонено'}
                            </Badge>
                          </div>
                          {team.projectName && (
                            <p style={{ fontSize: 12, color: '#2f81f7', margin: '6px 0 0' }}>{team.projectName}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grades */}
                  {hackathonSubmissions.some(s => s.grades && s.grades.length > 0) && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #21262d' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#8b949e', marginBottom: 8 }}>Результаты</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {hackathonSubmissions.filter(s => s.grades?.length).map(sub => {
                          const avg = sub.grades!.reduce((s, g) => s + (g.totalScore || 0), 0) / sub.grades!.length;
                          return (
                            <div key={sub.id} style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', margin: 0 }}>{sub.team?.hackathon?.title}</p>
                                <p style={{ fontSize: 12, color: '#8b949e', margin: 0 }}>{sub.team?.name}</p>
                                {sub.grades?.[0]?.feedback && (
                                  <p style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>{sub.grades[0].feedback}</p>
                                )}
                              </div>
                              <span style={{ fontSize: 20, fontWeight: 700, color: '#3fb950' }}>{avg.toFixed(1)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Admin panel */}
            {isAdmin && (
              <Card noPadding>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Панель администратора</span>
                  <Badge variant="danger" size="sm" style={{ marginLeft: 'auto' }}>Администратор</Badge>
                </div>
                <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {[
                    { href: '/admin', label: 'Дашборд' },
                    { href: '/admin/users', label: 'Пользователи' },
                    { href: '/admin/courses', label: 'Курсы' },
                    { href: '/admin/groups', label: 'Группы' },
                  ].map(l => (
                    <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
                      <Button variant="secondary" size="sm" style={{ width: '100%' }}>{l.label}</Button>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

            {/* Mentor panel */}
            {isMentor && (
              <Card noPadding>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Панель ментора</span>
                  <Badge variant="done" size="sm" style={{ marginLeft: 'auto' }}>Ментор</Badge>
                </div>
                <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[
                    { href: '/mentor', label: 'Дашборд' },
                    { href: '/mentor/groups', label: 'Группы' },
                    { href: '/mentor/schedule', label: 'Расписание' },
                    { href: '/mentor/assignments', label: 'Задания' },
                    { href: '/mentor/materials', label: 'Материалы' },
                    { href: '/mentor/hackathons', label: 'Хакатоны' },
                  ].map(l => (
                    <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
                      <Button variant="secondary" size="sm" style={{ width: '100%' }}>{l.label}</Button>
                    </Link>
                  ))}
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* Achievements */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 32px' }}>
          <AchievementsSection />
        </div>
      </div>

      <MyCoursesModal isOpen={isCoursesModalOpen} onClose={() => setIsCoursesModalOpen(false)} />
      <ProfOrientationTestModal isOpen={isProfOrientationModalOpen} onClose={() => setIsProfOrientationModalOpen(false)} />
    </div>
  );
};

// ── InfoItem helper ───────────────────────────────────────────────
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt style={{ fontSize: 12, color: '#8b949e', marginBottom: 2 }}>{label}</dt>
      <dd style={{ fontSize: 14, color: '#e6edf3', fontWeight: 500, margin: 0 }}>{value}</dd>
    </div>
  );
}
