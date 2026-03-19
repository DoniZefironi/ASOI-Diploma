import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Elective } from './entities/elective.entity';
import { ElectiveEnrollment } from './entities/elective-enrollment.entity';
import { CourseRegistration, RegistrationStatus } from '../course-groups/entities/course-registration.entity';
import { CreateElectiveDto } from './dto/create-elective.dto';
import { Assignment } from '../assignments/entities/assignment.entity';
import { ScheduleItem } from '../schedule/entities/schedule-item.entity';
import { CreateAssignmentDto } from '../assignments/dto/create-assignment.dto';
import { CreateScheduleItemDto } from '../schedule/dto/create-schedule-item.dto';

@Injectable()
export class ElectivesService {
  constructor(
    @InjectRepository(Elective) private readonly electiveRepo: Repository<Elective>,
    @InjectRepository(ElectiveEnrollment) private readonly enrollmentRepo: Repository<ElectiveEnrollment>,
    @InjectRepository(CourseRegistration) private readonly registrationRepo: Repository<CourseRegistration>,
    @InjectRepository(Assignment) private readonly assignmentRepo: Repository<Assignment>,
    @InjectRepository(ScheduleItem) private readonly scheduleRepo: Repository<ScheduleItem>,
  ) {}

  // List all active electives for groups the user is approved in
  async getAvailableForUser(userId: number) {
    const approvedRegistrations = await this.registrationRepo.find({
      where: { userId, status: RegistrationStatus.APPROVED },
    });
    const groupIds = approvedRegistrations.map(r => r.courseGroupId);
    if (groupIds.length === 0) return [];

    const electives = await this.electiveRepo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.courseGroup', 'cg')
      .leftJoinAndSelect('cg.course', 'c')
      .leftJoinAndSelect('e.instructor', 'ins')
      .leftJoinAndSelect('e.enrollments', 'en', 'en.status = :status', { status: 'active' })
      .where('e.courseGroupId IN (:...groupIds)', { groupIds })
      .andWhere('e.isActive = true')
      .orderBy('e.createdAt', 'DESC')
      .getMany();

    const myEnrollments = await this.enrollmentRepo.find({ where: { userId, status: 'active' } });
    const enrolledIds = new Set(myEnrollments.map(en => en.electiveId));

    return electives.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      imageUrl: e.imageUrl,
      courseGroupId: e.courseGroupId,
      courseGroupName: e.courseGroup?.name,
      courseName: (e.courseGroup as any)?.course?.name,
      instructorName: e.instructor ? `${e.instructor.firstName} ${e.instructor.lastName}` : null,
      startDate: e.startDate,
      endDate: e.endDate,
      maxParticipants: e.maxParticipants,
      currentParticipants: e.enrollments?.length ?? 0,
      isEnrolled: enrolledIds.has(e.id),
    }));
  }

  async getById(id: number, userId?: number) {
    const e = await this.electiveRepo.findOne({
      where: { id },
      relations: ['courseGroup', 'courseGroup.course', 'instructor', 'enrollments', 'enrollments.user'],
    });
    if (!e) throw new NotFoundException('Факультатив не найден');

    const isEnrolled = userId
      ? !!(await this.enrollmentRepo.findOne({ where: { electiveId: id, userId, status: 'active' } }))
      : false;

    return {
      ...e,
      currentParticipants: e.enrollments?.filter(en => en.status === 'active').length ?? 0,
      isEnrolled,
    };
  }

  async enroll(electiveId: number, userId: number) {
    const elective = await this.electiveRepo.findOne({ where: { id: electiveId, isActive: true } });
    if (!elective) throw new NotFoundException('Факультатив не найден');

    // Check user is approved in the course group
    const reg = await this.registrationRepo.findOne({
      where: { userId, courseGroupId: elective.courseGroupId, status: RegistrationStatus.APPROVED },
    });
    if (!reg) throw new ForbiddenException('Вы должны быть записаны на курс этой группы для записи на факультатив');

    // Check capacity
    if (elective.maxParticipants) {
      const count = await this.enrollmentRepo.count({ where: { electiveId, status: 'active' } });
      if (count >= elective.maxParticipants) throw new BadRequestException('Нет свободных мест');
    }

    // Upsert enrollment
    const existing = await this.enrollmentRepo.findOne({ where: { electiveId, userId } });
    if (existing) {
      if (existing.status === 'active') throw new BadRequestException('Вы уже записаны');
      existing.status = 'active';
      return this.enrollmentRepo.save(existing);
    }
    return this.enrollmentRepo.save(this.enrollmentRepo.create({ electiveId, userId, status: 'active' }));
  }

  async unenroll(electiveId: number, userId: number) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { electiveId, userId, status: 'active' } });
    if (!enrollment) throw new NotFoundException('Запись не найдена');
    enrollment.status = 'cancelled';
    return this.enrollmentRepo.save(enrollment);
  }

  // Admin: list all
  async adminGetAll() {
    return this.electiveRepo.find({
      relations: ['courseGroup', 'courseGroup.course', 'instructor', 'enrollments'],
      order: { createdAt: 'DESC' },
    });
  }

  async adminCreate(dto: CreateElectiveDto) {
    return this.electiveRepo.save(this.electiveRepo.create(dto));
  }

  async adminUpdate(id: number, dto: Partial<CreateElectiveDto>) {
    const e = await this.electiveRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Факультатив не найден');
    Object.assign(e, dto);
    return this.electiveRepo.save(e);
  }

  async adminDelete(id: number) {
    const e = await this.electiveRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException();
    await this.electiveRepo.remove(e);
  }

  async adminGetParticipants(id: number) {
    return this.enrollmentRepo.find({
      where: { electiveId: id },
      relations: ['user'],
      order: { enrolledAt: 'DESC' },
    });
  }

  async getElectiveAssignments(electiveId: number) {
    return this.assignmentRepo.find({
      where: { electiveId },
      order: { deadline: 'ASC' },
    });
  }

  async createElectiveAssignment(electiveId: number, dto: CreateAssignmentDto) {
    const assignment = this.assignmentRepo.create({ ...dto, electiveId, courseGroupId: undefined } as any);
    return this.assignmentRepo.save(assignment);
  }

  async deleteElectiveAssignment(electiveId: number, assignmentId: number) {
    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId, electiveId } });
    if (!assignment) throw new NotFoundException('Assignment not found in this elective');
    await this.assignmentRepo.remove(assignment);
    return { success: true };
  }

  async getElectiveSchedule(electiveId: number) {
    return this.scheduleRepo.find({
      where: { electiveId },
      order: { startTime: 'ASC' },
    });
  }

  async createElectiveScheduleItem(electiveId: number, dto: CreateScheduleItemDto) {
    const item = this.scheduleRepo.create({ ...dto, electiveId, courseGroupId: undefined } as any);
    return this.scheduleRepo.save(item);
  }

  async deleteElectiveScheduleItem(electiveId: number, itemId: number) {
    const item = await this.scheduleRepo.findOne({ where: { id: itemId, electiveId } });
    if (!item) throw new NotFoundException('Schedule item not found in this elective');
    await this.scheduleRepo.remove(item);
    return { success: true };
  }
}
