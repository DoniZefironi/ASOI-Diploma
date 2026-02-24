import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { HackathonSubmission } from './hackathon-submission.entity';
import { User } from '../../users/entities/user.entity';

@Entity('hackathon_grades')
export class HackathonGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HackathonSubmission, submission => submission.grades)
  submission: HackathonSubmission;

  @Column()
  submissionId: number;

  @ManyToOne(() => User)
  judge: User;

  @Column()
  judgeId: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  innovationScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  functionalityScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  presentationScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  teamworkScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  totalScore: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ type: 'jsonb', nullable: true })
  judgingCriteriaScores: any;

  @CreateDateColumn()
  judgedAt: Date;
}
