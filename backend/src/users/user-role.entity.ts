import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import { User } from './users.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'role' })
  role: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}