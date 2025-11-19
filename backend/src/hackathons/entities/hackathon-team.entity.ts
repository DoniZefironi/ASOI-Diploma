import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Hackathon } from './hackathon.entity';
import { HackathonTeamMember } from './hackathon-team-member.entity';
import { HackathonProject } from './hackathon-project.entity';

@Entity('hackathon_teams')
export class HackathonTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  joinCode: string;

  @Column({ default: 'pending' }) // pending, approved, rejected
  status: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null; // Разрешаем null

  @ManyToOne(() => Hackathon, hackathon => hackathon.teams)
  hackathon: Hackathon;

  @Column()
  hackathonId: number;

  @OneToMany(() => HackathonTeamMember, member => member.team)
  members: HackathonTeamMember[];

  @OneToOne(() => HackathonProject, project => project.team)
  project: HackathonProject;

  @CreateDateColumn()
  createdAt: Date;
}