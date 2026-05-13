'use client';

import { useState, useRef, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import { apiClient } from '@/shared/api/client';
import { Bell } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url);

interface Notification {
  id: number;
  type: 'achievement' | 'course' | 'assignment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'только что';
  if (m < 60) return `${m} мин. назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч. назад`;
  return `${Math.floor(h / 24)} дн. назад`;
}

const typeColor: Record<string, string> = {
  achievement: '#f1c40f',
  course:      '#2f81f7',
  assignment:  '#2da44e',
  system:      '#8b949e',
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useSWR<Notification[]>('/notifications', fetcher, {
    refreshInterval: 30000,
  });
  const { data: unreadData } = useSWR<{ count: number }>('/notifications/unread-count', fetcher, {
    refreshInterval: 30000,
  });

  const unread = unreadData?.count ?? 0;

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const markAllRead = async () => {
    await apiClient.patch('/notifications/read-all', {});
    mutate('/notifications');
    mutate('/notifications/unread-count');
  };

  const markOne = async (id: number) => {
    await apiClient.patch(`/notifications/${id}/read`, {});
    mutate('/notifications');
    mutate('/notifications/unread-count');
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Уведомления"
        style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--color-fg-default)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Bell icon */}
        <Bell size={16} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            minWidth: 16, height: 16, borderRadius: 8,
            background: '#f85149', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px', lineHeight: 1,
            border: '1.5px solid #0d1117',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4,
          width: 340, maxHeight: 480,
          background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)',
          borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          zIndex: 100, display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderBottom: '1px solid #21262d',
          }}>
            <span style={{ color: 'var(--color-fg-default)', fontSize: 14, fontWeight: 600 }}>Уведомления</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#2f81f7', fontSize: 12, padding: 0,
                }}
              >
                Отметить все прочитанными
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-fg-muted)', fontSize: 13 }}>
                Нет уведомлений
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markOne(n.id)}
                  style={{
                    display: 'flex', gap: 10, padding: '12px 16px',
                    borderBottom: '1px solid #21262d',
                    cursor: n.isRead ? 'default' : 'pointer',
                    background: n.isRead ? 'transparent' : 'rgba(47,129,247,0.05)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(47,129,247,0.05)')}
                >
                  {/* Color dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: typeColor[n.type] ?? '#8b949e',
                    opacity: n.isRead ? 0.4 : 1,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: n.isRead ? '#8b949e' : '#e6edf3',
                      fontSize: 13, fontWeight: n.isRead ? 400 : 600,
                      margin: 0, marginBottom: 2,
                    }}>
                      {n.title}
                    </p>
                    <p style={{ color: 'var(--color-fg-muted)', fontSize: 12, margin: 0, marginBottom: 4, lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <span style={{ color: '#484f58', fontSize: 11 }}>{timeAgo(n.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
