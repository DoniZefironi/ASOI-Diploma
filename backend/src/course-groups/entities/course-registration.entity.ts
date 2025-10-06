import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/users.entity';
import { CourseGroup } from './course-group.entity';

@Entity('course_registrations')
export class CourseRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'course_group_id' })
  courseGroupId: number;

  @CreateDateColumn({ name: 'registered_at' })
  registeredAt: Date;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'active', 'completed', 'dropped'], 
    default: 'pending' 
  })
  status: string;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @ManyToOne(() => User, user => user.courseRegistrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CourseGroup, group => group.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_group_id' })
  courseGroup: CourseGroup;
}