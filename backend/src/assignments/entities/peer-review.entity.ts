// src/assignments/entities/peer-review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { AssignmentSubmission } from './assignment-submission.entity';
import { User } from '../../users/entities/user.entity';

@Entity('peer_reviews')
export class PeerReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column({ type: 'text' })
  feedback: string;

  @Column({ default: false })
  isMentorReview: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => AssignmentSubmission, submission => submission.peerReviews)
  submission: AssignmentSubmission;

  @Column()
  submissionId: number;

  @ManyToOne(() => User, user => user.peerReviews)
  reviewer: User;

  @Column()
  reviewerId: number;
}