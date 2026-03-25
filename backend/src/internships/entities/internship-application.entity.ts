// src/internships/entities/internship-application.entity.ts
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Internship } from './internship.entity';

@Entity('internship_applications')
@Unique(['user', 'internship'])
export class InternshipApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.internshipApplications, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Internship, internship => internship.applications, { onDelete: 'CASCADE' })
  internship: Internship;

  @Column()
  internshipId: number;

  @CreateDateColumn()
  appliedAt: Date;

  @Column({ nullable: true })
  comment?: string;
}
