import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { User } from '../../users/users.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

export type ScheduleItemType = 'lecture' | 'practice' | 'assignment' | 'project' | 'test' | 'peer_review';

@Entity('schedule_items')
export class ScheduleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_group_id' })
  courseGroupId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    name: 'item_type',
    type: 'enum', 
    enum: ['lecture', 'practice', 'assignment', 'project', 'test', 'peer_review'] 
  })
  itemType: ScheduleItemType;

  @Column({ name: 'scheduled_date' })
  scheduledDate: Date;

  @Column({ name: 'due_date', nullable: true })
  dueDate: Date;

  @Column({ name: 'max_score', default: 100 })
  maxScore: number;

  @Column({ name: 'content_url', length: 500, nullable: true })
  contentUrl: string;

  @Column({ name: 'meeting_url', length: 500, nullable: true })
  meetingUrl: string;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => CourseGroup, group => group.scheduleItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_group_id' })
  courseGroup: CourseGroup;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => Assignment, assignment => assignment.scheduleItem)
  assignments: Assignment[];
}