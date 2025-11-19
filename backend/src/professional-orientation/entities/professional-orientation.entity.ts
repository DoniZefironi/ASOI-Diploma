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

  // Добавляем значение по умолчанию для testResult
  @Column({ type: 'json', default: {} })
  testResult: Record<string, any>;

  @Column()
  recommendedProfession: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}