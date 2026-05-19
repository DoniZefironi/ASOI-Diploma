import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { User } from '../../users/entities/user.entity';
import { ElectiveEnrollment } from './elective-enrollment.entity';

@Entity('electives')
export class Elective {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column() courseGroupId: number;
  @ManyToOne(() => CourseGroup) courseGroup: CourseGroup;
  @Column({ nullable: true }) instructorId: number;
  @ManyToOne(() => User, { nullable: true }) instructor: User;
  @Column({ type: 'timestamp', nullable: true }) startDate: Date;
  @Column({ type: 'timestamp', nullable: true }) endDate: Date;
  @Column({ nullable: true }) maxParticipants: number;
  @Column({ default: true }) isActive: boolean;
  @OneToMany(() => ElectiveEnrollment, e => e.elective) enrollments: ElectiveEnrollment[];
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
