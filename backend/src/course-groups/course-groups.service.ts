// src/course-groups/course-groups.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, IsNull, Not } from 'typeorm';
import { CourseGroup } from './entities/course-group.entity';
import { CourseRegistration, RegistrationStatus } from './entities/course-registration.entity';
import { CreateCourseGroupDto } from './dto/create-course-group.dto';
import { UpdateCourseGroupDto } from './dto/update-course-group.dto';
import { RegisterToCourseDto } from './dto/register-to-course.dto';
import { AssignmentSubmission, SubmissionStatus } from '../assignments/entities/assignment-submission.entity';
import { Assignment } from '../assignments/entities/assignment.entity';
import { UserRole, UserRoleEnum } from '../users/entities/user-role.entity';
import { User } from '../users/entities/user.entity';
import { ScheduleItem } from '../schedule/entities/schedule-item.entity';
import { GroupSearchDto, SortOrder } from '../common/dto/pagination.dto';

@Injectable()
export class CourseGroupsService {
  constructor(
    @InjectRepository(CourseGroup)
    private courseGroupRepository: Repository<CourseGroup>,
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(ScheduleItem)
    private scheduleRepository: Repository<ScheduleItem>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createCourseGroupDto: CreateCourseGroupDto): Promise<CourseGroup> {
    const courseGroup = this.courseGroupRepository.create(createCourseGroupDto);
    return this.courseGroupRepository.save(courseGroup);
  }

