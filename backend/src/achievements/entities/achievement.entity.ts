import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

export enum AchievementType {
  FIRST_REGISTRATION   = 'first_registration',
  COURSE_REGISTRATION  = 'course_registration',
  FIRST_SUBMISSION     = 'first_submission',
  MULTIPLE_SUBMISSIONS = 'multiple_submissions',
  ASSIGNMENT_EXCELLENCE= 'assignment_excellence',
  PERFECT_SCORE        = 'perfect_score',
  PEER_REVIEWER        = 'peer_reviewer',
  FORUM_CONTRIBUTOR    = 'forum_contributor',
  EARLY_BIRD           = 'early_bird',
  HACKATHON_PARTICIPANT= 'hackathon_participant',
  HACKATHON_WINNER     = 'hackathon_winner',
  OLYMPIAD_WINNER      = 'olympiad_winner',
  COURSE_COMPLETION    = 'course_completion',
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: AchievementType })
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

  @OneToMany(() => UserAchievement, ua => ua.achievement)
  userAchievements: UserAchievement[];
}
