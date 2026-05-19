import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRegistration, RegistrationStatus } from '../course-groups/entities/course-registration.entity';
import { Course, CourseType } from '../courses/entities/course.entity';

export interface UserCourseAccess {
  hasAccess: boolean;
  courseType: CourseType | null;
  message?: string;
}

@Injectable()
export class CourseAccessService {
  constructor(
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
  ) {}

  /**
   * Проверяет, имеет ли пользователь доступ к курсу определённого типа
   */
  async checkAccess(userId: number, requiredCourseType: CourseType): Promise<UserCourseAccess> {
    const userRegistrations = await this.registrationRepository.find({
      where: {
        userId,
        status: RegistrationStatus.APPROVED,
      },
      relations: ['courseGroup', 'courseGroup.course'],
    });

    if (userRegistrations.length === 0) {
      return {
        hasAccess: false,
        courseType: null,
        message: 'Вы не записаны ни на один курс',
      };
    }

    // Получаем направление курса пользователя
    const userCourseType = userRegistrations[0].courseGroup.course.type;

    // Проверяем, совпадает ли направление
    if (userCourseType !== requiredCourseType) {
      return {
        hasAccess: false,
        courseType: userCourseType,
        message: `У вас нет доступа к этому материалу. Вы записаны на курс "${this.getCourseTypeName(userCourseType)}", а этот материал относится к курсу "${this.getCourseTypeName(requiredCourseType)}"`,
      };
    }

    return {
      hasAccess: true,
      courseType: userCourseType,
    };
  }

  /**
   * Получает направление курса, на который записан пользователь
   */
  async getUserCourseType(userId: number): Promise<CourseType | null> {
    const registration = await this.registrationRepository.findOne({
      where: {
        userId,
        status: RegistrationStatus.APPROVED,
      },
      relations: ['courseGroup', 'courseGroup.course'],
    });

    return registration?.courseGroup.course.type || null;
  }

  /**
   * Проверяет, записан ли пользователь на какой-либо курс
   */
  async isEnrolledInAnyCourse(userId: number): Promise<boolean> {
    const count = await this.registrationRepository.count({
      where: {
        userId,
        status: RegistrationStatus.APPROVED,
      },
    });

    return count > 0;
  }

  private getCourseTypeName(type: CourseType): string {
    const names: Record<CourseType, string> = {
      [CourseType.ENGLISH]: 'Английский язык',
      [CourseType.ELECTRONICS]: 'Электроника',
      [CourseType.COMPUTER_SCIENCE]: 'Информатика',
      [CourseType.IOT]: 'Интернет вещей',
    };
    return names[type] || type;
  }
}
