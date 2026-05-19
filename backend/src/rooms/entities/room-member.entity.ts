import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, JoinColumn, Unique,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from '../../users/entities/user.entity';

export enum MemberRole {
  OWNER  = 'owner',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Entity('room_members')
@Unique(['roomId', 'userId'])
export class RoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'room_id' })
  roomId: number;

  @ManyToOne(() => Room, r => r.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: MemberRole, default: MemberRole.EDITOR })
  role: MemberRole;

  @CreateDateColumn()
  joinedAt: Date;
}