  async findAll(searchDto?: GroupSearchDto): Promise<CourseGroup[]> {
    const { search, sortBy = 'createdAt', sortOrder = SortOrder.DESC, courseId, year, semester, isActive, page = 1, limit = 10 } = searchDto || {};

    const where: any = {};

    // Поиск по названию
    if (search) {
      where.name = Like(`%${search}%`);
    }

    // Фильтр по курсу
    if (courseId) {
      where.courseId = parseInt(courseId);
    }

    // Фильтр по году
    if (year) {
      where.year = parseInt(year);
    }

    // Фильтр по семестру
    if (semester) {
      where.semester = parseInt(semester);
    }

    // Фильтр по активности
    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    // Сортировка
    const order: any = {};
    order[sortBy] = sortOrder;

    return this.courseGroupRepository.find({
      where,
      relations: ['course', 'registrations'],
      order,
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findByCourseId(courseId: number): Promise<CourseGroup[]> {
    return this.courseGroupRepository.find({
      where: { courseId },
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
    const courseGroup = await this.courseGroupRepository.findOne({
      where: { id },
      relations: ['registrations', 'scheduleItems', 'assignments'],
    });

    if (!courseGroup) {
      throw new NotFoundException('Course group not found');
    }

    // Удаляем связанные записи вручную
    if (courseGroup.assignments && courseGroup.assignments.length > 0) {
      for (const assignment of courseGroup.assignments) {
        await this.assignmentRepository.delete(assignment.id);
      }
    }

    if (courseGroup.scheduleItems && courseGroup.scheduleItems.length > 0) {
      await this.scheduleRepository.delete({ courseGroupId: id });
    }

    if (courseGroup.registrations && courseGroup.registrations.length > 0) {
      await this.registrationRepository.delete({ courseGroupId: id });
    }

    // Удаляем саму группу
    await this.courseGroupRepository.delete(id);
  }

  async registerToCourse(registerDto: RegisterToCourseDto, userId: number) {
    console.log('Registering user', userId, 'to course group', registerDto.courseGroupId);

    const courseGroup = await this.courseGroupRepository.findOne({
      where: { id: registerDto.courseGroupId },
      relations: ['registrations', 'course'],
    });

    if (!courseGroup) {
      console.error('Course group not found:', registerDto.courseGroupId);
      throw new NotFoundException('Course group not found');
    }

    // Проверяем, есть ли уже активная регистрация или одобрение
    const existingRegistration = await this.registrationRepository.findOne({
      where: {
        userId,
        courseGroupId: registerDto.courseGroupId,
      },
    });

    if (existingRegistration) {
      console.log('Existing registration found:', existingRegistration.status);
      if (existingRegistration.status === RegistrationStatus.APPROVED) {
        throw new ConflictException('Вы уже записаны на этот курс');
      }
      if (existingRegistration.status === RegistrationStatus.PENDING) {
        throw new ConflictException('Ваша заявка уже на рассмотрении');
      }
      throw new ConflictException('Вы уже подавали заявку на этот курс');
    }

    // ПРОВЕРКА: Пользователь уже записан на ДРУГОЙ курс того же направления
    const userApprovedRegistrations = await this.registrationRepository.find({
      where: {
        userId,
        status: RegistrationStatus.APPROVED,
      },
      relations: ['courseGroup', 'courseGroup.course'],
    });

    if (userApprovedRegistrations.length > 0) {
      // Проверяем направление курса
      const existingCourseType = userApprovedRegistrations[0].courseGroup.course.type;
      const newCourseType = courseGroup.course.type;

      if (existingCourseType !== newCourseType) {
        throw new ConflictException(
          `Вы уже записаны на курс другого направления (${existingCourseType}).
           Нельзя быть записанным на курсы разных направлений одновременно.`
        );
      }
    }

    const approvedRegistrations = courseGroup.registrations.filter(
      (reg: CourseRegistration) => reg.status === RegistrationStatus.APPROVED
    ).length;

    console.log('Approved registrations:', approvedRegistrations, 'max:', courseGroup.maxStudents);

    if (approvedRegistrations >= courseGroup.maxStudents) {
      throw new ConflictException('Course group is full');
    }

    // Автопринятие при регистрации
    const registration = this.registrationRepository.create({
      userId,
      courseGroupId: registerDto.courseGroupId,
      status: RegistrationStatus.APPROVED, // Автопринятие
      approvedAt: new Date(),
      approvedBy: userId,
    });

    console.log('Creating registration:', registration);
    const saved = await this.registrationRepository.save(registration);
    console.log('Registration saved:', saved);

    // Добавляем роль STUDENT пользователю с типом курса
    await this.addStudentRole(userId, courseGroup.course.type);

    return saved;
  }

  /**
   * Добавляет роль STUDENT пользователю с типом курса
   */
  async addStudentRole(userId: number, courseType: string) {
    console.log(`[addStudentRole] userId: ${userId}, courseType: ${courseType}`);
    
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
    });

    console.log(`[addStudentRole] Current user roles:`, userRoles.map(r => r.role));

    // Маппинг типа курса на роль
    const roleMap: Record<string, UserRoleEnum> = {
      'english': UserRoleEnum.STUDENT_ENGLISH,
      'electronics': UserRoleEnum.STUDENT_ELECTRONICS,
      'computer_science': UserRoleEnum.STUDENT_COMPUTER_SCIENCE,
      'iot': UserRoleEnum.STUDENT_IOT,
    };

    const studentRole = roleMap[courseType];
    if (!studentRole) {
      console.error(`Unknown course type: ${courseType}`);
      return;
    }

    const hasThisStudentRole = userRoles.some(role => role.role === studentRole);
    const hasAnyStudentRole = userRoles.some(role =>
      role.role.startsWith('student_')
    );

    console.log(`[addStudentRole] hasThisStudentRole: ${hasThisStudentRole}, hasAnyStudentRole: ${hasAnyStudentRole}`);

    if (!hasThisStudentRole) {
      // Если есть другая роль студента - не даём вторую
      if (hasAnyStudentRole) {
        console.log(`User ${userId} already has a student role: ${userRoles.find(r => r.role.startsWith('student_'))?.role}`);
        return;
      }

      const newRole = this.userRoleRepository.create({
        userId,
        role: studentRole,
      });
      await this.userRoleRepository.save(newRole);
      console.log(`✅ Added ${studentRole} role to user ${userId}`);
    } else {
      console.log(`User ${userId} already has ${studentRole} role`);
    }
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

  async getAllRegistrations() {
    return this.registrationRepository.find({
      relations: ['user', 'courseGroup', 'courseGroup.course'], 
      order: { registeredAt: 'DESC' }, 
    });
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

    const savedRegistration = await this.registrationRepository.save(registration);

    // Добавляем роль STUDENT пользователю с типом курса
    const courseGroup = await this.courseGroupRepository.findOne({
      where: { id: registration.courseGroupId },
      relations: ['course'],
    });
    if (courseGroup) {
      await this.addStudentRole(registration.userId, courseGroup.course.type);
    }

    return savedRegistration;
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
    const registrations = await this.registrationRepository.find({
      where: { userId },
      relations: ['courseGroup', 'courseGroup.course'],
      order: { registeredAt: 'DESC' },
    });
    
    console.log('User registrations for userId', userId, ':', registrations);
    return registrations;
  }

  async getGroupStudentsWithRating(groupId: number) {
    const registrations = await this.registrationRepository.find({
      where: {
        courseGroupId: groupId,
        status: RegistrationStatus.APPROVED,
      },
      relations: ['user'],
    });

    // Получаем все задания для этой группы
    const assignments = await this.assignmentRepository.find({
      where: { courseGroupId: groupId },
    });

    // Для каждого студента рассчитываем рейтинг
    const studentsWithRating = await Promise.all(
      registrations.map(async (reg) => {
        // Получаем все submission студента для заданий этой группы
        const submissions = await this.submissionRepository.find({
          where: {
            userId: reg.user.id,
            assignment: { courseGroupId: groupId },
          },
          relations: ['assignment'],
        });

        // Считаем выполненные задания (со статусом submitted или выше)
        const completedAssignments = submissions.filter(
          s => s.status !== SubmissionStatus.DRAFT
        ).length;

        // Считаем средний балл только за оценённые работы
        const gradedSubmissions = submissions.filter(
          s => s.finalScore !== null && s.finalScore !== undefined
        );

        let averageScore = 0;
        if (gradedSubmissions.length > 0) {
          // Рассчитываем средний процент выполнения
          const totalPercentage = gradedSubmissions.reduce((sum, submission) => {
            const maxScore = submission.assignment?.maxScore || 100;
            const percentage = (submission.finalScore! / maxScore) * 5; // Конвертируем в 5-балльную шкалу
            return sum + percentage;
          }, 0);
          averageScore = totalPercentage / gradedSubmissions.length;
        }

        return {
          id: reg.user.id,
          firstName: reg.user.firstName,
          lastName: reg.user.lastName,
          email: reg.user.email,
          averageScore: Math.round(averageScore * 10) / 10, // Округляем до 1 знака
          completedAssignments,
        };
      })
    );

    // Сортируем по среднему баллу (убывание), затем по выполненным заданиям
    return studentsWithRating.sort((a, b) => {
      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore;
      }
      return b.completedAssignments - a.completedAssignments;
    });
  }

  /**
   * Обновляет роли всем пользователям с активными регистрациями на курсы
   * Добавляет роль STUDENT с типом курса пользователям, у которых её ещё нет
   */
  async syncStudentRoles() {
    // Получаем всех пользователей с одобренными регистрациями
    const registrations = await this.registrationRepository.find({
      where: { status: RegistrationStatus.APPROVED },
      relations: ['user', 'user.roles', 'courseGroup', 'courseGroup.course'],
    });

    const userIdsWithStudentRole = new Set<number>();

    for (const registration of registrations) {
      const userId = registration.user.id;

      if (userIdsWithStudentRole.has(userId)) {
        continue; // Уже обработали этого пользователя
      }

      // Маппинг типа курса на роль
      const roleMap: Record<string, UserRoleEnum> = {
        'english': UserRoleEnum.STUDENT_ENGLISH,
        'electronics': UserRoleEnum.STUDENT_ELECTRONICS,
        'computer_science': UserRoleEnum.STUDENT_COMPUTER_SCIENCE,
        'iot': UserRoleEnum.STUDENT_IOT,
      };

      const courseType = registration.courseGroup.course.type;
      const studentRole = roleMap[courseType];

      if (!studentRole) {
        console.error(`Unknown course type: ${courseType}`);
        continue;
      }

      const hasThisStudentRole = registration.user.roles.some(role => role.role === studentRole);
      const hasAnyStudentRole = registration.user.roles.some(role => role.role.startsWith('student_'));

      if (!hasThisStudentRole && !hasAnyStudentRole) {
        const newRole = this.userRoleRepository.create({
          userId,
          role: studentRole,
        });
        await this.userRoleRepository.save(newRole);
        console.log(`Added ${studentRole} role to user ${userId}`);
      }

      userIdsWithStudentRole.add(userId);
    }

    return {
      success: true,
      message: `Updated roles for ${userIdsWithStudentRole.size} users`,
      updatedCount: userIdsWithStudentRole.size,
    };
  }
}