import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { HackathonTeam } from './hackathon-team.entity';
import { HackathonJury } from './hackathon-jury.entity';

@Entity('hackathons')
export class Hackathon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('text', { nullable: true })
  rules: string;

  @Column({ default: 5 })
  maxTeamSize: number;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: 'pending' }) // pending, active, completed, cancelled
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => HackathonTeam, team => team.hackathon)
  teams: HackathonTeam[];

  @OneToMany(() => HackathonJury, jury => jury.hackathon)
  juryMembers: HackathonJury[];
}