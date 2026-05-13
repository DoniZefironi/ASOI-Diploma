'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface GhSidebarProps {
  title: string;
  subtitle?: string;
  items: SidebarItem[];
  onLogout?: () => void;
  avatarLetter?: string;
}

export function GhSidebar({ title, subtitle, items, onLogout, avatarLetter }: GhSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        background: 'var(--color-canvas-overlay)',
        borderRight: '1px solid #30363d',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #30363d', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {avatarLetter && (
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#2f81f7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {avatarLetter}
            </div>
          )}
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>{title}</p>
            {subtitle && (
              <p style={{ fontSize: 11, color: 'var(--color-fg-muted)', margin: 0 }}>{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px' }}>
        {items.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && item.href !== '/mentor' && pathname?.startsWith(item.href + '/'));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#e6edf3' : '#8b949e',
                background: isActive ? '#21262d' : 'transparent',
                textDecoration: 'none',
                marginBottom: 2,
                transition: 'background 80ms, color 80ms',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#21262d';
                  e.currentTarget.style.color = '#e6edf3';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#8b949e';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: isActive ? '#2f81f7' : 'inherit' }}>
                  {item.icon}
                </span>
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span style={{
                  background: 'var(--color-border-muted)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 20,
                  fontSize: 11,
                  padding: '0 6px',
                  color: 'var(--color-fg-muted)',
                  lineHeight: '18px',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / logout */}
      {onLogout && (
        <div style={{ padding: '8px', borderTop: '1px solid #30363d', flexShrink: 0 }}>
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 8px', borderRadius: 6, fontSize: 13,
              color: '#f85149', background: 'transparent',
              border: 'none', cursor: 'pointer', width: '100%',
              transition: 'background 80ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#21262d')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      )}
    </aside>
  );
}
