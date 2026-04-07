import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Hackathon } from './hackathon.entity';
import { HackathonTask } from './hackathon-task.entity';

@Entity('hackathon_stages')
export class HackathonStage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hackathonId: number;

  @ManyToOne(() => Hackathon, hackathon => hackathon.stages, { onDelete: 'CASCADE' })
  hackathon: Hackathon;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @OneToMany(() => HackathonTask, task => task.stage, { cascade: true, eager: true })
  tasks: HackathonTask[];

  @CreateDateColumn()
  createdAt: Date;
}
