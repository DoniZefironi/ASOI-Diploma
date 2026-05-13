'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/shared/lib/auth-context';
import { roomsApi, Room } from '@/features/rooms/api';

export default function JoinRoomPage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const router   = useRouter();
  const [room, setRoom]     = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (!code) return;
    roomsApi.getByInvite(code)
      .then(setRoom)
      .catch(() => setError('Комната не найдена или ссылка недействительна'))
      .finally(() => setLoading(false));
  }, [code]);

  const join = async () => {
    if (!user) { router.push(`/auth?redirect=/rooms/join/${code}`); return; }
    setJoining(true);
    try {
      const r = await roomsApi.joinByInvite(code);
      router.push(`/rooms/${r.id}`);
    } catch (e: any) {
      setError(e.message || 'Ошибка');
      setJoining(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gh-canvas flex items-center justify-center">
      <p className="text-gray-400">Загрузка...</p>
    </div>
  );

  const TYPE_ICON  = { circuit: '⚡', iot: '🌐' };
  const TYPE_LABEL = { circuit: 'Логические схемы', iot: 'IoT Simulator' };

  return (
    <div className="min-h-screen bg-gh-canvas flex items-center justify-center p-4">
      <div className="bg-gh-canvas-overlay border border-[#30363d] rounded-2xl p-8 w-full max-w-md text-center">
        {error ? (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-gh-fg mb-2">Ссылка недействительна</h2>
            <p className="text-gray-400 text-sm">{error}</p>
          </>
        ) : room ? (
          <>
            <div className="text-5xl mb-4">{TYPE_ICON[room.type]}</div>
            <h2 className="text-xl font-bold text-gh-fg mb-1">Присоединиться к комнате</h2>
            <p className="text-blue-400 font-semibold text-lg mb-1">{room.name}</p>
            <p className="text-gray-400 text-sm mb-1">{TYPE_LABEL[room.type]}</p>
            {room.description && <p className="text-gray-500 text-sm mb-4">{room.description}</p>}
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-400">
              <span>{room.members.length} участников</span>
              <span>·</span>
              <span>Владелец: {room.owner.firstName} {room.owner.lastName}</span>
            </div>
            {!user && <p className="text-yellow-400 text-sm mb-4">⚠️ Для входа необходима авторизация</p>}
            <button
              onClick={join}
              disabled={joining}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white rounded-xl py-3 font-semibold text-base transition-colors"
            >
              {joining ? 'Вход...' : user ? 'Войти в комнату' : 'Войти и присоединиться'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
