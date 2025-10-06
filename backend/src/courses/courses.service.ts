import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({
      relations: ['creator'],
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findByCategory(category: string): Promise<Course[]> {
    const validCategories = ['english', 'computer_science', 'electronics', 'iot'];
    
    if (!validCategories.includes(category)) {
      throw new BadRequestException('Invalid course category');
    }

    return this.coursesRepository.find({
      where: { category },
      relations: ['creator'],
    });
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.save(course);
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return this.coursesRepository.save(course);
  }

  async remove(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }

  async getCategories(): Promise<string[]> {
    return ['english', 'computer_science', 'electronics', 'iot'];
  }
}