import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Olympiad } from './olympiad.entity';
import { OlympiadSubmission } from './olympiad-submission.entity';

export enum ProblemDifficulty {
  EASY   = 'easy',
  MEDIUM = 'medium',
  HARD   = 'hard',
}

@Entity('olympiad_problems')
export class OlympiadProblem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'olympiad_id' })
  olympiadId: number;

  @ManyToOne(() => Olympiad, o => o.problems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'olympiad_id' })
  olympiad: Olympiad;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true, name: 'input_description' })
  inputDescription: string;

  @Column({ type: 'text', nullable: true, name: 'output_description' })
  outputDescription: string;

  /** [{input, output, explanation?}] */
  @Column({ type: 'jsonb', default: [] })
  examples: { input: string; output: string; explanation?: string }[];

  @Column({ type: 'enum', enum: ProblemDifficulty, default: ProblemDifficulty.MEDIUM })
  difficulty: ProblemDifficulty;

  @Column({ default: 100 })
  points: number;

  @Column({ default: 0, name: 'order_index' })
  orderIndex: number;

  @OneToMany(() => OlympiadSubmission, s => s.problem)
  submissions: OlympiadSubmission[];
}
