import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Hackathon } from './hackathon.entity';
import { User } from '../../users/entities/user.entity';

@Entity('hackathon_jury')
export class HackathonJury {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hackathon, hackathon => hackathon.juryMembers)
  hackathon: Hackathon;

  @Column()
  hackathonId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;
}