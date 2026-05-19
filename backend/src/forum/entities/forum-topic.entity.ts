// src/forum/entities/forum-topic.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ForumSection } from './forum-section.entity';
import { User } from '../../users/entities/user.entity';
import { ForumPost } from './forum-post.entity';

@Entity('forum_topics')
export class ForumTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ForumSection, section => section.topics, { onDelete: 'CASCADE' })
  section: ForumSection;

  @Column()
  sectionId: number;

  @ManyToOne(() => User, user => user.forumPosts)
  author: User;

  @Column()
  authorId: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ nullable: true })
  lastPostAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ForumPost, post => post.topic)
  posts: ForumPost[];
}