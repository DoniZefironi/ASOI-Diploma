// src/forum/entities/forum-section.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { ForumTopic } from './forum-topic.entity';

@Entity('forum_sections')
export class ForumSection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, course => course.forumSections, { onDelete: 'CASCADE' })
  course: Course;

  @Column()
  courseId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  orderIndex: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ForumTopic, topic => topic.section)
  topics: ForumTopic[];
}