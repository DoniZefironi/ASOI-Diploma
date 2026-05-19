import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HackathonStage } from './hackathon-stage.entity';
import { HackathonTeam } from './hackathon-team.entity';

@Entity('hackathon_stage_submissions')
@Unique(['stageId', 'teamId'])
export class StageSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stage_id' })
  stageId: number;

  @ManyToOne(() => HackathonStage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stage_id' })
  stage: HackathonStage;

  @Column({ name: 'team_id' })
  teamId: number;

  @ManyToOne(() => HackathonTeam, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: HackathonTeam;

  @Column({ length: 1000 })
  projectUrl: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
