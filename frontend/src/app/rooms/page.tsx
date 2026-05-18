'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/shared/lib/auth-context';
import { roomsApi, Room } from '@/features/rooms/api';
import { Modal, ModalField, ModalCancelBtn, ModalSubmitBtn, modalInputStyle } from '@/shared/ui/modal';
import { Zap, Globe, Plus, Users, ArrowRight, LogIn, Lock } from 'lucide-react';

const TYPE_ICON  = { circuit: <Zap size={14} />,   iot: <Globe size={14} /> } as const;
const TYPE_LABEL = { circuit: 'Логические схемы',   iot: 'IoT Simulator'     } as const;

const ROLE_CFG: Record<string, { label: string; color: string; bg: string }> = {
  owner:  { label: 'Владелец',    color: 'var(--color-done-fg)',    bg: 'var(--color-done-subtle)' },
  editor: { label: 'Редактор',   color: 'var(--color-accent-fg)',  bg: 'var(--color-accent-subtle)' },
  viewer: { label: 'Наблюдатель', color: 'var(--color-fg-muted)',   bg: 'var(--color-canvas-inset)' },
};

// ── New room modal ──────────────────────────────────────────────────
function NewRoomModal({ onClose, onCreated }: { onClose: () => void; onCreated: (r: Room) => void }) {
  const [form, setForm]   = useState({ name: '', description: '', type: 'circuit' as 'circuit' | 'iot', isPublic: false });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Название обязательно'); return; }
    setSaving(true);
    try { const room = await roomsApi.createRoom(form); onCreated(room); }
    catch (e: any) { setError(e.message || 'Ошибка создания'); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Создать комнату" onClose={onClose}
      footer={<><ModalCancelBtn onClose={onClose} /><ModalSubmitBtn loading={saving} label="Создать" loadingLabel="Создание..." /></>}
    >
      <form onSubmit={handleSubmit}>
        <ModalField label="Название" required>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={modalInputStyle} placeholder="Название комнаты" autoFocus />
        </ModalField>

        <ModalField label="Описание">
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ ...modalInputStyle, resize: 'vertical' }} rows={2} placeholder="Необязательно" />
        </ModalField>

        <ModalField label="Тип симулятора">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(['circuit', 'iot'] as const).map(t => (
              <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8,
                  border: `2px solid ${form.type === t ? 'var(--color-accent-fg)' : 'var(--color-border-default)'}`,
                  background: form.type === t ? 'var(--color-accent-subtle)' : 'var(--color-canvas-default)',
                  color: form.type === t ? 'var(--color-accent-fg)' : 'var(--color-fg-muted)',
                  cursor: 'pointer', fontSize: 13, fontWeight: form.type === t ? 600 : 400, transition: 'all 120ms',
                }}>
                {TYPE_ICON[t]} {TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </ModalField>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-canvas-default)', border: '1px solid var(--color-border-default)', borderRadius: 8, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', display: 'flex', alignItems: 'center', gap: 6 }}>
              {form.isPublic ? <Globe size={13} /> : <Lock size={13} />}
              {form.isPublic ? 'Публичная' : 'Приватная'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-fg-muted)', marginTop: 2 }}>
              {form.isPublic ? 'Видна всем, можно просматривать без инвайта' : 'Только для участников с инвайтом'}
            </div>
          </div>
          <button type="button" onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}
            style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, background: form.isPublic ? 'var(--color-accent-emphasis)' : 'var(--color-neutral-3)', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background 150ms' }}>
            <span style={{ position: 'absolute', top: 2, left: form.isPublic ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 150ms', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
          </button>
        </div>

        {error && <p style={{ color: 'var(--color-danger-fg)', fontSize: 13, marginBottom: 8 }}>{error}</p>}
      </form>
    </Modal>
  );
}

