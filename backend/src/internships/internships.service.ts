import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Internship } from './entities/internship.entity';
import { InternshipApplication } from './entities/internship-application.entity';
import { InternshipView } from './entities/internship-view.entity';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { ApplyToInternshipDto } from './dto/apply-to-internship.dto';
import { InternshipStat, InternshipApplicationRecord } from './dto/internship-stats.dto';

@Injectable()
export class InternshipsService {
  constructor(
    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,
    @InjectRepository(InternshipApplication)
    private readonly applicationRepo: Repository<InternshipApplication>,
    @InjectRepository(InternshipView)
    private readonly viewRepo: Repository<InternshipView>,
  ) {}

  findAll() {
    return this.internshipRepo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  adminFindAll() {
    return this.internshipRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const internship = await this.internshipRepo.findOne({ where: { id } });
    if (!internship) throw new NotFoundException('Стажировка не найдена');
    return internship;
  }

  create(dto: CreateInternshipDto) {
    return this.internshipRepo.save(this.internshipRepo.create(dto));
  }

  async update(id: number, dto: Partial<CreateInternshipDto>) {
    const internship = await this.internshipRepo.findOne({ where: { id } });
    if (!internship) throw new NotFoundException('Стажировка не найдена');
    Object.assign(internship, dto);
    return this.internshipRepo.save(internship);
  }

  async remove(id: number) {
    const internship = await this.internshipRepo.findOne({ where: { id } });
    if (!internship) throw new NotFoundException('Стажировка не найдена');
    await this.internshipRepo.remove(internship);
    return { success: true };
  }

  // ── Отслеживание просмотров ────────────────────────────────────────────────

  async trackView(userId: number, internshipId: number) {
    const internship = await this.internshipRepo.findOne({ where: { id: internshipId } });
    if (!internship) throw new NotFoundException('Стажировка не найдена');

    try {
      const existingView = await this.viewRepo.findOne({ where: { userId, internshipId } });
      
      if (existingView) {
        existingView.viewCount += 1;
        return this.viewRepo.save(existingView);
      }

      return this.viewRepo.save(this.viewRepo.create({
        userId,
        internshipId,
        viewCount: 1,
      }));
    } catch (error) {
      // Игнорируем ошибки уникальности
      return null;
    }
  }

  // ── Подача заявки ──────────────────────────────────────────────────────────

  async applyToInternship(userId: number, internshipId: number, dto: ApplyToInternshipDto) {
    const internship = await this.internshipRepo.findOne({ where: { id: internshipId } });
    if (!internship) throw new NotFoundException('Стажировка не найдена');

    if (!internship.isActive) {
      throw new BadRequestException('Приём заявок на эту стажировку завершён');
    }

    try {
      return await this.applicationRepo.save(this.applicationRepo.create({
        userId,
        internshipId,
        comment: dto.comment,
      }));
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('Вы уже подали заявку на эту стажировку');
      }
      throw error;
    }
  }

  async getUserApplication(userId: number, internshipId: number) {
    return this.applicationRepo.findOne({ 
      where: { userId, internshipId },
      relations: ['internship'],
    });
  }

  // ── Статистика для админа ─────────────────────────────────────────────────

  async getStats(): Promise<InternshipStat[]> {
    const internships = await this.internshipRepo.find({
      order: { createdAt: 'DESC' },
    });

    const stats: InternshipStat[] = [];

    for (const internship of internships) {
      const [viewCount, applicationCount, lastView, lastApplication] = await Promise.all([
        this.viewRepo.count({ where: { internshipId: internship.id } }),
        this.applicationRepo.count({ where: { internshipId: internship.id } }),
        this.viewRepo.findOne({ 
          where: { internshipId: internship.id },
          order: { viewedAt: 'DESC' },
        }),
        this.applicationRepo.findOne({ 
          where: { internshipId: internship.id },
          order: { appliedAt: 'DESC' },
        }),
      ]);

      stats.push({
        internshipId: internship.id,
        internshipTitle: internship.title,
        company: internship.company,
        views: viewCount,
        applications: applicationCount,
        conversionRate: viewCount > 0 ? Math.round((applicationCount / viewCount) * 100) : 0,
        lastViewedAt: lastView?.viewedAt,
        lastAppliedAt: lastApplication?.appliedAt,
      });
    }

    return stats.sort((a, b) => b.applications - a.applications);
  }

  async getApplications(internshipId?: number): Promise<InternshipApplicationRecord[]> {
    const query = this.applicationRepo
      .createQueryBuilder('app')
      .innerJoin('app.user', 'user')
      .innerJoin('app.internship', 'internship')
      .select([
        'app.id as id',
        'user.id as "userId"',
        'user.email as "userEmail"',
        'user.firstName as "userFirstName"',
        'user.lastName as "userLastName"',
        'internship.id as "internshipId"',
        'internship.title as "internshipTitle"',
        'internship.company as company',
        'app.appliedAt as "appliedAt"',
        'app.comment as comment',
      ])
      .orderBy('app.appliedAt', 'DESC');

    if (internshipId) {
      query.andWhere('internship.id = :internshipId', { internshipId });
    }

    return query.getRawMany();
  }

  // ── Методы для внешних источников ──────────────────────────────────────────

  async findByExternalId(externalId: string, source: string): Promise<Internship | null> {
    return this.internshipRepo.findOne({
      where: { externalId, source },
    });
  }

  findAllFromSource(source: string): Promise<Internship[]> {
    return this.internshipRepo.find({ where: { source } });
  }

  async deactivate(id: number): Promise<void> {
    await this.internshipRepo.update(id, { isActive: false });
  }

  async createWithSource(dto: any): Promise<Internship> {
    const internship = this.internshipRepo.create(dto);
    const saved = await this.internshipRepo.save(internship);
    return Array.isArray(saved) ? saved[0] : saved;
  }
}
