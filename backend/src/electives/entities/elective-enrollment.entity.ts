import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { Elective } from './elective.entity';
import { User } from '../../users/entities/user.entity';

@Entity('elective_enrollments')
@Unique(['electiveId', 'userId'])
export class ElectiveEnrollment {
  @PrimaryGeneratedColumn() id: number;
  @Column() electiveId: number;
  @ManyToOne(() => Elective, e => e.enrollments) elective: Elective;
  @Column() userId: number;
  @ManyToOne(() => User) user: User;
  @Column({ default: 'active' }) status: string; // active | cancelled
  @CreateDateColumn() enrolledAt: Date;
}
