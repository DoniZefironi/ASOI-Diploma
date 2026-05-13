import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, CreateDateColumn } from 'typeorm';
import { HackathonTask } from './hackathon-task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('hackathon_task_reviewers')
@Unique(['taskId', 'userId'])
export class TaskReviewer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_id' })
  taskId: number;

  @ManyToOne(() => HackathonTask, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: HackathonTask;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  assignedAt: Date;
}
