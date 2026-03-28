import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('site_visits')
@Index(['visitedAt'])
@Index(['userId'])
@Index(['path'])
export class SiteVisit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  path: string;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true, length: 200 })
  userDisplayName: string;

  @CreateDateColumn()
  visitedAt: Date;
}
