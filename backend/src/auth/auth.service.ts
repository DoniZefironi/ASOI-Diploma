// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserRole, UserRoleEnum } from '../users/entities/user-role.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CourseRegistration, RegistrationStatus } from '../course-groups/entities/course-registration.entity';
import { AchievementsService } from '../achievements/achievements.service';
import { AchievementType } from '../achievements/entities/achievement.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
    private jwtService: JwtService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });

    if (user && await bcrypt.compare(password, user.password)) {
      if (user.isActive === false) return null;
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Получаем тип курса пользователя
    const userRegistration = await this.registrationRepository.findOne({
      where: {
        userId: user.id,
        status: RegistrationStatus.APPROVED,
      },
      relations: ['courseGroup', 'courseGroup.course'],
    });

    const enrolledCourseType = userRegistration?.courseGroup?.course?.type || null;

    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles.map((role: UserRole) => role.role),
      enrolledCourseType,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles.map((role: UserRole) => role.role),
        enrolledCourseType,
      }
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    const userRole = this.userRoleRepository.create({
      user: savedUser,
      role: UserRoleEnum.REGISTERED_USER
    });

    await this.userRoleRepository.save(userRole);

    this.achievementsService
      .grantAchievementByType(savedUser.id, AchievementType.FIRST_REGISTRATION)
      .catch(() => {});

    const { password, ...result } = savedUser;
    return result;
  }
}