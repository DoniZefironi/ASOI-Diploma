import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Hackathon } from './hackathon.entity';
import { User } from '../../users/entities/user.entity';
import { HackathonTeamMember } from './hackathon-team-member.entity';
import { HackathonSubmission } from './hackathon-submission.entity';

@Entity('hackathon_teams')
export class HackathonTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Hackathon, hackathon => hackathon.teams)
  hackathon: Hackathon;

  @Column()
  hackathonId: number;

  @ManyToOne(() => User)
  leader: User;

  @Column()
  leaderId: number;

  @Column({ length: 200, nullable: true })
  projectName: string;

  @Column({ type: 'text', nullable: true })
  projectDescription: string;

  @Column({ default: 'forming' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => HackathonTeamMember, member => member.team)
  members: HackathonTeamMember[];

  @OneToMany(() => HackathonSubmission, submission => submission.team)
  submissions: HackathonSubmission[];
}
