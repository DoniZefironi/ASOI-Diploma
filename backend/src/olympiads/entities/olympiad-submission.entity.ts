import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Olympiad } from './olympiad.entity';
import { OlympiadProblem } from './olympiad-problem.entity';
import { User } from '../../users/entities/user.entity';

export enum SubmissionStatus {
  PENDING       = 'pending',
  ACCEPTED      = 'accepted',
  WRONG_ANSWER  = 'wrong_answer',
  ERROR         = 'error',
}

@Entity('olympiad_submissions')
export class OlympiadSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'olympiad_id' })
  olympiadId: number;

  @ManyToOne(() => Olympiad, o => o.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'olympiad_id' })
  olympiad: Olympiad;

  @Column({ name: 'problem_id' })
  problemId: number;

  @ManyToOne(() => OlympiadProblem, p => p.submissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problem_id' })
  problem: OlympiadProblem;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  code: string;

  @Column({ length: 20 })
  language: string;

  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.PENDING })
  status: SubmissionStatus;

  @Column({ default: 0 })
  score: number;

  @Column({ type: 'text', nullable: true })
  output: string;

  @Column({ type: 'text', nullable: true, name: 'error_message' })
  errorMessage: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
