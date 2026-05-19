'use client';

import type { ReactNode, KeyboardEvent } from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
  /** Footer buttons rendered below content */
  footer?: ReactNode;
}

/**
 * Unified modal dialog.
 * - Solid opaque background (never transparent)
 * - Consistent across light/dark themes
 * - Closes on Escape and backdrop click
 */
export function Modal({ title, onClose, children, maxWidth = 480, footer }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--color-canvas-overlay)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 12,
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--color-border-muted)',
          flexShrink: 0,
        }}>
          <h2 id="modal-title" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--color-fg-default)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 6,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--color-fg-muted)', transition: 'all 100ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-neutral-2)'; e.currentTarget.style.color = 'var(--color-fg-default)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-fg-muted)'; }}
            aria-label="Закрыть"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--color-border-muted)',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Reusable field wrapper inside Modal */
export function ModalField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--color-danger-fg)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/** Standard input style for use inside Modal */
export const modalInputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 12px', fontSize: 13,
  color: 'var(--color-fg-default)',
  background: 'var(--color-canvas-default)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 8, outline: 'none', boxSizing: 'border-box',
};

/** Standard cancel button */
export function ModalCancelBtn({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" onClick={onClose}
      style={{ padding: '7px 18px', fontSize: 13, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 8, cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-neutral-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      Отмена
    </button>
  );
}

/** Standard submit button */
export function ModalSubmitBtn({ loading, label, loadingLabel, disabled, form }: { loading: boolean; label: string; loadingLabel?: string; disabled?: boolean; form?: string }) {
  return (
    <button type="submit" form={form} disabled={loading || disabled}
      style={{ padding: '7px 20px', fontSize: 13, fontWeight: 600, color: '#fff', background: loading || disabled ? 'var(--color-accent-muted)' : 'var(--color-accent-emphasis)', border: 'none', borderRadius: 8, cursor: loading || disabled ? 'not-allowed' : 'pointer', transition: 'background 120ms' }}
      onMouseEnter={e => !loading && !disabled && (e.currentTarget.style.background = 'var(--color-accent-fg)')}
      onMouseLeave={e => !loading && !disabled && (e.currentTarget.style.background = 'var(--color-accent-emphasis)')}
    >
      {loading ? (loadingLabel ?? 'Загрузка...') : label}
    </button>
  );
}
