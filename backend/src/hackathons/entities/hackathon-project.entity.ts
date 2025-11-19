import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HackathonTeam } from './hackathon-team.entity';
import { HackathonGrade } from './hackathon-grade.entity';

@Entity('hackathon_projects')
export class HackathonProject {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => HackathonTeam, team => team.project)
  @JoinColumn()
  team: HackathonTeam;

  @Column()
  teamId: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', nullable: true })
  repositoryUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  presentationUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  demoUrl: string | null;

  @Column({ default: false })
  isSubmitted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => HackathonGrade, grade => grade.project)
  grades: HackathonGrade[];
}