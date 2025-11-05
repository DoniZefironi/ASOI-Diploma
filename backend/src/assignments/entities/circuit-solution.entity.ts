// src/assignments/entities/circuit-solution.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Assignment } from './assignment.entity';

@Entity('circuit_solutions')
export class CircuitSolution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  circuitData: any; 

  @Column({ type: 'json', nullable: true })
  simulationResults: any; 

  @Column()
  score: number;

  @Column()
  maxScore: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @CreateDateColumn()
  submittedAt: Date;

  @ManyToOne(() => Assignment, assignment => assignment.submissions)
  assignment: Assignment;

  @Column()
  assignmentId: number;
}