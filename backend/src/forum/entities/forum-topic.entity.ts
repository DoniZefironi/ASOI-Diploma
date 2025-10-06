// src/forum/entities/forum-topic.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ForumSection } from './forum-section.entity';
import { User } from '../../users/entities/user.entity';
import { ForumPost } from './forum-post.entity';

@Entity('forum_topics')
export class ForumTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  postCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ForumSection, section => section.topics)
  section: ForumSection;

  @Column()
  sectionId: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  authorId: number;

  @OneToMany(() => ForumPost, post => post.topic)
  posts: ForumPost[];

  @Column({ nullable: true })
  lastPostAt: Date;

  @Column({ nullable: true })
  lastPostById: number;
}