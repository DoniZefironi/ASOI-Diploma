// src/materials/materials.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseMaterial, MaterialType } from './entities/course-material.entity';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

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

  async findAll(): Promise<CourseMaterial[]> {
    return this.materialRepository.find({
      relations: ['course', 'uploadedBy'],
      order: { createdAt: 'DESC' },
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