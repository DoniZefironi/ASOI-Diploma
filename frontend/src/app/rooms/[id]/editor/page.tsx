'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/shared/lib/auth-context';
import { roomsApi, Room } from '@/features/rooms/api';
import { useRoom } from '@/features/rooms/useRoom';
import CircuitSimulator from '@/features/circuit/CircuitSimulator';
import { SimulatorClientWrapper } from '@/features/Schematic/components/SimulatorClientWrapper';
import { useCircuitStore } from '@/features/circuit/store/circuit.store';

function OnlineBar({ users, connected }: { users: { userId: number; name: string }[]; connected: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700">
      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
      <span className="text-xs text-gray-400">{connected ? 'Подключено' : 'Отключено'}</span>
      <span className="text-gray-600 text-xs">·</span>
      <div className="flex items-center gap-1.5">
        {users.map(u => (
          <div key={u.userId} title={u.name}
            className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-xs text-white font-medium border border-gray-600">
            {u.name[0]?.toUpperCase() || '?'}
          </div>
        ))}
        {users.length > 0 && <span className="text-xs text-gray-400">{users.length} онлайн</span>}
      </div>
    </div>
  );
}

export default function RoomEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [room, setRoom]         = useState<Room | null>(null);
  const [loading, setLoading]   = useState(true);
  const [syncMsg, setSyncMsg]   = useState('');
  const pushTimer               = useRef<NodeJS.Timeout | null>(null);
  const skipNextSync            = useRef(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  // Get circuit store actions
  const importCircuit = useCircuitStore(s => s.importCircuit);
  const exportCircuit = useCircuitStore(s => s.exportCircuit);
  const nodes = useCircuitStore(s => s.nodes);
  const wires = useCircuitStore(s => s.wires);

  const handleStateSync = useCallback((state: any) => {
    if (!state || !room) return;
    if (room.type === 'circuit' && state.nodes !== undefined) {
      skipNextSync.current = true;
      importCircuit({ nodes: state.nodes, wires: state.wires });
      setSyncMsg('Получено обновление');
      setTimeout(() => setSyncMsg(''), 2000);
    }
  }, [room, importCircuit]);

  const { connected, onlineUsers, pushState } = useRoom({
    roomId: Number(id),
    token,
    onStateSync: handleStateSync,
  });

  useEffect(() => {
    if (id) roomsApi.getRoom(Number(id)).then(setRoom).finally(() => setLoading(false));
  }, [id]);

  // Auto-push circuit state changes (debounced 800ms)
  useEffect(() => {
    if (!room || room.type !== 'circuit' || !connected) return;
    if (skipNextSync.current) { skipNextSync.current = false; return; }
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      const state = exportCircuit();
      pushState(state);
    }, 800);
    return () => { if (pushTimer.current) clearTimeout(pushTimer.current); };
  }, [nodes, wires, connected, room]);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Загрузка...</div>;
  if (!room)   return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">Комната не найдена</div>;

  const myMember = room.members.find(m => m.userId === user?.id);
  const canEdit  = myMember?.role === 'owner' || myMember?.role === 'editor';

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <Link href={`/rooms/${room.id}`} className="text-gray-400 hover:text-white text-sm">← {room.name}</Link>
          <span className="text-gray-600">|</span>
          <span className="text-gray-300 text-sm">{room.type === 'circuit' ? '⚡ Логические схемы' : '🌐 IoT Simulator'}</span>
          {!canEdit && <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">Только просмотр</span>}
        </div>
        <div className="flex items-center gap-3">
          {syncMsg && <span className="text-xs text-green-400 animate-pulse">{syncMsg}</span>}
          <div className="flex items-center gap-1.5">
            {onlineUsers.map(u => (
              <div key={u.userId} title={u.name}
                className="w-7 h-7 rounded-full bg-blue-700 border border-gray-600 flex items-center justify-center text-xs text-white font-medium">
                {u.name[0]?.toUpperCase() || '?'}
              </div>
            ))}
            <span className="text-xs text-gray-500">{onlineUsers.length > 0 ? `${onlineUsers.length} онлайн` : ''}</span>
          </div>
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-yellow-400'}`} title={connected ? 'Подключено' : 'Подключение...'} />
        </div>
      </div>

      {/* Simulator */}
      <div className="flex-1 overflow-hidden">
        {room.type === 'circuit' ? (
          <CircuitSimulator
            starterCircuit={room.state}
          />
        ) : (
          <SimulatorClientWrapper />
        )}
      </div>
    </div>
  );
}
