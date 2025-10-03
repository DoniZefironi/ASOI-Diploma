import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserRole } from './user-role.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(UserRole) private rolesRepo: Repository<UserRole>,
    ) {}

    async findAll() {
        return this.usersRepo.find({ relations: ['roles'] });
    }

    async findOne(id: number) {
        const user = await this.usersRepo.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async assignRole(userId: number, role: string) {
        const user = await this.findOne(userId);
        const newRole = this.rolesRepo.create({ role, user });
        return this.rolesRepo.save(newRole);
    }

    async removeRole(roleId: number) {
        const role = await this.rolesRepo.findOne({ where: { id: roleId } });
        if (!role) throw new NotFoundException('Role not found');
        return this.rolesRepo.remove(role);
    }
}
