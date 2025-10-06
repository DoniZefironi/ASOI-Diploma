// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole, UserRoleEnum } from './entities/user-role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'courseRegistrations', 'achievements'],
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
    await this.userRoleRepository.delete({ userId });

    const userRoles = roles.map(role => 
      this.userRoleRepository.create({ userId, role })
    );

    return this.userRoleRepository.save(userRoles);
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