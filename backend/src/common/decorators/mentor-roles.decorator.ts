// src/common/decorators/mentor-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../../users/entities/user-role.entity';

export const MENTOR_ROLES = [
  UserRoleEnum.MENTOR_ENGLISH,
  UserRoleEnum.MENTOR_ELECTRONICS,
  UserRoleEnum.MENTOR_COMPUTER_SCIENCE,
  UserRoleEnum.MENTOR_IOT,
];

export const MentorRoles = () => SetMetadata('roles', MENTOR_ROLES);
