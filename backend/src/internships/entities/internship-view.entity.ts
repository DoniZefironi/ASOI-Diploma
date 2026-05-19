// src/internships/entities/internship-view.entity.ts
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Internship } from './internship.entity';

@Entity('internship_views')
@Unique(['user', 'internship'])
export class InternshipView {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.internshipViews, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Internship, internship => internship.views, { onDelete: 'CASCADE' })
  internship: Internship;

  @Column()
  internshipId: number;

  @CreateDateColumn()
  viewedAt: Date;

  @Column({ default: 1 })
  viewCount: number;
}
