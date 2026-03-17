// src/materials/materials.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CourseMaterial, MaterialType } from './entities/course-material.entity';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';
import { SearchDto, SortOrder } from '../common/dto/pagination.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(CourseMaterial)
    private materialRepository: Repository<CourseMaterial>,
  ) {}

  async create(createMaterialDto: CreateCourseMaterialDto, uploadedById: number): Promise<CourseMaterial> {
    const material = this.materialRepository.create({
      ...createMaterialDto,
      uploadedById,
    });
    return this.materialRepository.save(material);
  }

  async findAll(searchDto?: SearchDto): Promise<CourseMaterial[]> {
    const { search, sortBy = 'createdAt', sortOrder = SortOrder.DESC } = searchDto || {};

    const where: any = {};

    // Поиск по названию или описанию
    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Сортировка
    const order: any = {};
    order[sortBy] = sortOrder;

    return this.materialRepository.find({
      where,
      relations: ['course', 'uploadedBy'],
      order,
    });
  }

  async findOne(id: number): Promise<CourseMaterial> {
    const material = await this.materialRepository.findOne({
      where: { id },
      relations: ['course', 'uploadedBy'],
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return material;
  }

  async update(id: number, updateMaterialDto: UpdateCourseMaterialDto): Promise<CourseMaterial> {
    await this.materialRepository.update(id, updateMaterialDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.materialRepository.delete(id);
  }

  async findByCourse(courseId: number): Promise<CourseMaterial[]> {
    return this.materialRepository.find({
      where: { courseId },
      relations: ['course', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: MaterialType): Promise<CourseMaterial[]> {
    return this.materialRepository.find({
      where: { type },
      relations: ['course', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPublicMaterials(): Promise<CourseMaterial[]> {
    return this.materialRepository.find({
      where: { isPublic: true },
      relations: ['course', 'uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }
}