// ── Room card ───────────────────────────────────────────────────────
function RoomCard({ room, myRole }: { room: Room; myRole?: string }) {
  const role = myRole ? (ROLE_CFG[myRole] ?? ROLE_CFG.viewer) : null;

  return (
    <div style={{
      background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)',
      borderRadius: 12, padding: '16px 20px', transition: 'border-color 150ms, transform 150ms',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent-fg)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-default)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <Link href={`/rooms/${room.id}`}
              style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-accent-fg)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              {TYPE_ICON[room.type]} {room.name}
            </Link>
            {role && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 20, color: role.color, background: role.bg }}>
                {role.label}
              </span>
            )}
            <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, color: room.isPublic ? 'var(--color-success-fg)' : 'var(--color-fg-subtle)', background: room.isPublic ? 'var(--color-success-subtle)' : 'var(--color-canvas-inset)' }}>
              {room.isPublic ? 'Публичная' : 'Приватная'}
            </span>
          </div>

          {/* Description */}
          {room.description && (
            <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--color-fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {room.description}
            </p>
          )}

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--color-fg-subtle)', flexWrap: 'wrap' }}>
            <span>{TYPE_LABEL[room.type]}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} /> {room.members.length}</span>
            <span>Обновлено {new Date(room.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
            <span>{room.owner.firstName} {room.owner.lastName}</span>
          </div>
        </div>

        {/* Right: avatars + open button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Member avatars */}
          <div style={{ display: 'flex' }}>
            {room.members.slice(0, 4).map(m => (
              <div key={m.id} title={`${m.user.firstName} ${m.user.lastName}`}
                style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-accent-emphasis)', border: '2px solid var(--color-canvas-overlay)', marginLeft: -6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', firstChild: { marginLeft: 0 } as any }}>
                {m.user.firstName?.[0]}{m.user.lastName?.[0]}
              </div>
            ))}
            {room.members.length > 4 && (
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-neutral-3)', border: '2px solid var(--color-canvas-overlay)', marginLeft: -6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--color-fg-muted)' }}>
                +{room.members.length - 4}
              </div>
            )}
          </div>

          <Link href={`/rooms/${room.id}/editor`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', background: 'var(--color-canvas-inset)', border: '1px solid var(--color-border-default)', borderRadius: 8, textDecoration: 'none', transition: 'all 120ms' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-neutral-2)'; e.currentTarget.style.borderColor = 'var(--color-fg-muted)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-canvas-inset)'; e.currentTarget.style.borderColor = 'var(--color-border-default)'; }}
          >
            Открыть <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────
