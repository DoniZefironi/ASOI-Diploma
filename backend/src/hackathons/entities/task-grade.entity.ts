import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HackathonTask } from './hackathon-task.entity';
import { HackathonTeam } from './hackathon-team.entity';
import { User } from '../../users/entities/user.entity';

@Entity('hackathon_task_grades')
@Unique(['taskId', 'teamId', 'reviewerId'])
export class TaskGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_id' })
  taskId: number;

  @ManyToOne(() => HackathonTask, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: HackathonTask;

  @Column({ name: 'team_id' })
  teamId: number;

  @ManyToOne(() => HackathonTeam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: HackathonTeam;

  @Column({ name: 'reviewer_id' })
  reviewerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: User;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
