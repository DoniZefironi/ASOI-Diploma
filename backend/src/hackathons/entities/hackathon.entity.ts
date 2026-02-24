import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { HackathonTeam } from './hackathon-team.entity';

@Entity('hackathons')
export class Hackathon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, { nullable: true })
  course: Course;

  @Column({ nullable: true })
  courseId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 200, nullable: true })
  theme: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  registrationDeadline: Date | null;

  @Column({ default: 5 })
  maxTeamSize: number;

  @Column({ default: 3 })
  minTeamSize: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  prizePool: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  judgingCriteria: any;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => HackathonTeam, team => team.hackathon)
  teams: HackathonTeam[];
}
