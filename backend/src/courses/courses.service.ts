// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, CourseType } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({
      where: { isActive: true },
      relations: ['groups'],
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['groups', 'materials', 'forumSections'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findByType(type: CourseType): Promise<Course[]> {
    return this.coursesRepository.find({
      where: { type, isActive: true },
      relations: ['groups'],
    });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    await this.coursesRepository.update(id, updateCourseDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.coursesRepository.softDelete(id);
  }
}