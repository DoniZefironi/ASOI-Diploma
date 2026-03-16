// src/assignments/entities/assignment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { AssignmentSubmission } from './assignment-submission.entity';
import { PeerReview } from './peer-review.entity';
import { PeerReviewSession } from './peer-review-session.entity';

export enum AssignmentType {
  PRACTICE = 'practice',
  TEST = 'test',
  PRACTICE_REVIEW = 'practice_review',
  HACKATHON = 'hackathon',
  OLYMPIAD = 'olympiad',
}

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AssignmentType
  })
  type: AssignmentType;

  @Column({ type: 'json', nullable: true })
  requirements: any;

  @Column()
  maxScore: number;

  @Column()
  deadline: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  peerReviewEnabled: boolean;

  @Column({ nullable: true })
  peerReviewStartDate: Date;

  @Column({ nullable: true })
  peerReviewEndDate: Date;

  @Column({ default: 5 })
  peerReviewsPerStudent: number;

  @Column({ type: 'text', nullable: true })
  peerReviewCriteria: string;

  @OneToMany(() => PeerReviewSession, session => session.assignment)
  peerReviewSessions: PeerReviewSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CourseGroup, group => group.assignments)
  courseGroup: CourseGroup;

  @Column()
  courseGroupId: number;

  @OneToMany(() => AssignmentSubmission, submission => submission.assignment)
  submissions: AssignmentSubmission[];

  @Column({ type: 'json', nullable: true })
  testCases: any; 
}