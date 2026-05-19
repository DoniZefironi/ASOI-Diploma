import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, UpdateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoomMember } from './room-member.entity';

export enum RoomType {
  CIRCUIT  = 'circuit',
  IOT      = 'iot',
  COMPILER = 'compiler',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: RoomType, default: RoomType.CIRCUIT })
  type: RoomType;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'jsonb', nullable: true })
  state: any;

  @Column({ unique: true, length: 32 })
  inviteCode: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ name: 'hackathon_team_id', nullable: true })
  hackathonTeamId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RoomMember, m => m.room, { cascade: true })
  members: RoomMember[];
}
