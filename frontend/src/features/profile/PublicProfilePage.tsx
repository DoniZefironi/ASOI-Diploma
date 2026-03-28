// src/features/profile/PublicProfilePage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/lib/auth-context';
import { Card } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { apiClient } from '@/shared/api/client';
import { hackathonsApi, HackathonTeam } from '@/shared/api/hackathons';

interface PublicUser {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  roles?: any[];
  isActive?: boolean;
  createdAt?: string;
}

interface PublicProfilePageProps {
  userId: string;
}

// ── Icon helpers ──────────────────────────────────────────────────
const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5Z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" />
  </svg>
);

// ── Determine a display-friendly label for user type ─────────────
function getUserType(roles: any[]): { label: string; variant: 'done' | 'success' | 'accent' | 'danger' } {
  const roleNames = roles.map(r => (r?.name || r?.role || r || '').toString().toLowerCase());
  if (roleNames.some(r => r.includes('admin'))) return { label: 'Администратор', variant: 'danger' };
  if (roleNames.some(r => r.includes('mentor'))) return { label: 'Ментор', variant: 'done' };
  if (roleNames.some(r => r.includes('student'))) return { label: 'Студент', variant: 'success' };
  return { label: 'Пользователь', variant: 'accent' };
}

export const PublicProfilePage = ({ userId }: PublicProfilePageProps) => {
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<PublicUser | null>(null);
  const [teams, setTeams] = useState<HackathonTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const isOwnProfile = currentUser?.id?.toString() === userId;

  useEffect(() => {
    if (isOwnProfile) return; // own profile is handled by /profile
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.get(`/users/${userId}`);
      if (!data) { setNotFound(true); return; }
      setProfileUser(data);
    } catch {
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to own profile
  if (isOwnProfile) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ padding: 32, textAlign: 'center', maxWidth: 360 }}>
          <p style={{ color: '#e6edf3', marginBottom: 16 }}>Это ваш профиль.</p>
          <Link href="/profile">
            <Button variant="primary">Перейти к своему профилю</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#8b949e', fontSize: 14 }}>Загрузка профиля...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ padding: 32, textAlign: 'center', maxWidth: 360 }}>
        <h2 style={{ color: '#e6edf3', marginBottom: 8 }}>Пользователь не найден</h2>
        <p style={{ color: '#8b949e', fontSize: 13, marginBottom: 24 }}>
          Профиль с таким идентификатором не существует или был удалён.
        </p>
        <Link href="/">
          <Button variant="secondary" leadingIcon={<ArrowLeftIcon />}>На главную</Button>
        </Link>
      </Card>
    </div>
  );

  const displayName = profileUser
    ? [profileUser.firstName, profileUser.lastName].filter(Boolean).join(' ') || 'Пользователь'
    : 'Пользователь';

  const avatarLetter = displayName.charAt(0).toUpperCase();
  const userType = getUserType(profileUser?.roles || []);

  // Joined date
  const joinedDate = profileUser?.createdAt
    ? new Date(profileUser.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', padding: '24px 0' }}>
      <div className="gh-container">

        {/* Back button */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => window.history.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#8b949e', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#2f81f7')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8b949e')}
          >
            <ArrowLeftIcon /> Назад
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left: avatar + meta */}
          <aside>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', background: '#2f81f7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 auto 12px',
              }}>
                {avatarLetter}
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#e6edf3', margin: '0 0 4px' }}>
                {displayName}
              </h1>
              <div style={{ marginTop: 8 }}>
                <Badge variant={userType.variant} size="sm" dot>
                  {userType.label}
                </Badge>
              </div>
            </div>

            {joinedDate && (
              <div style={{ borderTop: '1px solid #21262d', paddingTop: 12, marginTop: 4 }}>
                <p style={{ fontSize: 12, color: '#8b949e', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z" />
                  </svg>
                  Присоединился {joinedDate}
                </p>
              </div>
            )}
          </aside>

          {/* Right: content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Basic info */}
            <Card noPadding>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid #21262d' }}>
                <span style={{ color: '#8b949e', display: 'flex' }}><PersonIcon /></span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Основная информация</span>
              </div>
              <div style={{ padding: 16 }}>
                <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: 0 }}>
                  <InfoItem label="Имя" value={profileUser?.firstName || '—'} />
                  <InfoItem label="Фамилия" value={profileUser?.lastName || '—'} />
                  <InfoItem label="Статус" value={
                    profileUser?.isActive !== false
                      ? <Badge variant="success" dot size="sm">Активен</Badge>
                      : <Badge variant="danger" dot size="sm">Неактивен</Badge>
                  } />
                  <InfoItem label="Тип" value={<Badge variant={userType.variant} size="sm">{userType.label}</Badge>} />
                </dl>
              </div>
            </Card>

            {/* Empty state for non-public data */}
            <div style={{
              background: '#161b22', border: '1px solid #30363d', borderRadius: 6,
              padding: '24px 16px', textAlign: 'center',
            }}>
              <p style={{ color: '#8b949e', fontSize: 13, margin: 0 }}>
                Дополнительная информация о пользователе скрыта настройками приватности.
              </p>
            </div>

          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt style={{ fontSize: 12, color: '#8b949e', marginBottom: 2 }}>{label}</dt>
      <dd style={{ fontSize: 14, color: '#e6edf3', fontWeight: 500, margin: 0 }}>{value}</dd>
    </div>
  );
}
