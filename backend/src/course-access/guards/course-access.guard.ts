import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CourseAccessService } from '../course-access.service';
import { REQUIRE_COURSE_TYPE } from '../decorators/require-course-type.decorator';
import { CourseType } from '../../courses/entities/course.entity'; // Добавить импорт

@Injectable()
export class CourseAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private courseAccessService: CourseAccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Изменить тип с string на CourseType
    const requiredCourseType = this.reflector.get<CourseType>(
      REQUIRE_COURSE_TYPE,
      context.getHandler(),
    );

    // Если декоратор не установлен, разрешаем доступ
    if (!requiredCourseType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const userRoles: string[] = request.user?.roles || [];

    if (!userId) {
      throw new ForbiddenException('Необходимо авторизоваться');
    }

    // Администратор имеет доступ ко всем курсам
    if (userRoles.includes('admin')) {
      return true;
    }

    const access = await this.courseAccessService.checkAccess(userId, requiredCourseType);

    if (!access.hasAccess) {
      throw new ForbiddenException(access.message || 'Доступ запрещён');
    }

    return true;
  }
}