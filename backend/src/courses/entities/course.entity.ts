// src/courses/entities/course.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { CourseMaterial } from '../../materials/entities/course-material.entity';
import { ForumSection } from '../../forum/entities/forum-section.entity';

export enum CourseType {
  ENGLISH = 'english',
  ELECTRONICS = 'electronics',
  COMPUTER_SCIENCE = 'computer_science',
  IOT = 'iot'
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CourseType
  })
  type: CourseType;

  @Column({ type: 'text' })
  description: string;

  @Column()
  duration: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CourseGroup, group => group.course)
  groups: CourseGroup[];

  @OneToMany(() => CourseMaterial, material => material.course)
  materials: CourseMaterial[];

  @OneToMany(() => ForumSection, section => section.course)
  forumSections: ForumSection[];
}