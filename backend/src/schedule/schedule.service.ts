import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { ScheduleItem } from './entities/schedule-item.entity';
import { CreateScheduleItemDto } from './dto/create-schedule-item.dto';
import { UpdateScheduleItemDto } from './dto/update-schedule-item.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleItem)
    private scheduleItemsRepository: Repository<ScheduleItem>,
  ) {}

  async findAll(): Promise<ScheduleItem[]> {
    return this.scheduleItemsRepository.find({
      relations: ['courseGroup', 'courseGroup.course', 'creator'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ScheduleItem> {
    const item = await this.scheduleItemsRepository.findOne({
      where: { id },
      relations: ['courseGroup', 'courseGroup.course', 'creator', 'assignments'],
    });

    if (!item) {
      throw new NotFoundException('Schedule item not found');
    }

    return item;
  }

  async findByCourseGroup(courseGroupId: number): Promise<ScheduleItem[]> {
    return this.scheduleItemsRepository.find({
      where: { courseGroupId },
      relations: ['courseGroup', 'courseGroup.course', 'creator'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ScheduleItem[]> {
    return this.scheduleItemsRepository.find({
      where: {
        scheduledDate: Between(startDate, endDate),
        isActive: true,
      },
      relations: ['courseGroup', 'courseGroup.course', 'creator'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findUpcoming(limit: number = 10): Promise<ScheduleItem[]> {
    const now = new Date();
    
    return this.scheduleItemsRepository.find({
      where: {
        scheduledDate: MoreThanOrEqual(now),
        isActive: true,
      },
      relations: ['courseGroup', 'courseGroup.course', 'creator'],
      order: { scheduledDate: 'ASC' },
      take: limit,
    });
  }

  async findOverdue(): Promise<ScheduleItem[]> {
    const now = new Date();
    
    return this.scheduleItemsRepository.find({
      where: {
        dueDate: LessThanOrEqual(now),
        isActive: true,
      },
      relations: ['courseGroup', 'courseGroup.course', 'creator', 'assignments'],
    });
  }

  async create(createScheduleItemDto: CreateScheduleItemDto): Promise<ScheduleItem> {
    const item = this.scheduleItemsRepository.create(createScheduleItemDto);
    return this.scheduleItemsRepository.save(item);
  }

  async update(id: number, updateScheduleItemDto: UpdateScheduleItemDto): Promise<ScheduleItem> {
    const item = await this.findOne(id);
    Object.assign(item, updateScheduleItemDto);
    return this.scheduleItemsRepository.save(item);
  }

  async remove(id: number): Promise<void> {
    await this.scheduleItemsRepository.delete(id);
  }

  async getScheduleForUser(userId: number, startDate?: Date, endDate?: Date): Promise<ScheduleItem[]> {
    let query = this.scheduleItemsRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.courseGroup', 'courseGroup')
      .innerJoin('courseGroup.registrations', 'registration')
      .where('registration.userId = :userId', { userId })
      .andWhere('registration.status = :status', { status: 'active' })
      .andWhere('schedule.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('schedule.courseGroup', 'cg')
      .leftJoinAndSelect('cg.course', 'course')
      .leftJoinAndSelect('schedule.creator', 'creator')
      .orderBy('schedule.scheduledDate', 'ASC');

    if (startDate && endDate) {
      query = query.andWhere('schedule.scheduledDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    } else if (startDate) {
      query = query.andWhere('schedule.scheduledDate >= :startDate', { startDate });
    }

    return query.getMany();
  }

  async getUpcomingAssignments(userId: number, limit: number = 5): Promise<ScheduleItem[]> {
    const now = new Date();
    
    return this.scheduleItemsRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.courseGroup', 'courseGroup')
      .innerJoin('courseGroup.registrations', 'registration')
      .where('registration.userId = :userId', { userId })
      .andWhere('registration.status = :status', { status: 'active' })
      .andWhere('schedule.isActive = :isActive', { isActive: true })
      .andWhere('schedule.dueDate > :now', { now })
      .andWhere('schedule.itemType IN (:...types)', { 
        types: ['assignment', 'project', 'test'] 
      })
      .leftJoinAndSelect('schedule.courseGroup', 'cg')
      .leftJoinAndSelect('cg.course', 'course')
      .orderBy('schedule.dueDate', 'ASC')
      .take(limit)
      .getMany();
  }

  async getScheduleStatistics(courseGroupId: number) {
    const items = await this.scheduleItemsRepository.find({
      where: { courseGroupId },
    });

    const typeCount = items.reduce((acc, item) => {
      acc[item.itemType] = (acc[item.itemType] || 0) + 1;
      return acc;
    }, {});

    const upcomingCount = items.filter(item => 
      item.scheduledDate > new Date() && item.isActive
    ).length;

    const completedCount = items.filter(item => 
      item.scheduledDate < new Date()
    ).length;

    return {
      totalItems: items.length,
      upcomingCount,
      completedCount,
      typeCount,
    };
  }
}