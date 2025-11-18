// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from './user-role.entity';
import { CourseRegistration } from '../../course-groups/entities/course-registration.entity';
import { AssignmentSubmission } from '../../assignments/entities/assignment-submission.entity';
import { ForumPost } from '../../forum/entities/forum-post.entity';
import { UserAchievement } from '../../achievements/entities/user-achievement.entity';
import { PeerReview } from '../../assignments/entities/peer-review.entity';
import { CircuitSubmission } from '../../circuit/entities/circuit-submission.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRole, userRole => userRole.user)
  roles: UserRole[];

  @OneToMany(() => CourseRegistration, registration => registration.user)
  courseRegistrations: CourseRegistration[];

  @OneToMany(() => AssignmentSubmission, submission => submission.user)
  submissions: AssignmentSubmission[];

  @OneToMany(() => ForumPost, post => post.author)
  forumPosts: ForumPost[];

  @OneToMany(() => UserAchievement, achievement => achievement.user)
  achievements: UserAchievement[];

  @OneToMany(() => PeerReview, peerReview => peerReview.reviewer)
  peerReviews: PeerReview[];

  @OneToMany(() => CircuitSubmission, submission => submission.user)
  circuitSubmissions: CircuitSubmission[];
}