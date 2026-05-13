// src/features/profile/ProfilePage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth, hasStudentRole, hasMentorRole, hasAdminRole } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import Link from 'next/link';
import { MyCoursesModal } from './components/MyCoursesModal';
import { useUserCourseRegistrations } from '@/shared/api/admin/registrations';
import { useProfessionalOrientation } from '@/shared/api/admin/professional-orientation';
import { ProfOrientationTestModal } from './components/ProfOrientationTestModal';
import { hackathonsApi, HackathonTeam, HackathonSubmission } from '@/shared/api/hackathons';
import { apiClient } from '@/shared/api/client';
import { AchievementsSection } from './AchievementsSection';
import { User, BookOpen, Trophy, Compass, Pencil, Check, X, GitPullRequest, Play, GraduationCap } from 'lucide-react';

// ── Icons ─────────────────────────────────────────────────────────
const PersonIcon = () => <User size={16} />;
const BookIcon = () => <BookOpen size={16} />;
const TrophyIcon = () => <Trophy size={16} />;
const CompassIcon = () => <Compass size={16} />;
const PencilIcon = () => <Pencil size={14} />;
const CheckIcon = () => <Check size={14} />;
const XIcon = () => <X size={14} />;

// ── GhInput helper ────────────────────────────────────────────────
function GhInput({ error = false, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{
        display: 'block', width: '100%',
        background: 'var(--color-canvas-default)',
        border: `1px solid ${error ? '#f85149' : focused ? '#2f81f7' : '#30363d'}`,
        borderRadius: 6, padding: '5px 12px', fontSize: 14,
        color: 'var(--color-fg-default)', lineHeight: 1.5, outline: 'none',
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
    color: 'var(--color-fg-default)', textDecoration: 'none', background: 'transparent',
    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
    transition: 'background 80ms',
  };
  const hoverIn = (e: React.MouseEvent<any>) => (e.currentTarget.style.background = 'var(--color-neutral-2)');
  const hoverOut = (e: React.MouseEvent<any>) => (e.currentTarget.style.background = 'transparent');

  if (href) return (
    <Link href={href} style={style} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
      <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}>{icon}</span>
      {children}
    </Link>
  );

  return (
    <button style={style} onClick={onClick} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
      <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}>{icon}</span>
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────
export const ProfilePage = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [isProfOrientationModalOpen, setIsProfOrientationModalOpen] = useState(false);
  const [hackathonTeams, setHackathonTeams] = useState<HackathonTeam[]>([]);
  const [hackathonSubmissions, setHackathonSubmissions] = useState<HackathonSubmission[]>([]);
  const [isLoadingHackathons, setIsLoadingHackathons] = useState(false);

  const { data: profOrientationResult } = useProfessionalOrientation();
  const {
    registrations,
    isLoading: registrationsLoading,
  } = useUserCourseRegistrations();

  // Любая одобренная регистрация на любой курс
  const approvedRegistration = registrations?.find(r => r.status?.toLowerCase() === 'approved');
  const pendingRegistration  = registrations?.find(r => r.status?.toLowerCase() === 'pending');
  const anyRegistration = approvedRegistration || pendingRegistration || registrations?.[0];

  const hasInformaticsAccess = !!approvedRegistration;

  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '' });
  const [avatarUploading, setAvatarUploading] = useState(false);

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
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', padding: 32 }}>
        <h2 style={{ color: 'var(--color-fg-default)', marginBottom: 8 }}>Доступ запрещён</h2>
        <p style={{ color: 'var(--color-fg-muted)', marginBottom: 24, fontSize: 14 }}>Войдите, чтобы просмотреть профиль.</p>
        <Button variant="primary" onClick={() => (window.location.href = '/auth')}>Войти</Button>
      </Card>
    </div>
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await apiClient.patch('/users/profile', {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
      });
      const token = localStorage.getItem('access_token');
      if (token) login(token, { ...user, ...updated });
      setIsEditing(false);
    } catch {
      alert('Ошибка при обновлении профиля');
    } finally { setIsSaving(false); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Файл слишком большой (макс. 2 МБ)'); return; }
    setAvatarUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const updated = await apiClient.patch('/users/profile', { avatar: base64 });
      const token = localStorage.getItem('access_token');
      if (token) login(token, { ...user, ...updated });
    } catch { alert('Ошибка загрузки аватара'); }
    finally { setAvatarUploading(false); }
  };

  const statusBadge = anyRegistration?.status;

  const getShortCourseName = (name?: string): string => {
    if (!name) return 'Курс';
    const n = name.toLowerCase();
    if (n.includes('english') || n.includes('английск')) return 'Английский';
    if (n.includes('electronics') || n.includes('электрон')) return 'Электроника';
    if (n.includes('iot')) return 'IoT';
    if (n.includes('computer') || n.includes('информатик') || n.includes('cs')) return 'Информатика';
    return name;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '24px 0' }}>
      <div className="gh-container">

        {/* ── Page header ───────────────────────────────────── */}
        <div style={{ marginBottom: 0, paddingBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Профиль</h1>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-muted)', margin: '16px 0 24px', gap: 0 }}>
          {(['profile', 'achievements'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px', fontSize: 14, fontWeight: 500,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: activeTab === tab ? 'var(--color-fg-default)' : 'var(--color-fg-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--color-accent-fg)' : '2px solid transparent',
                marginBottom: -1, transition: 'color 80ms',
              }}
            >
              {tab === 'profile' ? 'Профиль' : `Достижения`}
            </button>
          ))}
        </div>

        {activeTab === 'achievements' && (
          <AchievementsSection />
        )}

        {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>

          {/* ── Left sidebar ──────────────────────────────────── */}
          <aside>
            {/* Avatar & name */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Аватар"
                    style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border-default)' }}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'var(--color-accent-emphasis)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, fontWeight: 700, color: '#fff',
                  }}>
                    {getDisplayName().charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Кнопка смены аватара */}
                <label
                  title="Изменить аватар"
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: avatarUploading ? 'wait' : 'pointer', fontSize: 13,
                  }}
                >
                  {avatarUploading ? '⏳' : '📷'}
                  <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                </label>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 2px' }}>
                {getDisplayName()}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: 0 }}>{user.email}</p>

              {/* Course registration status */}
              {!registrationsLoading && (
                <div style={{ marginTop: 12 }}>
                  {anyRegistration ? (
                    <Badge
                      variant={statusBadge?.toLowerCase() === 'approved' ? 'success' : statusBadge?.toLowerCase() === 'pending' ? 'attention' : 'danger'}
                      dot
                    >
                      {getShortCourseName(anyRegistration.courseGroup?.course?.name)}:{' '}
                      {statusBadge?.toLowerCase() === 'approved' ? 'зачислен' : statusBadge?.toLowerCase() === 'pending' ? 'ожидает' : 'отклонено'}
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm">Не зачислен на курс</Badge>
                  )}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #21262d', paddingTop: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
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
                  <SidebarLink href="/peer-review" icon={<GitPullRequest size={16} />}>
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
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                  {isAdmin ? 'Администрирование' : 'Наставничество'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {isAdmin && <SidebarLink href="/admin" icon={<Play size={16} />}>Панель администратора</SidebarLink>}
                  {(isMentor || isAdmin) && <SidebarLink href="/mentor" icon={<GraduationCap size={16} />}>Панель ментора</SidebarLink>}
                </div>
              </div>
            )}
          </aside>

          {/* ── Main content ──────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Profile info card */}
            <Card noPadding>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #21262d' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Информация профиля</span>
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
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 6 }}>Имя</label>
                      <GhInput
                        value={editForm.firstName}
                        onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))}
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 6 }}>Фамилия</label>
                      <GhInput
                        value={editForm.lastName}
                        onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))}
                        disabled={isSaving}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 6 }}>Email</label>
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
                  <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}><CompassIcon /></span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Результат профориентации</span>
                  <Badge variant="success" size="sm" style={{ marginLeft: 'auto' }}>Завершён</Badge>
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: '0 0 4px' }}>Рекомендуемая профессия</p>
                  <p style={{ color: 'var(--color-fg-default)', fontSize: 16, fontWeight: 600, margin: 0 }}>
                    {profOrientationResult.recommendedProfession}
                  </p>
                </div>
              </Card>
            )}

            {/* Prof orientation CTA */}
            {hasStudentAccess && hasInformaticsAccess && !profOrientationResult && (
              <Card noPadding>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}><CompassIcon /></span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Профориентация доступна</span>
                  <Badge variant="accent" size="sm" style={{ marginLeft: 'auto' }}>Новое</Badge>
                </div>
                <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0, flex: 1 }}>
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
                    <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}><TrophyIcon /></span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Мои хакатоны</span>
                  </div>
                  <Link href="/hackathons" style={{ fontSize: 12, color: '#2f81f7', textDecoration: 'none' }}>
                    Все хакатоны →
                  </Link>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  {isLoadingHackathons ? (
                    <p style={{ color: 'var(--color-fg-muted)', fontSize: 13 }}>Загрузка...</p>
                  ) : hackathonTeams.length === 0 ? (
                    <p style={{ color: 'var(--color-fg-muted)', fontSize: 13 }}>
                      Вы ещё не участвуете в хакатонах.{' '}
                      <Link href="/hackathons" style={{ color: '#2f81f7' }}>Посмотреть доступные</Link>
                    </p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {hackathonTeams.map(team => (
                        <div key={team.id} style={{
                          background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: 12,
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>{team.name}</p>
                              <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: 0 }}>{team.hackathon?.title}</p>
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
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)', marginBottom: 8 }}>Результаты</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {hackathonSubmissions.filter(s => s.grades?.length).map(sub => {
                          const avg = sub.grades!.reduce((s, g) => s + (g.totalScore || 0), 0) / sub.grades!.length;
                          return (
                            <div key={sub.id} style={{ background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>{sub.team?.hackathon?.title}</p>
                                <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: 0 }}>{sub.team?.name}</p>
                                {sub.grades?.[0]?.feedback && (
                                  <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginTop: 4 }}>{sub.grades[0].feedback}</p>
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
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Панель администратора</span>
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
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Панель ментора</span>
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
        )}
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
      <dt style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginBottom: 2 }}>{label}</dt>
      <dd style={{ fontSize: 14, color: 'var(--color-fg-default)', fontWeight: 500, margin: 0 }}>{value}</dd>
    </div>
  );
}
