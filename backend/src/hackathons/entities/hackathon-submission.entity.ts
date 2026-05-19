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

  @Column({ type: 'int', nullable: true })
  circuitProjectId: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentationUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  presentationUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoDemoUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sourceCodeUrl: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  archiveUrl: string | null;

  @Column({ type: 'text', nullable: true })
  submissionNote: string | null;

  @CreateDateColumn()
  submittedAt: Date;

  @OneToMany(() => HackathonGrade, grade => grade.submission)
  grades: HackathonGrade[];
}
