// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../../users/entities/user-role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { getEffectiveRoles } from '../../common/helpers/role.helper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.roles) {
      return false;
    }

    // Получаем эффективные роли пользователя (с учётом иерархии)
    const effectiveRoles = getEffectiveRoles(user.roles);

    // Проверяем есть ли у пользователя хотя бы одна требуемая роль
    return requiredRoles.some((role) => effectiveRoles.includes(role));
  }
}