import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { HackathonTeam } from './hackathon-team.entity';
import { HackathonGrade } from './hackathon-grade.entity';

@Entity('hackathon_submissions')
export class HackathonSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HackathonTeam, team => team.submissions)
  team: HackathonTeam;

  @Column()
  teamId: number;

  @Column({ nullable: true })
  circuitProjectId: number;

  @Column({ length: 500, nullable: true })
  documentationUrl: string;

  @Column({ length: 500, nullable: true })
  presentationUrl: string;

  @Column({ length: 500, nullable: true })
  videoDemoUrl: string;

  @Column({ length: 500, nullable: true })
  sourceCodeUrl: string;

  @Column({ type: 'text', nullable: true })
  submissionNote: string;

  @CreateDateColumn()
  submittedAt: Date;

  @OneToMany(() => HackathonGrade, grade => grade.submission)
  grades: HackathonGrade[];
}
