import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Unique } from 'typeorm';
import { HackathonTeam } from './hackathon-team.entity';
import { User } from '../../users/entities/user.entity';

@Entity('hackathon_team_members')
@Unique(['teamId', 'userId'])
export class HackathonTeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HackathonTeam, team => team.members)
  team: HackathonTeam;

  @Column()
  teamId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @Column({ default: 'member' })
  role: string;

  @CreateDateColumn()
  joinedAt: Date;
}
