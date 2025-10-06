// src/achievements/achievements.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementType } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createAchievement(createAchievementDto: CreateAchievementDto): Promise<Achievement> {
    const achievement = this.achievementRepository.create(createAchievementDto);
    return this.achievementRepository.save(achievement);
  }

  async findAllAchievements(): Promise<Achievement[]> {
    return this.achievementRepository.find({
      where: { isActive: true },
      order: { points: 'DESC' },
    });
  }

  async findAchievementById(id: number): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    return achievement;
  }

  async updateAchievement(id: number, updateAchievementDto: UpdateAchievementDto): Promise<Achievement> {
    await this.achievementRepository.update(id, updateAchievementDto);
    return this.findAchievementById(id);
  }

  async removeAchievement(id: number): Promise<void> {
    await this.achievementRepository.delete(id);
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return this.userAchievementRepository.find({
      where: { userId },
      relations: ['achievement'],
      order: { earnedAt: 'DESC' },
    });
  }

  async grantAchievement(userId: number, achievementId: number, metadata?: any): Promise<UserAchievement> {
    // Проверяем, есть ли уже такое достижение у пользователя
    const existingAchievement = await this.userAchievementRepository.findOne({
      where: { userId, achievementId },
    });

    if (existingAchievement) {
      return existingAchievement;
    }

    const userAchievement = this.userAchievementRepository.create({
      userId,
      achievementId,
      earnedAt: new Date(),
      metadata,
    });

    return this.userAchievementRepository.save(userAchievement);
  }

  async checkAndGrantAchievements(userId: number): Promise<UserAchievement[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'submissions',
        'submissions.assignment',
        'forumPosts',
        'peerReviews',
        'courseRegistrations',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allAchievements = await this.findAllAchievements();
    const grantedAchievements: UserAchievement[] = [];

    for (const achievement of allAchievements) {
      if (await this.checkAchievementConditions(user, achievement)) {
        const granted = await this.grantAchievement(userId, achievement.id);
        grantedAchievements.push(granted);
      }
    }

    return grantedAchievements;
  }

  private async checkAchievementConditions(user: User, achievement: Achievement): Promise<boolean> {
    const conditions = achievement.conditions;

    switch (achievement.type) {
      case AchievementType.COURSE_COMPLETION:
        const completedCourses = user.courseRegistrations.filter(
          reg => reg.status === 'approved'
        ).length;
        return completedCourses >= conditions.minCourses;

      case AchievementType.ASSIGNMENT_EXCELLENCE:
        const excellentSubmissions = user.submissions.filter(
          submission => submission.finalScore && submission.finalScore >= conditions.minScore
        ).length;
        return excellentSubmissions >= conditions.minAssignments;

      case AchievementType.PEER_REVIEWER:
        const reviewCount = user.peerReviews.length;
        return reviewCount >= conditions.minReviews;

      case AchievementType.FORUM_CONTRIBUTOR:
        const postCount = user.forumPosts.length;
        return postCount >= conditions.minPosts;

      case AchievementType.EARLY_BIRD:
        // Логика для "ранней пташки" - например, регистрация в первые дни
        const registrationDate = new Date(user.createdAt);
        const courseStartDate = new Date(conditions.courseStartDate);
        const daysDifference = (courseStartDate.getTime() - registrationDate.getTime()) / (1000 * 3600 * 24);
        return daysDifference <= conditions.maxDaysBeforeStart;

      case AchievementType.PERFECT_SCORE:
        const perfectSubmissions = user.submissions.filter(
          submission => submission.finalScore === submission.assignment.maxScore
        );
        return perfectSubmissions.length >= conditions.minPerfectScores;

      default:
        return false;
    }
  }

// src/achievements/achievements.service.ts
async getLeaderboard(limit: number = 10): Promise<any[]> {
  const leaderboard = await this.userAchievementRepository
    .createQueryBuilder('userAchievement')
    .select('userAchievement.userId', 'userId')
    .addSelect('SUM(achievement.points)', 'totalPoints')
    .addSelect('COUNT(userAchievement.id)', 'achievementCount')
    .innerJoin('userAchievement.achievement', 'achievement')
    .groupBy('userAchievement.userId')
    .orderBy('totalPoints', 'DESC')
    .limit(limit)
    .getRawMany();

    // Добавляем информацию о пользователях
    const userIds = leaderboard.map(item => item.userId);
    const users = await this.userRepository.findByIds(userIds);

    return leaderboard.map(item => {
        const user = users.find(u => u.id === item.userId);
        
        // Добавляем проверку на undefined
        if (!user) {
        return {
            user: {
            id: item.userId,
            firstName: 'Unknown',
            lastName: 'User',
            email: 'unknown@example.com',
            },
            totalPoints: parseInt(item.totalPoints) || 0,
            achievementCount: parseInt(item.achievementCount) || 0,
        };
        }

        return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        },
        totalPoints: parseInt(item.totalPoints) || 0,
        achievementCount: parseInt(item.achievementCount) || 0,
        };
    });
    }
}