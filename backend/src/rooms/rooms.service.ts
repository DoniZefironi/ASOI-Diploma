import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomType } from './entities/room.entity';
import { RoomMember, MemberRole } from './entities/room-member.entity';
import { CreateRoomDto, UpdateRoomDto, UpdateMemberRoleDto } from './dto/room.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)   private roomRepo: Repository<Room>,
    @InjectRepository(RoomMember) private memberRepo: Repository<RoomMember>,
  ) {}

  private generateCode(): string {
    return randomBytes(12).toString('hex');
  }

  async create(dto: CreateRoomDto, ownerId: number): Promise<Room> {
    const room = this.roomRepo.create({
      ...dto,
      type: dto.type as RoomType,
      ownerId,
      inviteCode: this.generateCode(),
      state: null,
    });
    const saved = await this.roomRepo.save(room);

    await this.memberRepo.save(this.memberRepo.create({
      roomId: saved.id, userId: ownerId, role: MemberRole.OWNER,
    }));

    return this.findOne(saved.id, ownerId);
  }

  async findMyRooms(userId: number): Promise<Room[]> {
    const memberships = await this.memberRepo.find({
      where: { userId },
      relations: ['room', 'room.owner', 'room.members', 'room.members.user'],
    });
    return memberships.map(m => m.room).filter(Boolean);
  }

  async findPublicRooms(): Promise<Room[]> {
    return this.roomRepo.find({
      where: { isPublic: true },
      relations: ['owner', 'members', 'members.user'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number, userId?: number): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user'],
    });
    if (!room) throw new NotFoundException('Комната не найдена');

    if (userId !== undefined && !room.isPublic) {
      const isMember = room.members.some(m => m.userId === userId);
      if (!isMember) throw new ForbiddenException('Комната приватная — нужно получить инвайт от владельца');
    }
    return room;
  }

  async findByInviteCode(code: string): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { inviteCode: code },
      relations: ['owner', 'members', 'members.user'],
    });
    if (!room) throw new NotFoundException('Комната не найдена');
    return room;
  }

  async joinByInvite(code: string, userId: number): Promise<Room> {
    const room = await this.findByInviteCode(code);
    const exists = room.members.some(m => m.userId === userId);
    if (!exists) {
      await this.memberRepo.save(this.memberRepo.create({
        roomId: room.id, userId, role: MemberRole.EDITOR,
      }));
    }
    return this.findOne(room.id, userId);
  }

  async update(id: number, dto: UpdateRoomDto, userId: number): Promise<Room> {
    await this.assertOwner(id, userId);
    await this.roomRepo.update(id, dto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.assertOwner(id, userId);
    await this.roomRepo.delete(id);
  }

  async regenerateInvite(id: number, userId: number): Promise<{ inviteCode: string }> {
    await this.assertOwner(id, userId);
    const code = this.generateCode();
    await this.roomRepo.update(id, { inviteCode: code });
    return { inviteCode: code };
  }

  async removeMember(roomId: number, memberId: number, requesterId: number): Promise<void> {
    const room = await this.findOne(roomId, requesterId);
    const requester = room.members.find(m => m.userId === requesterId);
    if (!requester || requester.role !== MemberRole.OWNER) {
      throw new ForbiddenException('Только владелец может удалять участников');
    }
    if (memberId === requesterId) throw new ForbiddenException('Нельзя удалить себя');
    await this.memberRepo.delete({ roomId, userId: memberId });
  }

  async updateMemberRole(roomId: number, memberId: number, dto: UpdateMemberRoleDto, requesterId: number): Promise<RoomMember> {
    await this.assertOwner(roomId, requesterId);
    const member = await this.memberRepo.findOne({ where: { roomId, userId: memberId } });
    if (!member) throw new NotFoundException('Участник не найден');
    if (member.role === MemberRole.OWNER) throw new ForbiddenException('Нельзя изменить роль владельца');
    member.role = dto.role as MemberRole;
    return this.memberRepo.save(member);
  }

  async saveState(id: number, state: any, userId: number): Promise<void> {
    const room = await this.findOne(id, userId);
    const member = room.members.find(m => m.userId === userId);
    if (!member || member.role === MemberRole.VIEWER) {
      throw new ForbiddenException('Нет прав на редактирование');
    }
    await this.roomRepo.update(id, { state });
  }

  private async assertOwner(roomId: number, userId: number): Promise<void> {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Комната не найдена');
    if (room.ownerId !== userId) throw new ForbiddenException('Только владелец может это сделать');
  }
}
