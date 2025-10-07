// src/course-groups/course-groups.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseGroup } from './entities/course-group.entity';
import { CourseRegistration, RegistrationStatus } from './entities/course-registration.entity';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { RegisterToCourseDto } from './dto/register-to-course.dto';

@Injectable()
export class CourseGroupsService {
  constructor(
    @InjectRepository(CourseGroup)
    private courseGroupRepository: Repository<CourseGroup>,
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
  ) {}

  async create(createCourseGroupDto: CreateCourseGroupDto): Promise<CourseGroup> {
    const courseGroup = this.courseGroupRepository.create(createCourseGroupDto);
    return this.courseGroupRepository.save(courseGroup);
  }

  async findAll(): Promise<CourseGroup[]> {
    return this.courseGroupRepository.find({
      relations: ['course', 'registrations'],
    });
  }

  async findOne(id: number): Promise<CourseGroup> {
    const courseGroup = await this.courseGroupRepository.findOne({
      where: { id },
      relations: ['course', 'registrations', 'registrations.user', 'scheduleItems', 'assignments'],
    });

    if (!courseGroup) {
      throw new NotFoundException('Course group not found');
    }

    return courseGroup;
  }

  async update(id: number, updateCourseGroupDto: UpdateCourseGroupDto): Promise<CourseGroup> {
    await this.courseGroupRepository.update(id, updateCourseGroupDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.courseGroupRepository.softDelete(id);
  }

  async registerToCourse(registerDto: RegisterToCourseDto, userId: number) {
    const courseGroup = await this.courseGroupRepository.findOne({
      where: { id: registerDto.courseGroupId },
      relations: ['registrations'],
    });

    if (!courseGroup) {
      throw new NotFoundException('Course group not found');
    }

    // Проверка на уже существующую заявку
    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        userId,
        courseGroupId: registerDto.courseGroupId,
      },
    });

    if (existingRegistration) {
      throw new ConflictException('You have already applied to this course group');
    }

    // Проверка на количество студентов
    const approvedRegistrations = courseGroup.registrations.filter(
      (reg: CourseRegistration) => reg.status === RegistrationStatus.APPROVED
    ).length;

    if (approvedRegistrations >= courseGroup.maxStudents) {
      throw new ConflictException('Course group is full');
    }

    const registration = this.registrationRepository.create({
      userId,
      courseGroupId: registerDto.courseGroupId,
      status: RegistrationStatus.PENDING,
    });

    return this.registrationRepository.save(registration);
  }

  async getGroupStudents(groupId: number) {
    const registrations = await this.registrationRepository.find({
      where: { 
        courseGroupId: groupId,
        status: RegistrationStatus.APPROVED 
      },
      relations: ['user'],
    });

    return registrations.map(reg => reg.user);
  }

  async approveRegistration(registrationId: number, approvedBy: number) {
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId },
      relations: ['courseGroup'],
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    const approvedCount = await this.registrationRepository.count({
      where: { 
        courseGroupId: registration.courseGroupId,
        status: RegistrationStatus.APPROVED 
      },
    });

    if (approvedCount >= registration.courseGroup.maxStudents) {
      throw new ConflictException('Course group is full');
    }

    registration.status = RegistrationStatus.APPROVED;
    registration.approvedAt = new Date();
    registration.approvedBy = approvedBy;

    return this.registrationRepository.save(registration);
  }

  async rejectRegistration(registrationId: number) {
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    registration.status = RegistrationStatus.REJECTED;
    return this.registrationRepository.save(registration);
  }

  async getUserRegistrations(userId: number) {
    return this.registrationRepository.find({
      where: { userId },
      relations: ['courseGroup', 'courseGroup.course'],
    });
  }
}