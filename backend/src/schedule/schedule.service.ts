// src/schedule/schedule.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { ScheduleItem } from './entities/schedule-item.entity';
import { CreateScheduleItemDto } from './dto/create-schedule-item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule-item.dto';
import { ScheduleSearchDto, SortOrder } from '../common/dto/pagination.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleItem)
    private scheduleRepository: Repository<ScheduleItem>,
  ) {}

  async create(createScheduleItemDto: CreateScheduleItemDto): Promise<ScheduleItem> {
    const scheduleItem = this.scheduleRepository.create(createScheduleItemDto);
    return this.scheduleRepository.save(scheduleItem);
  }

  async findAll(searchDto?: ScheduleSearchDto): Promise<ScheduleItem[]> {
    const { search, type, startDate, endDate, sortBy = 'startTime', sortOrder = SortOrder.ASC } = searchDto || {};

    const where: any = {};

    // Поиск по названию
    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Фильтр по типу
    if (type) {
      where.type = type;
    }

    // Фильтр по дате
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    // Сортировка
    const order: any = {};
    order[sortBy] = sortOrder;

    return this.scheduleRepository.find({
      where,
      relations: ['courseGroup', 'courseGroup.course', 'instructor'],
      order,
    });
  }

  async findOne(id: number): Promise<ScheduleItem> {
    const scheduleItem = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['courseGroup', 'courseGroup.course', 'instructor'],
    });

    if (!scheduleItem) {
      throw new NotFoundException('Schedule item not found');
    }

    return scheduleItem;
  }

  async update(id: number, updateScheduleItemDto: UpdateScheduleItemDto): Promise<ScheduleItem> {
    await this.scheduleRepository.update(id, updateScheduleItemDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.scheduleRepository.delete(id);
  }

  async findByCourseGroup(courseGroupId: number): Promise<ScheduleItem[]> {
    return this.scheduleRepository.find({
      where: { courseGroupId },
      relations: ['courseGroup', 'instructor'],
      order: { startTime: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ScheduleItem[]> {
    return this.scheduleRepository.find({
      where: {
        startTime: Between(startDate, endDate),
      },
      relations: ['courseGroup', 'courseGroup.course', 'instructor'],
      order: { startTime: 'ASC' },
    });
  }

  async getUserSchedule(userId: number, startDate?: Date, endDate?: Date): Promise<ScheduleItem[]> {
    let query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.courseGroup', 'courseGroup')
      .innerJoin('courseGroup.registrations', 'registration')
      .where('registration.userId = :userId', { userId })
      .andWhere('registration.status = :status', { status: 'approved' })
      .leftJoinAndSelect('schedule.courseGroup', 'cg')
      .leftJoinAndSelect('cg.course', 'course')
      .leftJoinAndSelect('schedule.instructor', 'instructor')
      .orderBy('schedule.startTime', 'ASC');

    if (startDate && endDate) {
      query = query.andWhere('schedule.startTime BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.getMany();
  }
}