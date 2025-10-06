import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { UserRole } from '../users/user-role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, username } = registerDto;

    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username: username || email.split('@')[0] }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.usersRepository.create({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      username: username || email.split('@')[0],
    });

    await this.usersRepository.save(user);

    // Assign student role
    const userRole = this.userRolesRepository.create({
      userId: user.id,
      role: 'student',
    });
    await this.userRolesRepository.save(userRole);

    const roles = ['student'];
    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        roles,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles'],
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.userRoles.map(role => role.role);

    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        roles,
      },
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['userRoles'],
    });
  }
}