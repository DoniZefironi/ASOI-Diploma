// src/schedule/entities/schedule-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { User } from '../../users/entities/user.entity';

export enum ScheduleItemType {
  LECTURE = 'lecture',
  PRACTICE = 'practice',
  TEST = 'test',
  HACKATHON = 'hackathon',
  OLYMPIAD = 'olympiad',
  FACULTATIVE = 'facultative',
  INTERNSHIP = 'internship'
}

@Entity('schedule_items')
export class ScheduleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ScheduleItemType
  })
  type: ScheduleItemType;

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

  @ManyToOne(() => CourseGroup, group => group.scheduleItems)
  courseGroup: CourseGroup;

  @Column()
  courseGroupId: number;

  @ManyToOne(() => User, { nullable: true })
  instructor: User;

  @Column({ nullable: true })
  instructorId: number;
}