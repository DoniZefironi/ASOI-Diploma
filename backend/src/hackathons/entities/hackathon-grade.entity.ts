import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { HackathonProject } from './hackathon-project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('hackathon_grades')
export class HackathonGrade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HackathonProject, project => project.grades)
  project: HackathonProject;

  @Column()
  projectId: number;

  @ManyToOne(() => User)
  jury: User;

  @Column()
  juryId: number;

  @Column('decimal', { precision: 5, scale: 2 })
  innovationScore: number;

  @Column('decimal', { precision: 5, scale: 2 })
  technicalScore: number;

  @Column('decimal', { precision: 5, scale: 2 })
  presentationScore: number;

  @Column('decimal', { precision: 5, scale: 2 })
  usabilityScore: number;

  @Column('text', { nullable: true })
  comment: string | null;

  @CreateDateColumn()
  gradedAt: Date;
}