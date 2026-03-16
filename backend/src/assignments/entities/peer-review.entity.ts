// src/assignments/entities/peer-review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { AssignmentSubmission } from './assignment-submission.entity';
import { User } from '../../users/entities/user.entity';

@Entity('peer_reviews')
@Unique(['reviewerId', 'submissionId'])
export class PeerReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewerId: number;

  @ManyToOne(() => User, user => user.peerReviewsGiven)
  reviewer: User;

  @Column()
  submissionId: number;

  @ManyToOne(() => AssignmentSubmission, submission => submission.peerReviewsReceived)
  submission: AssignmentSubmission;

  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
