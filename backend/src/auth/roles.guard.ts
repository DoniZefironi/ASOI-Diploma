import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Поддерживаем оба формата: с userRoles и с roles
    let userRoles: string[] = [];
    
    if (user && user.roles) {
      // Новый формат из JwtStrategy
      userRoles = user.roles;
    } else if (user && user.userRoles) {
      // Старый формат из базы данных
      userRoles = user.userRoles.map(role => role.role);
    }

    return requiredRoles.some(role => userRoles.includes(role));
  }
}