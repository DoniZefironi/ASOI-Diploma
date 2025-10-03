import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from "../users/users.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(username: string, email: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        const user = this.usersRepo.create({ username, email, passwordHash: hash });
        return await this.usersRepo.save(user);
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.usersRepo.findOne({ where: { username } });
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            return user;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: User) {
        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
