// src/forum/entities/forum-section.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { ForumTopic } from './forum-topic.entity';

@Entity('forum_sections')
export class ForumSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  topicCount: number;

  @Column({ default: 0 })
  postCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Course, course => course.forumSections)
  course: Course;

  @Column()
  courseId: number;

  @OneToMany(() => ForumTopic, topic => topic.section)
  topics: ForumTopic[];
}