// src/assignments/entities/peer-review-session.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Assignment } from './assignment.entity';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';

@Entity('peer_review_sessions')
export class PeerReviewSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  assignmentId: number;

  @ManyToOne(() => Assignment, assignment => assignment.peerReviewSessions)
  assignment: Assignment;

  @Column()
  courseGroupId: number;

  @ManyToOne(() => CourseGroup)
  courseGroup: CourseGroup;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: 5 })
  reviewsPerStudent: number;

  @Column({ type: 'jsonb', nullable: true })
  criteria: { name: string; maxScore: number; description?: string }[];

  @Column({ default: false })
  isDistributed: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
