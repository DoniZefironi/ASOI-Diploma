import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CourseGroup } from './entities/course-group.entity';
import { CourseRegistration } from './entities/course-registration.entity';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { RegisterToCourseDto } from './dto/register-to-course.dto';

@Injectable()
export class CourseGroupsService {
  constructor(
    @InjectRepository(CourseGroup)
    private courseGroupsRepository: Repository<CourseGroup>,
    @InjectRepository(CourseRegistration)
    private registrationsRepository: Repository<CourseRegistration>,
  ) {}

  async findAll(): Promise<CourseGroup[]> {
    return this.courseGroupsRepository.find({
      relations: ['course', 'registrations', 'registrations.user'],
      order: { year: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CourseGroup> {
    const group = await this.courseGroupsRepository.findOne({
      where: { id },
      relations: ['course', 'registrations', 'registrations.user', 'scheduleItems'],
    });

    if (!group) {
      throw new NotFoundException('Course group not found');
    }

    return group;
  }

  async findByCourse(courseId: number): Promise<CourseGroup[]> {
    return this.courseGroupsRepository.find({
      where: { courseId },
      relations: ['course', 'registrations'],
      order: { year: 'DESC', name: 'ASC' },
    });
  }

  async findByYear(year: number): Promise<CourseGroup[]> {
    return this.courseGroupsRepository.find({
      where: { year },
      relations: ['course', 'registrations'],
    });
  }

  async create(createCourseGroupDto: CreateCourseGroupDto): Promise<CourseGroup> {
    // Проверяем, существует ли уже группа с таким названием в этом курсе и году
    const existingGroup = await this.courseGroupsRepository.findOne({
      where: {
        courseId: createCourseGroupDto.courseId,
        year: createCourseGroupDto.year,
        name: createCourseGroupDto.name,
      },
    });

    if (existingGroup) {
      throw new ConflictException('Course group with this name already exists for this course and year');
    }

    const group = this.courseGroupsRepository.create(createCourseGroupDto);
    return this.courseGroupsRepository.save(group);
  }

  async update(id: number, updateCourseGroupDto: UpdateCourseGroupDto): Promise<CourseGroup> {
    const group = await this.findOne(id);
    Object.assign(group, updateCourseGroupDto);
    return this.courseGroupsRepository.save(group);
  }

  async remove(id: number): Promise<void> {
    await this.courseGroupsRepository.delete(id);
  }

  async registerStudent(registerDto: RegisterToCourseDto): Promise<CourseRegistration> {
    const { courseGroupId, userId } = registerDto;

    const group = await this.findOne(courseGroupId);

    // Проверяем, не превышен ли лимит студентов
    const currentStudents = await this.registrationsRepository.count({
      where: { courseGroupId, status: In(['pending', 'active']) },
    });

    if (currentStudents >= group.maxStudents) {
      throw new BadRequestException('Course group is full');
    }

    // Проверяем, не зарегистрирован ли уже студент
    const existingRegistration = await this.registrationsRepository.findOne({
      where: { courseGroupId, userId },
    });

    if (existingRegistration) {
      throw new ConflictException('Student is already registered for this course group');
    }

    const registration = this.registrationsRepository.create({
      courseGroupId,
      userId,
      status: 'pending',
    });

    return this.registrationsRepository.save(registration);
  }

  async approveRegistration(registrationId: number): Promise<CourseRegistration> {
    const registration = await this.registrationsRepository.findOne({
      where: { id: registrationId },
      relations: ['courseGroup'],
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    registration.status = 'active';
    return this.registrationsRepository.save(registration);
  }

  async getGroupRegistrations(courseGroupId: number): Promise<CourseRegistration[]> {
    return this.registrationsRepository.find({
      where: { courseGroupId },
      relations: ['user', 'user.userRoles'],
      order: { registeredAt: 'DESC' },
    });
  }

  async getUserRegistrations(userId: number): Promise<CourseRegistration[]> {
    return this.registrationsRepository.find({
      where: { userId },
      relations: ['courseGroup', 'courseGroup.course'],
      order: { registeredAt: 'DESC' },
    });
  }

  async getActiveGroups(): Promise<CourseGroup[]> {
    return this.courseGroupsRepository.find({
      where: { isActive: true },
      relations: ['course', 'registrations'],
      order: { year: 'DESC', name: 'ASC' },
    });
  }

  async getGroupStatistics(courseGroupId: number) {
    const group = await this.findOne(courseGroupId);
    
    const registrations = await this.registrationsRepository.find({
      where: { courseGroupId },
    });

    const statusCount = registrations.reduce((acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRegistrations: registrations.length,
      maxStudents: group.maxStudents,
      availableSpots: group.maxStudents - registrations.filter(r => 
        ['pending', 'active'].includes(r.status)
      ).length,
      statusCount,
    };
  }
}