// src/assignments/entities/assignment-submission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Assignment } from './assignment.entity';
import { PeerReview } from './peer-review.entity';

export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  REVIEWED = 'reviewed',
  GRADED = 'graded'
}

@Entity('assignment_submissions')
export class AssignmentSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ type: 'text', nullable: true })
  repositoryUrl: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.DRAFT
  })
  status: SubmissionStatus;

  @Column({ nullable: true })
  submittedAt: Date;

  @Column({ nullable: true })
  finalScore: number;

  @Column({ type: 'text', nullable: true })
  mentorFeedback: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.submissions)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Assignment, assignment => assignment.submissions)
  assignment: Assignment;

  @Column()
  assignmentId: number;

  @OneToMany(() => PeerReview, peerReview => peerReview.submission)
  peerReviewsReceived: PeerReview[];
}