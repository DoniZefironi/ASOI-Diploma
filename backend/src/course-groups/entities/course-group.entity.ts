// src/course-groups/entities/course-group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { CourseRegistration } from './course-registration.entity';
import { ScheduleItem } from '../../schedule/entities/schedule-item.entity';
import { Assignment } from '../../assignments/entities/assignment.entity';

@Entity('course_groups')
export class CourseGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  semester: number;

  @Column({ default: 30 })
  maxStudents: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Course, course => course.groups)
  course: Course;

  @Column()
  courseId: number;

  @OneToMany(() => CourseRegistration, registration => registration.courseGroup)
  registrations: CourseRegistration[];

  @OneToMany(() => ScheduleItem, scheduleItem => scheduleItem.courseGroup)
  scheduleItems: ScheduleItem[];

  @OneToMany(() => Assignment, assignment => assignment.courseGroup)
  assignments: Assignment[];
}