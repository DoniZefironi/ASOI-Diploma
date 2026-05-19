// src/achievements/entities/user-achievement.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Achievement } from './achievement.entity';

@Entity('user_achievements')
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.achievements)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Achievement, achievement => achievement.userAchievements)
  achievement: Achievement;

  @Column()
  achievementId: number;

  @CreateDateColumn()
  earnedAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: any;
}