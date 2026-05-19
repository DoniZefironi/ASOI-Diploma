// src/forum/entities/forum-post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ForumTopic } from './forum-topic.entity';
import { User } from '../../users/entities/user.entity';

@Entity('forum_posts')
export class ForumPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ForumTopic, topic => topic.posts, { onDelete: 'CASCADE' })
  topic: ForumTopic;

  @Column()
  topicId: number;

  @ManyToOne(() => User, user => user.forumPosts)
  author: User;

  @Column()
  authorId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isEdited: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}