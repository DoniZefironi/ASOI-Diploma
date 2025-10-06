import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/users.entity';
import { CourseGroup } from '../../course-groups/entities/course-group.entity';
import { LearningMaterial } from '../../learning-materials/entities/learning-material.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ 
    type: 'enum', 
    enum: ['english', 'computer_science', 'electronics', 'iot'] 
  })
  category: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => CourseGroup, group => group.course)
  courseGroups: CourseGroup[];

  @OneToMany(() => LearningMaterial, material => material.course)
  learningMaterials: LearningMaterial[];
}