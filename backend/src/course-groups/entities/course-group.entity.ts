import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { CourseRegistration } from './course-registration.entity';
import { ScheduleItem } from '../../schedule/entities/schedule-item.entity';

@Entity('course_groups')
export class CourseGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'course_id' })
  courseId: number;

  @Column()
  year: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'max_students', default: 30 })
  maxStudents: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Course, course => course.courseGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => CourseRegistration, registration => registration.courseGroup)
  registrations: CourseRegistration[];

  @OneToMany(() => ScheduleItem, scheduleItem => scheduleItem.courseGroup)
  scheduleItems: ScheduleItem[];
}