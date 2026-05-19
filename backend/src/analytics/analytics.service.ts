import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { SiteVisit } from './entities/site-visit.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(SiteVisit)
    private readonly visitRepo: Repository<SiteVisit>,
  ) {}

  async track(path: string, userId?: number, userDisplayName?: string): Promise<void> {
    // Skip admin and API paths
    if (path.startsWith('/admin') || path.startsWith('/api')) return;
    await this.visitRepo.save(this.visitRepo.create({ path, userId, userDisplayName }));
  }

  async getStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start7d = new Date(now.getTime() - 7 * 86400000);
    const start30d = new Date(now.getTime() - 30 * 86400000);

    const [totalAll, totalToday, total7d, total30d] = await Promise.all([
      this.visitRepo.count(),
      this.visitRepo.count({ where: { visitedAt: MoreThanOrEqual(startOfToday) } }),
      this.visitRepo.count({ where: { visitedAt: MoreThanOrEqual(start7d) } }),
      this.visitRepo.count({ where: { visitedAt: MoreThanOrEqual(start30d) } }),
    ]);

    // Unique users (last 30d)
    const uniqueUsers30d = await this.visitRepo
      .createQueryBuilder('v')
      .select('COUNT(DISTINCT v.userId)', 'count')
      .where('v.visitedAt >= :from', { from: start30d })
      .andWhere('v.userId IS NOT NULL')
      .getRawOne();

    // Top pages (last 30d)
    const topPages = await this.visitRepo
      .createQueryBuilder('v')
      .select('v.path', 'path')
      .addSelect('COUNT(*)', 'visits')
      .where('v.visitedAt >= :from', { from: start30d })
      .groupBy('v.path')
      .orderBy('visits', 'DESC')
      .limit(15)
      .getRawMany();

    // Visits per day (last 30d)
    const dailyVisits = await this.visitRepo
      .createQueryBuilder('v')
      .select("DATE_TRUNC('day', v.visitedAt)", 'day')
      .addSelect('COUNT(*)', 'visits')
      .addSelect('COUNT(DISTINCT v.userId)', 'uniqueUsers')
      .where('v.visitedAt >= :from', { from: start30d })
      .groupBy("DATE_TRUNC('day', v.visitedAt)")
      .orderBy('day', 'ASC')
      .getRawMany();

    // Recent visits
    const recentVisits = await this.visitRepo.find({
      order: { visitedAt: 'DESC' },
      take: 50,
    });

    return {
      summary: {
        totalAll,
        totalToday,
        total7d,
        total30d,
        uniqueUsers30d: parseInt(uniqueUsers30d?.count ?? '0', 10),
      },
      topPages: topPages.map(r => ({ path: r.path, visits: parseInt(r.visits, 10) })),
      dailyVisits: dailyVisits.map(r => ({
        day: r.day,
        visits: parseInt(r.visits, 10),
        uniqueUsers: parseInt(r.uniqueUsers, 10),
      })),
      recentVisits: recentVisits.map(v => ({
        path: v.path,
        userId: v.userId,
        userDisplayName: v.userDisplayName,
        visitedAt: v.visitedAt,
      })),
    };
  }

  async getAllForExport() {
    return this.visitRepo.find({ order: { visitedAt: 'DESC' } });
  }
}
