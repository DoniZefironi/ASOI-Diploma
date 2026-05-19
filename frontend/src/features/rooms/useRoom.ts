'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface RoomUser {
  userId: number;
  name: string;
}

export interface RoomCursor {
  userId: number;
  name: string;
  x: number;
  y: number;
}

interface UseRoomOptions {
  roomId: number;
  token: string | null;
  onStateSync?: (state: any) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904';

export function useRoom({ roomId, token, onStateSync }: UseRoomOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected]   = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<RoomUser[]>([]);
  const [cursors, setCursors]       = useState<Record<number, RoomCursor>>({});

  useEffect(() => {
    if (!token || !roomId) return;

    const socket = io(`${API_URL}/rooms`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', { roomId });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('state-sync', ({ state }: { state: any }) => {
      onStateSync?.(state);
    });

    socket.on('users-update', (users: RoomUser[]) => {
      setOnlineUsers(users);
    });

    socket.on('cursor-update', (data: RoomCursor) => {
      setCursors(prev => ({ ...prev, [data.userId]: data }));
    });

    return () => {
      socket.emit('leave-room', { roomId });
      socket.disconnect();
      setConnected(false);
    };
  }, [roomId, token]);

  const pushState = useCallback((state: any) => {
    socketRef.current?.emit('state-update', { roomId, state });
  }, [roomId]);

  const moveCursor = useCallback((x: number, y: number) => {
    socketRef.current?.emit('cursor-move', { roomId, x, y });
  }, [roomId]);

  return { connected, onlineUsers, cursors, pushState, moveCursor };
}
