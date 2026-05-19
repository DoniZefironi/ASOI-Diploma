// src/users/entities/user-role.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from './user.entity';

export enum UserRoleEnum {
  REGISTERED_USER = 'registered_user',
  
  // Студенты по направлениям
  STUDENT_ENGLISH = 'student_english',
  STUDENT_ELECTRONICS = 'student_electronics',
  STUDENT_COMPUTER_SCIENCE = 'student_computer_science',
  STUDENT_IOT = 'student_iot',
  
  // Менторы по направлениям
  MENTOR_ENGLISH = 'mentor_english',
  MENTOR_ELECTRONICS = 'mentor_electronics',
  MENTOR_COMPUTER_SCIENCE = 'mentor_computer_science',
  MENTOR_IOT = 'mentor_iot',
  
  // Админ (общий)
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

// Helper функции для проверки ролей
export function isStudentRole(role: UserRoleEnum): boolean {
  return role.startsWith('student_');
}

export function isMentorRole(role: UserRoleEnum): boolean {
  return role.startsWith('mentor_');
}

export function getCourseTypeFromRole(role: UserRoleEnum): string | null {
  const parts = role.split('_');
  if (parts.length < 2) return null;
  const type = parts[1];
  return ['english', 'electronics', 'computer_science', 'iot'].includes(type) ? type : null;
}