'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/shared/lib/auth-context';
import { roomsApi, Room, RoomMember } from '@/features/rooms/api';

const ROLE_LABEL: Record<string, string> = { owner: 'Владелец', editor: 'Редактор', viewer: 'Наблюдатель' };
const ROLE_COLOR: Record<string, string> = {
  owner:  'bg-purple-900/40 text-purple-300 border-purple-700',
  editor: 'bg-blue-900/40 text-blue-300 border-blue-700',
  viewer: 'bg-gray-700/60 text-gray-400 border-gray-600',
};
const TYPE_ICON  = { circuit: '⚡', iot: '🌐' };
const TYPE_LABEL = { circuit: 'Логические схемы', iot: 'IoT Simulator' };

const S = { bg: 'var(--color-canvas-default)', surface: 'var(--color-canvas-overlay)', border: 'var(--color-border-default)', text: 'var(--color-fg-default)', muted: 'var(--color-fg-muted)', accent: '#2f81f7' };

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [room, setRoom]     = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState('');

  const load = async () => {
    try { setRoom(await roomsApi.getRoom(Number(id))); } finally { setLoading(false); }
  };

  useEffect(() => { if (id) load(); }, [id]);

  if (loading) return <div className="min-h-screen bg-gh-canvas flex items-center justify-center"><span className="text-gray-400">Загрузка...</span></div>;
  if (!room)   return <div className="min-h-screen bg-gh-canvas flex items-center justify-center"><span className="text-red-400">Комната не найдена</span></div>;

  const myMember = room.members.find(m => m.userId === user?.id);
  const isOwner  = myMember?.role === 'owner';
  const canEdit  = myMember?.role === 'owner' || myMember?.role === 'editor';

  const inviteUrl = `${window.location.origin}/rooms/join/${room.inviteCode}`;

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = async () => {
    const { inviteCode } = await roomsApi.regenerateInvite(room.id);
    setRoom(r => r ? { ...r, inviteCode } : r);
  };

  const removeMember = async (userId: number) => {
    await roomsApi.removeMember(room.id, userId);
    setRoom(r => r ? { ...r, members: r.members.filter(m => m.userId !== userId) } : r);
  };

  const changeRole = async (userId: number, role: string) => {
    await roomsApi.updateMemberRole(room.id, userId, role);
    setRoom(r => r ? { ...r, members: r.members.map(m => m.userId === userId ? { ...m, role: role as any } : m) } : r);
  };

  const deleteRoom = async () => {
    if (!confirm('Удалить комнату? Это действие нельзя отменить.')) return;
    setDeleting(true);
    await roomsApi.deleteRoom(room.id);
    router.push('/rooms');
  };

  const saveName = async () => {
    if (newName.trim()) { const r = await roomsApi.updateRoom(room.id, { name: newName.trim() }); setRoom(r); }
    setEditName(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: S.bg, color: S.text, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 14, color: S.muted, marginBottom: 24 }}>
          <Link href="/rooms" style={{ color: S.accent, textDecoration: 'none' }}>Комнаты</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{room.name}</span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 28 }}>{TYPE_ICON[room.type]}</span>
              {editName ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={newName} onChange={e => setNewName(e.target.value)} autoFocus
                    style={{ background: S.surface, border: `1px solid ${S.accent}`, borderRadius: 6, padding: '4px 12px', color: S.text, fontSize: 22, fontWeight: 700 }} />
                  <button onClick={saveName} style={{ background: '#238636', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13 }}>Сохранить</button>
                  <button onClick={() => setEditName(false)} style={{ background: S.surface, color: S.muted, border: `1px solid ${S.border}`, borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 13 }}>Отмена</button>
                </div>
              ) : (
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
                  {room.name}
                  {isOwner && <button onClick={() => { setNewName(room.name); setEditName(true); }} style={{ marginLeft: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: S.muted }}>✏️</button>}
                </h1>
              )}
              <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 12, background: 'rgba(47,129,247,0.15)', color: S.accent, border: `1px solid rgba(47,129,247,0.3)` }}>
                {TYPE_LABEL[room.type]}
              </span>
              {room.isPublic && <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 12, border: `1px solid ${S.border}`, color: S.muted }}>Публичная</span>}
            </div>
            {room.description && <p style={{ margin: '8px 0 0', color: S.muted, fontSize: 14 }}>{room.description}</p>}
          </div>

          <Link href={`/rooms/${room.id}/editor`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#238636', color: '#fff',
              padding: '8px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            {canEdit ? '▶ Открыть редактор' : '👁 Просмотр'}
          </Link>
        </div>

        {/* Visibility toggle */}
        {isOwner && (
          <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  {room.isPublic ? '🌍 Публичная комната' : '🔒 Приватная комната'}
                </div>
                <div style={{ fontSize: 13, color: S.muted }}>
                  {room.isPublic
                    ? 'Видна всем пользователям, можно просматривать без инвайта'
                    : 'Видна только участникам с инвайт-ссылкой'}
                </div>
              </div>
              <button
                onClick={async () => {
                  const r = await roomsApi.updateRoom(room.id, { isPublic: !room.isPublic });
                  setRoom(r);
                }}
                style={{
                  position: 'relative', width: 44, height: 24, borderRadius: 12,
                  background: room.isPublic ? '#1f6feb' : '#30363d',
                  border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute', top: 2, left: 2, width: 20, height: 20,
                  background: '#fff', borderRadius: '50%', transition: 'transform 0.2s',
                  transform: room.isPublic ? 'translateX(20px)' : 'translateX(0)',
                }} />
              </button>
            </div>
          </div>
        )}

        {/* Invite link */}
        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔗 Инвайт-ссылка</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input readOnly value={inviteUrl}
              style={{ flex: 1, minWidth: 200, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, padding: '7px 12px', color: S.muted, fontSize: 13 }} />
            <button onClick={copyInvite}
              style={{ padding: '7px 16px', background: copied ? '#238636' : '#21262d', color: '#fff', border: `1px solid ${S.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, transition: 'background 0.2s' }}>
              {copied ? '✓ Скопировано' : '📋 Копировать'}
            </button>
            {isOwner && (
              <button onClick={regenerate}
                style={{ padding: '7px 12px', background: 'var(--color-border-muted)', color: S.muted, border: `1px solid ${S.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
                title="Сгенерировать новую ссылку">
                🔄 Обновить
              </button>
            )}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 12, color: S.muted }}>Любой, у кого есть эта ссылка, может войти в комнату</p>
        </div>

        {/* Members */}
        <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${S.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>👥 Участники ({room.members.length})</span>
          </div>

          {room.members.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${S.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1f6feb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                {m.user.firstName?.[0]}{m.user.lastName?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.user.firstName} {m.user.lastName}</div>
                <div style={{ fontSize: 12, color: S.muted }}>{m.user.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {isOwner && m.role !== 'owner' ? (
                  <select value={m.role} onChange={e => changeRole(m.userId, e.target.value)}
                    style={{ background: S.bg, border: `1px solid ${S.border}`, borderRadius: 6, padding: '4px 8px', color: S.text, fontSize: 12 }}>
                    <option value="editor">Редактор</option>
                    <option value="viewer">Наблюдатель</option>
                  </select>
                ) : (
                  <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 12, border: '1px solid', ...(ROLE_COLOR[m.role] ? {} : {}) }}
                    className={`${ROLE_COLOR[m.role] || ''}`}>
                    {ROLE_LABEL[m.role]}
                  </span>
                )}
                {isOwner && m.role !== 'owner' && (
                  <button onClick={() => removeMember(m.userId)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f85149', fontSize: 16, lineHeight: 1 }}
                    title="Удалить из комнаты">×</button>
                )}
                {m.userId === user?.id && m.role !== 'owner' && <span style={{ fontSize: 11, color: S.muted }}>(вы)</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        {isOwner && (
          <div style={{ marginTop: 24, background: S.surface, border: '1px solid #f85149', borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f85149', marginBottom: 12 }}>⚠️ Опасная зона</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Удалить комнату</div>
                <div style={{ fontSize: 12, color: S.muted }}>Это действие нельзя отменить. Все данные будут удалены.</div>
              </div>
              <button onClick={deleteRoom} disabled={deleting}
                style={{ background: '#b91c1c', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                {deleting ? 'Удаление...' : 'Удалить комнату'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
