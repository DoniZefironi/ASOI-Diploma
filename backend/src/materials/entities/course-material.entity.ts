// src/materials/entities/course-material.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';

export enum MaterialType {
  LECTURE_SLIDES = 'lecture_slides',
  VIDEO = 'video',
  DOCUMENT = 'document',
  CODE_EXAMPLE = 'code_example',
  PROJECT_TEMPLATE = 'project_template',
  REFERENCE = 'reference'
}

@Entity('course_materials')
export class CourseMaterial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: MaterialType
  })
  type: MaterialType;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ default: true })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Course, course => course.materials)
  course: Course;

  @Column()
  courseId: number;

  @ManyToOne(() => User)
  uploadedBy: User;

  @Column()
  uploadedById: number;
}