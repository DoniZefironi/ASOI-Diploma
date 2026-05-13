import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vocab_terms')
export class VocabTerm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  term: string;

  @Column({ nullable: true })
  transcription: string;

  @Column()
  translation: string;

  @Column()
  category: string;

  @Column({ type: 'text' })
  definition: string;

  @Column({ type: 'text', nullable: true })
  example: string;

  @Column({ default: 'basic' })
  level: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