export default function RoomsPage() {
  const { user } = useAuth();
  const [myRooms,     setMyRooms]     = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [showNew,     setShowNew]     = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [joining,     setJoining]     = useState(false);
  const [joinError,   setJoinError]   = useState('');
  const [tab,         setTab]         = useState<'mine' | 'public'>('mine');

  const load = async () => {
    setLoading(true);
    try {
      const [mine, pub] = await Promise.all([roomsApi.getMyRooms(), roomsApi.getPublicRooms()]);
      setMyRooms(mine);
      const myIds = new Set(mine.map(r => r.id));
      setPublicRooms(pub.filter(r => !myIds.has(r.id)));
    } finally { setLoading(false); }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const myRole = (room: Room) => room.members.find(m => m.userId === user?.id)?.role;

  const handleJoin = async () => {
    const code = inviteInput.trim().split('/').pop() || '';
    if (!code) { setJoinError('Введите инвайт-код или ссылку'); return; }
    setJoining(true); setJoinError('');
    try {
      const room = await roomsApi.joinByInvite(code);
      setMyRooms(prev => prev.some(r => r.id === room.id) ? prev : [room, ...prev]);
      setInviteInput('');
      setTab('mine');
    } catch (e: any) { setJoinError(e.message || 'Комната не найдена или ссылка недействительна'); }
    finally { setJoining(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas-default)', padding: '28px 0 64px' }}>
      <div className="gh-container" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Zap size={22} color="var(--color-attention-fg)" />
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: 'var(--color-fg-default)' }}>Комнаты</h1>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--color-fg-muted)' }}>
              Совместная разработка схем и IoT-проектов в реальном времени
            </p>
            <div style={{ height: 3, width: 48, borderRadius: 2, background: 'var(--color-attention-fg)', marginTop: 14 }} />
          </div>
          <button onClick={() => setShowNew(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 18px', fontSize: 14, fontWeight: 600, background: 'var(--color-success-emphasis)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background 120ms' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-success-fg)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-success-emphasis)')}
          >
            <Plus size={15} /> Новая комната
          </button>
        </div>

        {/* Join by invite */}
        <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
          <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: 'var(--color-fg-default)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <LogIn size={14} color="var(--color-accent-fg)" /> Войти по инвайту
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={inviteInput}
              onChange={e => { setInviteInput(e.target.value); setJoinError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="Вставьте инвайт-ссылку или код..."
              style={{ flex: 1, padding: '8px 12px', fontSize: 13, color: 'var(--color-fg-default)', background: 'var(--color-canvas-default)', border: `1px solid ${joinError ? 'var(--color-danger-fg)' : 'var(--color-border-default)'}`, borderRadius: 8, outline: 'none' }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent-fg)')}
              onBlur={e => (e.currentTarget.style.borderColor = joinError ? 'var(--color-danger-fg)' : 'var(--color-border-default)')}
            />
            <button
              onClick={handleJoin}
              disabled={joining || !inviteInput.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600, background: joining || !inviteInput.trim() ? 'var(--color-canvas-inset)' : 'var(--color-accent-emphasis)', color: joining || !inviteInput.trim() ? 'var(--color-fg-subtle)' : '#fff', border: `1px solid ${joining || !inviteInput.trim() ? 'var(--color-border-default)' : 'transparent'}`, borderRadius: 8, cursor: joining || !inviteInput.trim() ? 'not-allowed' : 'pointer', transition: 'all 120ms', whiteSpace: 'nowrap' }}
              onMouseEnter={e => !joining && inviteInput.trim() && (e.currentTarget.style.background = 'var(--color-accent-fg)')}
              onMouseLeave={e => !joining && inviteInput.trim() && (e.currentTarget.style.background = 'var(--color-accent-emphasis)')}
            >
              <LogIn size={14} /> {joining ? 'Вход...' : 'Войти'}
            </button>
          </div>
          {joinError && <p style={{ margin: '7px 0 0', fontSize: 12, color: 'var(--color-danger-fg)' }}>{joinError}</p>}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--color-border-muted)', marginBottom: 20 }}>
          {[
            { key: 'mine',   label: 'Мои комнаты',  count: myRooms.length },
            { key: 'public', label: 'Публичные',     count: publicRooms.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '8px 16px', fontSize: 13, fontWeight: tab === t.key ? 600 : 400, background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.key ? 'var(--color-attention-fg)' : 'transparent'}`, color: tab === t.key ? 'var(--color-fg-default)' : 'var(--color-fg-muted)', cursor: 'pointer', marginBottom: -1, transition: 'color 120ms' }}>
              {t.label}
              <span style={{ marginLeft: 6, fontSize: 11, background: 'var(--color-canvas-inset)', padding: '1px 7px', borderRadius: 20, color: 'var(--color-fg-subtle)' }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 90, background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 12, animation: 'pulse 1.5s infinite' }} />)}
            <style>{`@keyframes pulse{0%,100%{opacity:.7}50%{opacity:.4}}`}</style>
          </div>
        ) : tab === 'mine' ? (
          myRooms.length === 0 ? (
            <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 12, padding: '56px 24px', textAlign: 'center' }}>
              <Zap size={32} color="var(--color-fg-subtle)" style={{ margin: '0 auto 14px' }} />
              <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 6px', fontSize: 16 }}>Нет комнат</p>
              <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: '0 0 16px' }}>Создайте первую комнату или войдите по инвайт-ссылке выше</p>
              <button onClick={() => setShowNew(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600, background: 'var(--color-success-emphasis)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                <Plus size={14} /> Создать комнату
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myRooms.map(r => <RoomCard key={r.id} room={r} myRole={myRole(r)} />)}
            </div>
          )
        ) : (
          publicRooms.length === 0 ? (
            <div style={{ background: 'var(--color-canvas-overlay)', border: '1px dashed var(--color-border-default)', borderRadius: 12, padding: '56px 24px', textAlign: 'center' }}>
              <Globe size={32} color="var(--color-fg-subtle)" style={{ margin: '0 auto 14px' }} />
              <p style={{ color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 6px', fontSize: 16 }}>Нет публичных комнат</p>
              <p style={{ color: 'var(--color-fg-muted)', fontSize: 13, margin: 0 }}>Создайте публичную комнату, чтобы другие могли присоединиться</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {publicRooms.map(r => <RoomCard key={r.id} room={r} />)}
            </div>
          )
        )}
      </div>

      {showNew && (
        <NewRoomModal onClose={() => setShowNew(false)} onCreated={r => { setMyRooms(prev => [r, ...prev]); setShowNew(false); }} />
      )}
    </div>
  );
}
