import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('career_tests')
export class CareerTest {
  @PrimaryGeneratedColumn()
  id: number;

  /** Уникальный идентификатор теста (holland, klimov, ...) */
  @Column({ unique: true })
  type: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: '10–15 минут' })
  duration: string;

  /**
   * Формат ответов:
   * "yes_no"  — да/нет (Холланд)
   * "choice"  — выбор A или B (Климов)
   */
  @Column({ default: 'yes_no' })
  answerFormat: string;

  /**
   * Вопросы в формате JSONB.
   * Холланд: { id, text, category }[]
   * Климов:  { id, a: { text, category }, b: { text, category } }[]
   */
  @Column({ type: 'jsonb' })
  questions: any[];

  /**
   * Метаданные категорий: { [category]: { label, description, careers[] } }
   */
  @Column({ type: 'jsonb', nullable: true })
  categoryMeta: Record<string, { label: string; description: string; careers: string[] }>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
