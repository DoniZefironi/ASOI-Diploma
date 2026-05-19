// src/course-groups/entities/course-registration.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CourseGroup } from './course-group.entity';

export enum RegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity('course_registrations')
@Unique(['user', 'courseGroup'])
export class CourseRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.courseRegistrations)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => CourseGroup, courseGroup => courseGroup.registrations)
  courseGroup: CourseGroup;

  @Column()
  courseGroupId: number;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.PENDING
  })
  status: RegistrationStatus;

  @CreateDateColumn()
  registeredAt: Date;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  approvedBy: number;
}