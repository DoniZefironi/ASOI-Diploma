import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRole } from './user-role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['userRoles'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['userRoles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles'],
    });
  }

  async updateProfile(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    
    // Убедимся, что не обновляем чувствительные поля
    const { passwordHash, ...safeUpdateData } = updateData as any;
    
    Object.assign(user, safeUpdateData);
    
    return this.usersRepository.save(user);
  }

  async assignRole(userId: number, role: string): Promise<UserRole> {
    const user = await this.findOne(userId);
    
    // Проверяем, есть ли уже такая роль у пользователя
    const existingRole = await this.userRolesRepository.findOne({
      where: { userId, role },
    });

    if (existingRole) {
      return existingRole;
    }

    const userRole = this.userRolesRepository.create({
      userId: user.id,
      role,
    });

    return this.userRolesRepository.save(userRole);
  }

  async removeRole(userId: number, role: string): Promise<void> {
    await this.userRolesRepository.delete({
      userId,
      role,
    });
  }

  // Дополнительные полезные методы
  async getUserWithRoles(id: number): Promise<User> {
    return this.findOne(id); // Уже включает roles через relations
  }

  async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.userRolesRepository.find({
      where: { userId },
    });
    
    return userRoles.map(role => role.role);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.firstName ILIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName ILIKE :query', { query: `%${query}%` })
      .orWhere('user.email ILIKE :query', { query: `%${query}%` })
      .orWhere('user.username ILIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .getMany();
  }
}