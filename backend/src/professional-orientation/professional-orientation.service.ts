// src/professional-orientation/professional-orientation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalOrientation } from './entities/professional-orientation.entity';
import { CreateProfessionalOrientationDto } from './dto/create-professional-orientation.dto';

// --- ЭКСПОРТИРУЕМ интерфейс ---
export interface ProfessionStat {
  profession: string;
  count: number;
}
// --- КОНЕЦ ЭКСПОРТА ---

@Injectable()
export class ProfessionalOrientationService {
  constructor(
    @InjectRepository(ProfessionalOrientation)
    private readonly repo: Repository<ProfessionalOrientation>,
  ) {}

  async findByUserId(userId: number) {
    return this.repo.findOne({ where: { userId } });
  }

  async create(userId: number, dto: CreateProfessionalOrientationDto) {
    const result = this.repo.create({
      userId,
      recommendedProfession: dto.recommendedProfession,
      testResult: dto.testResult || {}, // Добавляем значение по умолчанию
    });
    return this.repo.save(result);
  }

  // Добавляем метод для обновления существующей записи
  async updateOrCreate(userId: number, dto: CreateProfessionalOrientationDto) {
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      existing.recommendedProfession = dto.recommendedProfession;
      existing.testResult = dto.testResult || {};
      return this.repo.save(existing);
    } else {
      return this.create(userId, dto);
    }
  }
  
  async getStats(): Promise<ProfessionStat[]> {
    // Используем TypeORM QueryBuilder для агрегации
    const stats = await this.repo
      .createQueryBuilder('po')
      .select('po.recommendedProfession', 'profession')
      .addSelect('COUNT(po.id)', 'count')
      .groupBy('po.recommendedProfession')
      .orderBy('count', 'DESC') // Сортируем по убыванию
      .getRawMany(); // getRawMany возвращает объекты с полями из SELECT

    // Приводим к нужному типу
    return stats.map(row => ({
      profession: row.profession,
      count: parseInt(row.count, 10), // COUNT возвращает строку, преобразуем в число
    }));
  }
}