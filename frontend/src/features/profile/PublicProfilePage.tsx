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
import { User, Trophy, ArrowLeft, Calendar } from 'lucide-react';

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
const PersonIcon = () => <User size={16} />;
const TrophyIcon = () => <Trophy size={16} />;
const ArrowLeftIcon = () => <ArrowLeft size={14} />;

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
      <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ padding: 32, textAlign: 'center', maxWidth: 360 }}>
          <p style={{ color: 'var(--color-fg-default)', marginBottom: 16 }}>Это ваш профиль.</p>
          <Link href="/profile">
            <Button variant="primary">Перейти к своему профилю</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'var(--color-fg-muted)', fontSize: 14 }}>Загрузка профиля...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ padding: 32, textAlign: 'center', maxWidth: 360 }}>
        <h2 style={{ color: 'var(--color-fg-default)', marginBottom: 8 }}>Пользователь не найден</h2>
        <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, marginBottom: 24 }}>
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
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '24px 0' }}>
      <div className="gh-container">

        {/* Back button */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => window.history.back()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-fg-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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
              <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 4px' }}>
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
                <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={14} />
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
                <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}><PersonIcon /></span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Основная информация</span>
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
              background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6,
              padding: '24px 16px', textAlign: 'center',
            }}>
              <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>
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
      <dt style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginBottom: 2 }}>{label}</dt>
      <dd style={{ fontSize: 14, color: 'var(--color-fg-default)', fontWeight: 500, margin: 0 }}>{value}</dd>
    </div>
  );
}
