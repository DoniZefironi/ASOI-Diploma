// src/users/entities/user-role.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum UserRoleEnum {
  REGISTERED_USER = 'registered_user',
  STUDENT = 'student',
  MENTOR = 'mentor',
  ADMIN = 'admin'
}

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.roles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.REGISTERED_USER
  })
  role: UserRoleEnum;
}