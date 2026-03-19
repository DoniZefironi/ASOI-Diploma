// src/schedule/entities/schedule-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { User } from '../../users/entities/user.entity';

export enum ScheduleItemType {
  LECTURE = 'lecture',
  PRACTICE = 'practice',
  TEST = 'test',
  PRACTICE_REVIEW = 'practice_review',
}

@Entity('schedule_items')
export class ScheduleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'lecture' })
  type: ScheduleItemType;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  videoUrl: string;

  @Column({ type: 'text', nullable: true })
  materialsUrl: string;

  @Column({ type: 'text', nullable: true })
  assignmentDescription: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: 'online' })
  location: string;

  @Column({ nullable: true })
  meetingUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CourseGroup, group => group.scheduleItems, { nullable: true })
  courseGroup: CourseGroup;

  @Column({ nullable: true })
  courseGroupId: number;

  @ManyToOne(() => User, { nullable: true })
  instructor: User;

  @Column({ nullable: true })
  instructorId: number;

  @Column({ nullable: true })
  electiveId: number;

  @Column({ nullable: true })
  linkedScheduleItemId: number;
}