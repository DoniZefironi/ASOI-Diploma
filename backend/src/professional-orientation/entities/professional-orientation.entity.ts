// src/professional-orientation/entities/professional-orientation.entity.ts
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('professional_orientations')
export class ProfessionalOrientation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.professionalOrientations)
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'json', default: {} })
  testResult: Record<string, any>;

  @Column()
  recommendedProfession: string;

  @Column({ type: 'json', nullable: true })
  expertResult: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}