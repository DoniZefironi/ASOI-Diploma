import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { InternshipApplication } from './internship-application.entity';
import { InternshipView } from './internship-view.entity';

@Entity('internships')
export class Internship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200 })
  company: string;

  @Column({ type: 'text', nullable: true })
  companyDescription: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  prospects: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 20, default: 'office' })
  format: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ nullable: true })
  applicationEmail: string;

  @Column({ nullable: true })
  applicationUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  externalId: string;

  @Column({ length: 50, nullable: true })
  source: string;

  @OneToMany(() => InternshipApplication, app => app.internship)
  applications: InternshipApplication[];

  @OneToMany(() => InternshipView, view => view.internship)
  views: InternshipView[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
