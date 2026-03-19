import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Internship } from './entities/internship.entity';
import { CreateInternshipDto } from './dto/create-internship.dto';

@Injectable()
export class InternshipsService {
  constructor(
    @InjectRepository(Internship)
    private readonly internshipRepo: Repository<Internship>,
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
}
