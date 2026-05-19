import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { HackathonStage } from './hackathon-stage.entity';
import { TaskReviewer } from './task-reviewer.entity';
import { TaskGrade } from './task-grade.entity';

@Entity('hackathon_tasks')
export class HackathonTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stageId: number;

  @ManyToOne(() => HackathonStage, stage => stage.tasks, { onDelete: 'CASCADE' })
  stage: HackathonStage;

  @Column({ length: 300 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 100 })
  maxScore: number;

  @Column({ type: 'text', nullable: true })
  scoringCriteria: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => TaskReviewer, r => r.task, { cascade: true, eager: true })
  reviewers: TaskReviewer[];

  @OneToMany(() => TaskGrade, g => g.task, { cascade: true })
  grades: TaskGrade[];
}
