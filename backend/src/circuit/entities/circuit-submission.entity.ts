// src/circuit/entities/circuit-submission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Assignment } from '../../assignments/entities/assignment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('circuit_submissions')
export class CircuitSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  circuitData: any; // { nodes: {}, wires: {} }

  @Column()
  score: number;

  @Column()
  maxScore: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ default: false })
  isPassed: boolean;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;

  @ManyToOne(() => Assignment, assignment => assignment.submissions, { onDelete: 'CASCADE' })
  assignment: Assignment;

  @Column()
  assignmentId: number;

  @ManyToOne(() => User, user => user.circuitSubmissions, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;
}