import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OlympiadProblem } from './olympiad-problem.entity';
import { OlympiadSubmission } from './olympiad-submission.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('olympiads')
export class Olympiad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  registrationDeadline: Date;

  @Column({ type: 'jsonb', default: ['js', 'python', 'cpp', 'java'] })
  allowedLanguages: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, name: 'course_id' })
  courseId: number;

  @ManyToOne(() => Course, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OlympiadProblem, p => p.olympiad, { cascade: true })
  problems: OlympiadProblem[];

  @OneToMany(() => OlympiadSubmission, s => s.olympiad)
  submissions: OlympiadSubmission[];
}
