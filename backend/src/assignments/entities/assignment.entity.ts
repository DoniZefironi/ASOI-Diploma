// src/assignments/entities/assignment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { AssignmentSubmission } from './assignment-submission.entity';

export enum AssignmentType {
  LECTURE = 'lecture',
  PRACTICE = 'practice',
  TEST = 'test',
  HACKATHON = 'hackathon',
  OLYMPIAD = 'olympiad',
  FACULTATIVE = 'facultative'
}

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AssignmentType
  })
  type: AssignmentType;

  @Column({ type: 'json', nullable: true })
  requirements: any;

  @Column()
  maxScore: number;

  @Column()
  deadline: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CourseGroup, group => group.assignments)
  courseGroup: CourseGroup;

  @Column()
  courseGroupId: number;

  @OneToMany(() => AssignmentSubmission, submission => submission.assignment)
  submissions: AssignmentSubmission[];

  @Column({ type: 'json', nullable: true })
  testCases: any; 
}