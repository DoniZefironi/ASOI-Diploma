// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole, UserRoleEnum } from './entities/user-role.entity';
import { CourseRegistration, RegistrationStatus } from '../course-groups/entities/course-registration.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles'],
    });
  }

  async findMentorsByCourseType(courseType?: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['roles'],
    });

    // Фильтруем только менторов
    let mentors = users.filter(user => 
      user.roles.some(role => role.role.startsWith('mentor_'))
    );

    // Если указан тип курса - фильтруем по нему
    if (courseType) {
      mentors = mentors.filter(user => 
        user.roles.some(role => role.role === `mentor_${courseType}`)
      );
    }

    return mentors;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'courseRegistrations', 'courseRegistrations.courseGroup', 'achievements'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async updateUserRoles(userId: number, roles: UserRoleEnum[]) {
    // Проверяем, есть ли у пользователя активные регистрации на курсы
    const hasActiveRegistrations = await this.registrationRepository.exists({
      where: {
        userId,
        status: RegistrationStatus.APPROVED,
      },
      relations: ['courseGroup', 'courseGroup.course'],
    });

    // Если у пользователя есть активные регистрации, всегда добавляем роль STUDENT с типом курса
    // Эта функция больше не используется для добавления STUDENT роли, так как это делается автоматически
    const finalRoles = roles;

    // Используем transaction для надёжности
    const queryRunner = this.userRoleRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Полностью удаляем все старые роли
      await queryRunner.manager.delete('UserRole', { userId });

      // Создаем новые роли
      const userRoles = finalRoles.map(role => ({
        userId,
        role,
      }));

      const result = await queryRunner.manager.save('UserRole', userRoles);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: [
        'roles',
        'courseRegistrations',
        'courseRegistrations.courseGroup',
        'courseRegistrations.courseGroup.course',
        'achievements',
        'achievements.achievement'
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}