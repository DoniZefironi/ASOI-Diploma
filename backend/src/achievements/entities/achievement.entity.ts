// src/achievements/entities/achievement.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

export enum AchievementType {
  COURSE_COMPLETION = 'course_completion',
  ASSIGNMENT_EXCELLENCE = 'assignment_excellence',
  PEER_REVIEWER = 'peer_reviewer',
  FORUM_CONTRIBUTOR = 'forum_contributor',
  EARLY_BIRD = 'early_bird',
  PERFECT_SCORE = 'perfect_score',
  HACKATHON_WINNER = 'hackathon_winner',
  OLYMPIAD_WINNER = 'olympiad_winner'
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AchievementType
  })
  type: AchievementType;

  @Column()
  icon: string;

  @Column({ default: 1 })
  points: number;

  @Column({ type: 'json' })
  conditions: any;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserAchievement, userAchievement => userAchievement.achievement)
  userAchievements: UserAchievement[];
}