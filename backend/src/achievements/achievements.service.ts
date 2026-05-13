import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementType } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

const SEED_ACHIEVEMENTS = [
  // ── Регистрация ───────────────────────────────────────────────────
  {
    name: 'Добро пожаловать!',
    description: 'Зарегистрировался на платформе',
    type: AchievementType.FIRST_REGISTRATION,
    icon: '🎉',
    points: 5,
    conditions: {},
  },
  // ── Курсы ─────────────────────────────────────────────────────────
  {
    name: 'Студент',
    description: 'Записался на первый курс',
    type: AchievementType.COURSE_REGISTRATION,
    icon: '📚',
    points: 10,
    conditions: { minRegistrations: 1 },
  },
  {
    name: 'Ранняя пташка',
    description: 'Записался на курс за 7+ дней до начала',
    type: AchievementType.EARLY_BIRD,
    icon: '🐦',
    points: 15,
    conditions: { minDaysBeforeStart: 7 },
  },
  {
    name: 'Активный студент',
    description: 'Зачислен хотя бы на один курс',
    type: AchievementType.COURSE_COMPLETION,
    icon: '🎓',
    points: 40,
    conditions: { minCourses: 1 },
  },
  // ── Задания ───────────────────────────────────────────────────────
  {
    name: 'Первые шаги',
    description: 'Сдал первое задание',
    type: AchievementType.FIRST_SUBMISSION,
    icon: '✏️',
    points: 15,
    conditions: { minSubmissions: 1 },
  },
  {
    name: 'Прилежный ученик',
    description: 'Сдал 5 заданий',
    type: AchievementType.MULTIPLE_SUBMISSIONS,
    icon: '📖',
    points: 25,
    conditions: { minSubmissions: 5 },
  },
  {
    name: 'Труженик',
    description: 'Сдал 10 заданий',
    type: AchievementType.MULTIPLE_SUBMISSIONS,
    icon: '💪',
    points: 40,
    conditions: { minSubmissions: 10 },
  },
  {
    name: 'Мастер сдачи',
    description: 'Сдал 25 заданий',
    type: AchievementType.MULTIPLE_SUBMISSIONS,
    icon: '🧠',
    points: 75,
    conditions: { minSubmissions: 25 },
  },
  {
    name: 'Легенда',
    description: 'Сдал 50 заданий',
    type: AchievementType.MULTIPLE_SUBMISSIONS,
    icon: '🌟',
    points: 150,
    conditions: { minSubmissions: 50 },
  },
  // ── Качество ─────────────────────────────────────────────────────
  {
    name: 'Отличник',
    description: 'Получил 90+ баллов за задание',
    type: AchievementType.ASSIGNMENT_EXCELLENCE,
    icon: '⭐',
    points: 20,
    conditions: { minScore: 90, minAssignments: 1 },
  },
  {
    name: 'Постоянный отличник',
    description: 'Получил 90+ баллов за 5 заданий',
    type: AchievementType.ASSIGNMENT_EXCELLENCE,
    icon: '🌠',
    points: 60,
    conditions: { minScore: 90, minAssignments: 5 },
  },
  {
    name: 'Перфекционист',
    description: 'Получил максимальный балл за задание',
    type: AchievementType.PERFECT_SCORE,
    icon: '💯',
    points: 30,
    conditions: { minPerfectScores: 1 },
  },
  {
    name: 'Безупречный',
    description: 'Получил максимальный балл за 5 заданий',
    type: AchievementType.PERFECT_SCORE,
    icon: '💎',
    points: 100,
    conditions: { minPerfectScores: 5 },
  },
  // ── Форум ────────────────────────────────────────────────────────
  {
    name: 'Участник форума',
    description: 'Написал первое сообщение на форуме',
    type: AchievementType.FORUM_CONTRIBUTOR,
    icon: '💬',
    points: 10,
    conditions: { minPosts: 1 },
  },
  {
    name: 'Активный участник',
    description: 'Написал 10 сообщений на форуме',
    type: AchievementType.FORUM_CONTRIBUTOR,
    icon: '🗣️',
    points: 25,
    conditions: { minPosts: 10 },
  },
  {
    name: 'Форумный эксперт',
    description: 'Написал 50 сообщений на форуме',
    type: AchievementType.FORUM_CONTRIBUTOR,
    icon: '👑',
    points: 50,
    conditions: { minPosts: 50 },
  },
  {
    name: 'Форумная легенда',
    description: 'Написал 100 сообщений на форуме',
    type: AchievementType.FORUM_CONTRIBUTOR,
    icon: '🏛️',
    points: 100,
    conditions: { minPosts: 100 },
  },
  // ── Peer Review ──────────────────────────────────────────────────
  {
    name: 'Рецензент',
    description: 'Выполнил первую взаимооценку',
    type: AchievementType.PEER_REVIEWER,
    icon: '🔍',
    points: 15,
    conditions: { minReviews: 1 },
  },
  {
    name: 'Опытный рецензент',
    description: 'Выполнил 5 взаимооценок',
    type: AchievementType.PEER_REVIEWER,
    icon: '🏅',
    points: 35,
    conditions: { minReviews: 5 },
  },
  {
    name: 'Эксперт-рецензент',
    description: 'Выполнил 10 взаимооценок',
    type: AchievementType.PEER_REVIEWER,
    icon: '🎯',
    points: 60,
    conditions: { minReviews: 10 },
  },
  {
    name: 'Мастер-рецензент',
    description: 'Выполнил 25 взаимооценок',
    type: AchievementType.PEER_REVIEWER,
    icon: '🔬',
    points: 120,
    conditions: { minReviews: 25 },
  },
  // ── Хакатоны ─────────────────────────────────────────────────────
  {
    name: 'Участник хакатона',
    description: 'Подал первый проект на хакатон',
    type: AchievementType.HACKATHON_PARTICIPANT,
    icon: '🚀',
    points: 20,
    conditions: {},
  },
  {
    name: 'Финалист хакатона',
    description: 'Набрал 75+ баллов на хакатоне',
    type: AchievementType.HACKATHON_WINNER,
    icon: '🥉',
    points: 35,
    conditions: { minScore: 75 },
  },
  {
    name: 'Победитель хакатона',
    description: 'Набрал 90+ баллов на хакатоне',
    type: AchievementType.HACKATHON_WINNER,
    icon: '🏆',
    points: 50,
    conditions: { minScore: 90 },
  },
  {
    name: 'Чемпион хакатонов',
    description: 'Участвовал в трёх и более хакатонах',
    type: AchievementType.HACKATHON_PARTICIPANT,
    icon: '🎖️',
    points: 60,
    conditions: { minHackathons: 3 },
  },
  // ── Олимпиады ────────────────────────────────────────────────────
  {
    name: 'Призёр олимпиады',
    description: 'Занял призовое место на олимпиаде',
    type: AchievementType.OLYMPIAD_WINNER,
    icon: '🥇',
    points: 80,
    conditions: {},
  },
];

