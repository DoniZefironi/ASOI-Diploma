'use client';

import useSWR from 'swr';
import { apiClient } from '@/shared/api/client';

const fetcher = (url: string) => apiClient.get(url);

interface UserAchievement {
  id: number;
  earnedAt: string;
  achievement: {
    id: number;
    name: string;
    description: string;
    icon: string;
    points: number;
    type: string;
  };
}

interface AllAchievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  type: string;
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface Props {
  userId?: number; // if viewing another user's profile
}

export function AchievementsSection({ userId }: Props) {
  const myUrl = userId ? `/achievements/user/${userId}` : '/achievements/my';
  const { data: earned = [] } = useSWR<UserAchievement[]>(myUrl, fetcher);
  const { data: all = [] } = useSWR<AllAchievement[]>('/achievements', fetcher);

  const earnedIds = new Set(earned.map(ua => ua.achievement.id));
  const totalPoints = earned.reduce((s, ua) => s + (ua.achievement.points ?? 0), 0);

  return (
    <div style={{
      background: '#161b22', border: '1px solid #30363d',
      borderRadius: 8, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid #21262d',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#f1c40f">
            <path d="M10.737 2.5H13A1.5 1.5 0 0 1 14.5 4v.5c0 1.32-.76 2.463-1.875 3.006a4.995 4.995 0 0 1-2.813 3.072L9.5 11.5v1h1.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5H6.5v-1l-.312-.922A4.995 4.995 0 0 1 3.375 7.506 3.5 3.5 0 0 1 1.5 4.5V4A1.5 1.5 0 0 1 3 2.5h2.263A4.498 4.498 0 0 1 8 2c.98 0 1.887.31 2.737.5Z" />
          </svg>
          <span style={{ color: '#e6edf3', fontSize: 14, fontWeight: 600 }}>Достижения</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#8b949e', fontSize: 12 }}>
            {earned.length} / {all.length}
          </span>
          <span style={{
            background: 'rgba(241,196,15,0.15)', color: '#f1c40f',
            fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 12,
            border: '1px solid rgba(241,196,15,0.3)',
          }}>
            {totalPoints} очков
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: 16 }}>
        {all.length === 0 ? (
          <p style={{ color: '#8b949e', fontSize: 13, textAlign: 'center', margin: 0 }}>
            Загрузка...
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10,
          }}>
            {all.map(a => {
              const ua = earned.find(e => e.achievement.id === a.id);
              const isEarned = earnedIds.has(a.id);
              return (
                <div
                  key={a.id}
                  title={isEarned ? `Получено: ${timeAgo(ua!.earnedAt)}` : 'Не получено'}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 6, padding: '14px 10px',
                    background: isEarned ? 'rgba(241,196,15,0.08)' : '#0d1117',
                    border: `1px solid ${isEarned ? 'rgba(241,196,15,0.3)' : '#21262d'}`,
                    borderRadius: 8,
                    opacity: isEarned ? 1 : 0.45,
                    transition: 'border-color 0.15s, opacity 0.15s',
                    cursor: 'default',
                  }}
                >
                  <span style={{ fontSize: 28, filter: isEarned ? 'none' : 'grayscale(1)' }}>
                    {a.icon}
                  </span>
                  <span style={{
                    color: isEarned ? '#e6edf3' : '#8b949e',
                    fontSize: 12, fontWeight: 600,
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {a.name}
                  </span>
                  <span style={{ color: '#8b949e', fontSize: 11, textAlign: 'center', lineHeight: 1.3 }}>
                    {a.description}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: isEarned ? '#f1c40f' : '#484f58',
                  }}>
                    +{a.points} очков
                  </span>
                  {isEarned && (
                    <span style={{
                      fontSize: 10, color: '#2da44e',
                      background: 'rgba(45,164,78,0.1)',
                      padding: '1px 6px', borderRadius: 10,
                      border: '1px solid rgba(45,164,78,0.3)',
                    }}>
                      ✓ Получено
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
