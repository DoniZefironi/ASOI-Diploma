// src/common/helpers/role.helper.ts
import { UserRoleEnum } from '../../users/entities/user-role.entity';

export const MENTOR_ROLES: UserRoleEnum[] = [
  UserRoleEnum.MENTOR_ENGLISH,
  UserRoleEnum.MENTOR_ELECTRONICS,
  UserRoleEnum.MENTOR_COMPUTER_SCIENCE,
  UserRoleEnum.MENTOR_IOT,
];

export const STUDENT_ROLES: UserRoleEnum[] = [
  UserRoleEnum.STUDENT_ENGLISH,
  UserRoleEnum.STUDENT_ELECTRONICS,
  UserRoleEnum.STUDENT_COMPUTER_SCIENCE,
  UserRoleEnum.STUDENT_IOT,
];

export const ALL_ROLES: UserRoleEnum[] = [
  UserRoleEnum.ADMIN,
  ...MENTOR_ROLES,
  ...STUDENT_ROLES,
  UserRoleEnum.REGISTERED_USER,
];

export function isMentorRole(role: string): boolean {
  return role.startsWith('mentor_');
}

export function isStudentRole(role: string): boolean {
  return role.startsWith('student_');
}

export function getMentorCourseTypes(roles: string[]): string[] {
  return roles
    .filter(isMentorRole)
    .map(role => role.split('_')[1]);
}

export function getStudentCourseTypes(roles: string[]): string[] {
  return roles
    .filter(isStudentRole)
    .map(role => role.split('_')[1]);
}

export function hasAdminRole(roles: string[]): boolean {
  return roles.includes(UserRoleEnum.ADMIN);
}

export function hasAnyMentorRole(roles: string[]): boolean {
  return roles.some(isMentorRole);
}

export function hasAnyStudentRole(roles: string[]): boolean {
  return roles.some(isStudentRole);
}

/**
 * Проверяет имеет ли пользователь права уровня ADMIN или MENTOR
 * (ментор имеет все права студента)
 */
export function hasMentorOrHigherRights(roles: string[]): boolean {
  return hasAdminRole(roles) || hasAnyMentorRole(roles);
}

/**
 * Проверяет имеет ли пользователь права уровня STUDENT или выше
 * (студент имеет все права registered_user)
 */
export function hasStudentOrHigherRights(roles: string[]): boolean {
  return hasAdminRole(roles) || hasAnyMentorRole(roles) || hasAnyStudentRole(roles);
}

/**
 * Получает все роли которые дают права доступа
 * ADMIN имеет все права
 * MENTOR_* имеет права STUDENT_* + права ментора
 * STUDENT_* имеет права REGISTERED_USER + права студента
 */
export function getEffectiveRoles(userRoles: string[]): string[] {
  const effectiveRoles = new Set<string>(userRoles);
  
  // Если есть ADMIN - добавляем все роли
  if (hasAdminRole(userRoles)) {
    ALL_ROLES.forEach(role => effectiveRoles.add(role));
    return Array.from(effectiveRoles);
  }
  
  // Если есть MENTOR_* - добавляем соответствующие STUDENT_* роли
  userRoles.filter(isMentorRole).forEach(mentorRole => {
    const courseType = mentorRole.split('_')[1];
    effectiveRoles.add(`student_${courseType}`);
    effectiveRoles.add(UserRoleEnum.REGISTERED_USER);
  });
  
  // Если есть STUDENT_* - добавляем REGISTERED_USER
  if (hasAnyStudentRole(userRoles)) {
    effectiveRoles.add(UserRoleEnum.REGISTERED_USER);
  }
  
  return Array.from(effectiveRoles);
}
