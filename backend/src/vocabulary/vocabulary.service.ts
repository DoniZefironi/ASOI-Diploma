import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabTerm } from './entities/vocab-term.entity';
import { CreateVocabTermDto, UpdateVocabTermDto } from './dto/vocab-term.dto';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(VocabTerm)
    private repo: Repository<VocabTerm>,
  ) {}

  findAll(category?: string, level?: string): Promise<VocabTerm[]> {
    const where: any = { isActive: true };
    if (category) where.category = category;
    if (level) where.level = level;
    return this.repo.find({ where, order: { term: 'ASC' } });
  }

  async findOne(id: number): Promise<VocabTerm> {
    const term = await this.repo.findOne({ where: { id } });
    if (!term) throw new NotFoundException('Термин не найден');
    return term;
  }

  create(dto: CreateVocabTermDto): Promise<VocabTerm> {
    const term = this.repo.create({ ...dto, level: dto.level || 'basic' });
    return this.repo.save(term);
  }

  async update(id: number, dto: UpdateVocabTermDto): Promise<VocabTerm> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }
}