@Injectable()
export class AchievementsService implements OnModuleInit {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepo: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private userAchievementRepo: Repository<UserAchievement>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async onModuleInit() {
    for (const seed of SEED_ACHIEVEMENTS) {
      const exists = await this.achievementRepo.findOne({
        where: { type: seed.type, name: seed.name },
      });
      if (!exists) {
        await this.achievementRepo.save(this.achievementRepo.create(seed));
      }
    }
  }

  // ── CRUD ─────────────────────────────────────────────────────────

  async createAchievement(dto: CreateAchievementDto): Promise<Achievement> {
    return this.achievementRepo.save(this.achievementRepo.create(dto));
  }

  async findAllAchievements(): Promise<Achievement[]> {
    return this.achievementRepo.find({ where: { isActive: true }, order: { points: 'DESC' } });
  }

  async findAchievementById(id: number): Promise<Achievement> {
    const a = await this.achievementRepo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Achievement not found');
    return a;
  }

  async updateAchievement(id: number, dto: UpdateAchievementDto): Promise<Achievement> {
    await this.achievementRepo.update(id, dto);
    return this.findAchievementById(id);
  }

  async removeAchievement(id: number): Promise<void> {
    await this.achievementRepo.delete(id);
  }

  // ── User achievements ─────────────────────────────────────────────

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return this.userAchievementRepo.find({
      where: { userId },
      relations: ['achievement'],
      order: { earnedAt: 'DESC' },
    });
  }

  async grantAchievement(userId: number, achievementId: number, metadata?: any): Promise<UserAchievement | null> {
    const existing = await this.userAchievementRepo.findOne({ where: { userId, achievementId } });
    if (existing) return existing;

    const achievement = await this.achievementRepo.findOne({ where: { id: achievementId } });
    if (!achievement) return null;

    const ua = await this.userAchievementRepo.save(
      this.userAchievementRepo.create({ userId, achievementId, earnedAt: new Date(), metadata }),
    );

    // Notify user
    await this.notificationsService.create(
      userId,
      NotificationType.ACHIEVEMENT,
      'Новое достижение!',
      `${achievement.icon} Вы получили достижение «${achievement.name}»: ${achievement.description} (+${achievement.points} очков)`,
      { achievementId: achievement.id, points: achievement.points },
    );

    return ua;
  }

  /** Grant achievement directly by type (for single-instance types like FIRST_REGISTRATION). */
  async grantAchievementByType(userId: number, type: AchievementType, metadata?: any): Promise<void> {
    const achievements = await this.achievementRepo.find({ where: { type, isActive: true } });
    for (const a of achievements) {
      await this.grantAchievement(userId, a.id, metadata);
    }
  }

  /** Check count-based achievements and grant those whose conditions are met. */
  async checkAndGrantAchievements(userId: number): Promise<UserAchievement[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        'submissions',
        'submissions.assignment',
        'forumPosts',
        'peerReviewsGiven',
        'courseRegistrations',
      ],
    });

    if (!user) throw new NotFoundException('User not found');

    const allAchievements = await this.findAllAchievements();
    const granted: UserAchievement[] = [];

    for (const achievement of allAchievements) {
      if (await this.checkConditions(user, achievement)) {
        const ua = await this.grantAchievement(userId, achievement.id);
        if (ua) granted.push(ua);
      }
    }

    return granted;
  }

  private async checkConditions(user: User, achievement: Achievement): Promise<boolean> {
    const c = achievement.conditions;

    switch (achievement.type) {
      case AchievementType.FIRST_REGISTRATION:
        return true; // Always granted directly on register; here just ensure it triggers

      case AchievementType.COURSE_REGISTRATION:
      case AchievementType.COURSE_COMPLETION: {
        const approved = (user.courseRegistrations || []).filter(r => r.status === 'approved').length;
        return approved >= (c.minRegistrations ?? c.minCourses ?? 1);
      }

      case AchievementType.FIRST_SUBMISSION: {
        const count = (user.submissions || []).length;
        return count >= (c.minSubmissions ?? 1);
      }

      case AchievementType.MULTIPLE_SUBMISSIONS: {
        const count = (user.submissions || []).length;
        return count >= (c.minSubmissions ?? 5);
      }

      case AchievementType.ASSIGNMENT_EXCELLENCE: {
        const excellent = (user.submissions || []).filter(
          s => s.finalScore != null && s.finalScore >= (c.minScore ?? 90),
        ).length;
        return excellent >= (c.minAssignments ?? 1);
      }

      case AchievementType.PERFECT_SCORE: {
        const perfect = (user.submissions || []).filter(
          s => s.finalScore != null && s.assignment && s.finalScore >= s.assignment.maxScore,
        ).length;
        return perfect >= (c.minPerfectScores ?? 1);
      }

      case AchievementType.PEER_REVIEWER: {
        const count = (user.peerReviewsGiven || []).length;
        return count >= (c.minReviews ?? 1);
      }

      case AchievementType.FORUM_CONTRIBUTOR: {
        const count = (user.forumPosts || []).length;
        return count >= (c.minPosts ?? 1);
      }

      case AchievementType.EARLY_BIRD:
      case AchievementType.HACKATHON_PARTICIPANT:
      case AchievementType.HACKATHON_WINNER:
      case AchievementType.OLYMPIAD_WINNER:
        return false; // Granted directly via grantAchievementByType

      default:
        return false;
    }
  }

  // ── Leaderboard ───────────────────────────────────────────────────

  async getLeaderboard(limit = 10): Promise<any[]> {
    const rows = await this.userAchievementRepo
      .createQueryBuilder('ua')
      .select('ua.userId', 'userId')
      .addSelect('SUM(a.points)', 'totalPoints')
      .addSelect('COUNT(ua.id)', 'achievementCount')
      .innerJoin('ua.achievement', 'a')
      .groupBy('ua.userId')
      .orderBy('totalPoints', 'DESC')
      .limit(limit)
      .getRawMany();

    const userIds = rows.map(r => r.userId);
    const users = await this.userRepo.findByIds(userIds);

    return rows.map(r => {
      const u = users.find(u => u.id === r.userId);
      return {
        user: u
          ? { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email }
          : { id: r.userId, firstName: 'Unknown', lastName: 'User', email: '' },
        totalPoints: parseInt(r.totalPoints) || 0,
        achievementCount: parseInt(r.achievementCount) || 0,
      };
    });
  }
}
