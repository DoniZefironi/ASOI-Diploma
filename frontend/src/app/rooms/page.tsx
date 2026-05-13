'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/shared/lib/auth-context';
import { roomsApi, Room } from '@/features/rooms/api';

const TYPE_ICON  = { circuit: '⚡', iot: '🌐' } as const;
const TYPE_LABEL = { circuit: 'Логические схемы', iot: 'IoT Simulator' } as const;
const ROLE_BADGE: Record<string, string> = {
  owner:  'bg-purple-900/40 text-purple-300 border-purple-700',
  editor: 'bg-blue-900/40 text-blue-300 border-blue-700',
  viewer: 'bg-gray-700 text-gray-400 border-gray-600',
};
const ROLE_LABEL: Record<string, string> = { owner: 'Владелец', editor: 'Редактор', viewer: 'Наблюдатель' };

function NewRoomModal({ onClose, onCreated }: { onClose: () => void; onCreated: (r: Room) => void }) {
  const [form, setForm] = useState({ name: '', description: '', type: 'circuit' as 'circuit' | 'iot', isPublic: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handle = async () => {
    if (!form.name.trim()) { setError('Название обязательно'); return; }
    setSaving(true);
    try { const room = await roomsApi.createRoom(form); onCreated(room); }
    catch (e: any) { setError(e.message || 'Ошибка'); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gh-canvas-overlay border border-[#30363d] rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-gh-fg mb-5">Создать комнату</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Название *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-gh-canvas border border-[#30363d] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Описание</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full bg-gh-canvas border border-[#30363d] rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-2">Тип симулятора</label>
            <div className="flex gap-3">
              {(['circuit', 'iot'] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${form.type === t ? 'border-blue-500 bg-blue-900/30 text-blue-300' : 'border-[#30363d] bg-gh-canvas text-gray-400 hover:border-gray-500'}`}>
                  {TYPE_ICON[t]} {TYPE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gh-canvas border border-[#30363d] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{form.isPublic ? '🌍 Публичная' : '🔒 Приватная'}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {form.isPublic ? 'Видна всем пользователям, можно просматривать без инвайта' : 'Видна только участникам'}
                </div>
              </div>
              <button
                onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublic ? 'bg-blue-600' : 'bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button onClick={handle} disabled={saving}
              className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white rounded-lg py-2 text-sm font-medium transition-colors">
              {saving ? 'Создание...' : 'Создать комнату'}
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-gray-300 rounded-lg text-sm transition-colors">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, myRole }: { room: Room; myRole?: string }) {
  return (
    <div className="group bg-gh-canvas-overlay border border-[#30363d] rounded-xl p-5 hover:border-[#8b949e] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <Link href={`/rooms/${room.id}`} className="text-blue-400 hover:underline font-semibold text-base">
              {TYPE_ICON[room.type]} {room.name}
            </Link>
            {myRole && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_BADGE[myRole] || ROLE_BADGE.viewer}`}>
                {ROLE_LABEL[myRole] || myRole}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full border ${room.isPublic ? 'border-green-700 text-green-400' : 'border-gray-600 text-gray-500'}`}>
              {room.isPublic ? '🌍 Публичная' : '🔒 Приватная'}
            </span>
          </div>
          {room.description && <p className="text-[#8b949e] text-sm mb-2 line-clamp-1">{room.description}</p>}
          <div className="flex items-center gap-4 text-xs text-[#8b949e]">
            <span>{TYPE_LABEL[room.type]}</span>
            <span>· {room.members.length} участников</span>
            <span>· Обновлено {new Date(room.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
            <span>· {room.owner.firstName} {room.owner.lastName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-2">
            {room.members.slice(0, 4).map(m => (
              <div key={m.id}
                className="w-7 h-7 rounded-full bg-blue-700 border-2 border-[#161b22] flex items-center justify-center text-xs text-white font-medium"
                title={`${m.user.firstName} ${m.user.lastName}`}>
                {m.user.firstName?.[0]}{m.user.lastName?.[0]}
              </div>
            ))}
            {room.members.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-[#161b22] flex items-center justify-center text-xs text-gray-300">
                +{room.members.length - 4}
              </div>
            )}
          </div>
          <Link href={`/rooms/${room.id}/editor`}
            className="ml-2 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-sm text-white rounded-lg transition-colors">
            Открыть
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const { user } = useAuth();
  const [myRooms, setMyRooms]       = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showNew, setShowNew]       = useState(false);
  const [inviteInput, setInviteInput] = useState('');
  const [joining, setJoining]       = useState(false);
  const [joinError, setJoinError]   = useState('');
  const [tab, setTab]               = useState<'mine' | 'public'>('mine');

  const load = async () => {
    setLoading(true);
    try {
      const [mine, pub] = await Promise.all([
        roomsApi.getMyRooms(),
        roomsApi.getPublicRooms(),
      ]);
      setMyRooms(mine);
      // Public rooms not in mine
      const myIds = new Set(mine.map(r => r.id));
      setPublicRooms(pub.filter(r => !myIds.has(r.id)));
    } finally { setLoading(false); }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const myRole = (room: Room) => room.members.find(m => m.userId === user?.id)?.role;

  const handleJoin = async () => {
    const code = inviteInput.trim().split('/').pop() || '';
    if (!code) return;
    setJoining(true); setJoinError('');
    try {
      const room = await roomsApi.joinByInvite(code);
      setMyRooms(prev => prev.some(r => r.id === room.id) ? prev : [room, ...prev]);
      setInviteInput('');
    } catch (e: any) { setJoinError(e.message || 'Комната не найдена'); }
    finally { setJoining(false); }
  };

  return (
    <div className="min-h-screen bg-gh-canvas text-[#e6edf3]" style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gh-fg">Комнаты</h1>
            <p className="text-[#8b949e] text-sm mt-1">Совместная разработка схем и IoT-проектов</p>
          </div>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            ＋ Новая комната
          </button>
        </div>

        {/* Join by invite */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <input
            value={inviteInput}
            onChange={e => setInviteInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            placeholder="Вставьте инвайт-ссылку или код..."
            className="flex-1 min-w-[200px] bg-gh-canvas-overlay border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white placeholder-[#8b949e] focus:outline-none focus:border-blue-500"
          />
          <button onClick={handleJoin} disabled={joining || !inviteInput.trim()}
            className="bg-[#21262d] hover:bg-[#30363d] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm border border-[#30363d] transition-colors">
            {joining ? 'Вход...' : 'Войти по инвайту'}
          </button>
          {joinError && <p className="text-red-400 text-sm self-center">{joinError}</p>}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#30363d]">
          {[
            { key: 'mine',   label: `Мои комнаты (${myRooms.length})` },
            { key: 'public', label: `Публичные (${publicRooms.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-[#f78166] text-white' : 'border-transparent text-[#8b949e] hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gh-canvas-overlay border border-[#30363d] rounded-xl animate-pulse" />)}
          </div>
        ) : tab === 'mine' ? (
          myRooms.length === 0 ? (
            <div className="text-center py-20 text-[#8b949e]">
              <div className="text-5xl mb-4">⚡</div>
              <p className="text-lg font-medium text-white mb-2">Нет комнат</p>
              <p className="text-sm">Создайте первую комнату или войдите по инвайт-ссылке</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRooms.map(room => <RoomCard key={room.id} room={room} myRole={myRole(room)} />)}
            </div>
          )
        ) : (
          publicRooms.length === 0 ? (
            <div className="text-center py-20 text-[#8b949e]">
              <div className="text-5xl mb-4">🌍</div>
              <p className="text-lg font-medium text-white mb-2">Нет публичных комнат</p>
              <p className="text-sm">Создайте публичную комнату чтобы другие могли к ней присоединиться</p>
            </div>
          ) : (
            <div className="space-y-3">
              {publicRooms.map(room => <RoomCard key={room.id} room={room} />)}
            </div>
          )
        )}
      </div>

      {showNew && (
        <NewRoomModal
          onClose={() => setShowNew(false)}
          onCreated={r => { setMyRooms(prev => [r, ...prev]); setShowNew(false); }}
        />
      )}
    </div>
  );
}
