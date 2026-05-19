import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect,
  ConnectedSocket, MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

interface UserSocket extends Socket {
  userId?: number;
  userName?: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/rooms',
})
export class RoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // roomId -> Map<socketId, { userId, name }>
  private roomUsers = new Map<string, Map<string, { userId: number; name: string }>>();

  constructor(
    private readonly roomsService: RoomsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  afterInit() {}

  async handleConnection(client: UserSocket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) { client.disconnect(); return; }
      const payload = this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') || 'secretKey' });
      client.userId = payload.sub;
      client.userName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || payload.email;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: UserSocket) {
    this.roomUsers.forEach((users, roomId) => {
      if (users.has(client.id)) {
        users.delete(client.id);
        this.server.to(roomId).emit('users-update', this.getRoomUserList(roomId));
      }
    });
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(@ConnectedSocket() client: UserSocket, @MessageBody() data: { roomId: number }) {
    const roomId = String(data.roomId);
    try {
      const room = await this.roomsService.findOne(data.roomId, client.userId);
      client.join(roomId);

      if (!this.roomUsers.has(roomId)) this.roomUsers.set(roomId, new Map());
      this.roomUsers.get(roomId)!.set(client.id, { userId: client.userId!, name: client.userName! });

      // Send current state to joining user
      client.emit('state-sync', { state: room.state, roomId: data.roomId });
      // Notify everyone of new user
      this.server.to(roomId).emit('users-update', this.getRoomUserList(roomId));
      this.server.to(roomId).emit('user-joined', { userId: client.userId, name: client.userName });
    } catch {
      client.emit('error', { message: 'Нет доступа к комнате' });
    }
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: UserSocket, @MessageBody() data: { roomId: number }) {
    const roomId = String(data.roomId);
    client.leave(roomId);
    this.roomUsers.get(roomId)?.delete(client.id);
    this.server.to(roomId).emit('users-update', this.getRoomUserList(roomId));
  }

  @SubscribeMessage('state-update')
  async handleStateUpdate(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { roomId: number; state: any },
  ) {
    const roomId = String(data.roomId);
    try {
      await this.roomsService.saveState(data.roomId, data.state, client.userId!);
      // Broadcast to everyone EXCEPT sender
      client.to(roomId).emit('state-sync', { state: data.state, roomId: data.roomId, fromUserId: client.userId });
    } catch (e: any) {
      client.emit('error', { message: e.message });
    }
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { roomId: number; x: number; y: number },
  ) {
    client.to(String(data.roomId)).emit('cursor-update', {
      userId: client.userId, name: client.userName, x: data.x, y: data.y,
    });
  }

  private getRoomUserList(roomId: string) {
    return Array.from(this.roomUsers.get(roomId)?.values() || []);
  }
}
