// src/assignments/peer-review-session.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeerReviewSession } from './entities/peer-review-session.entity';
import { AssignmentSubmission, SubmissionStatus } from './entities/assignment-submission.entity';
import { PeerReview } from './entities/peer-review.entity';

@Injectable()
export class PeerReviewSessionService {
  constructor(
    @InjectRepository(PeerReviewSession)
    private sessionRepository: Repository<PeerReviewSession>,
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(PeerReview)
    private peerReviewRepository: Repository<PeerReview>,
  ) {}

  async createSession(dto: {
    assignmentId: number;
    courseGroupId: number;
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    reviewsPerStudent: number;
    criteria?: { name: string; maxScore: number; description?: string }[];
  }): Promise<PeerReviewSession> {
    const session = this.sessionRepository.create(dto);
    return this.sessionRepository.save(session);
  }

  async findAll(): Promise<PeerReviewSession[]> {
    return this.sessionRepository.find({
      relations: ['assignment', 'courseGroup'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<PeerReviewSession> {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['assignment', 'courseGroup'],
    });

    if (!session) {
      throw new NotFoundException('Peer review session not found');
    }

    return session;
  }

  async findByAssignmentId(assignmentId: number): Promise<PeerReviewSession[]> {
    return this.sessionRepository.find({
      where: { assignmentId },
      relations: ['assignment', 'courseGroup'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Calculates reviewsPerStudent based on submission count:
   *  < 100  → 2
   *  < 150  → 3
   *  < 200  → 4
   *  >= 200 → 5
   */
  private calcReviewsPerStudent(count: number): number {
    if (count < 100) return 2;
    if (count < 150) return 3;
    if (count < 200) return 4;
    return 5;
  }

  async assignPeerReviews(sessionId: number): Promise<any> {
    const session = await this.findById(sessionId);

    // Получаем все submission для этого задания
    const submissions = await this.submissionRepository.find({
      where: { assignmentId: session.assignmentId },
      relations: ['user'],
    });

    if (submissions.length < 2) {
      throw new BadRequestException('Недостаточно студентов для peer review (минимум 2)');
    }

    // Shuffle submissions for randomness, then apply circular rotation for balance
    const studentSubmissions = submissions
      .map(s => ({ userId: s.userId, submissionId: s.id }))
      .sort(() => 0.5 - Math.random());

    const k = studentSubmissions.length;
    const reviewsPerStudent = this.calcReviewsPerStudent(k);
    const actualReviewsPerStudent = Math.min(reviewsPerStudent, k - 1);

    // Удаляем старые назначения для этой сессии
    const submissionIds = studentSubmissions.map(s => s.submissionId);
    if (submissionIds.length > 0) {
      await this.peerReviewRepository
        .createQueryBuilder()
        .delete()
        .where('submissionId IN (:...ids)', { ids: submissionIds })
        .execute();
    }

    // Circular rotation: submission[i] is reviewed by submission[(i+1)%k], (i+2)%k, ...
    // This guarantees every reviewer reviews exactly `actualReviewsPerStudent` submissions
    // and every submission receives exactly `actualReviewsPerStudent` reviews.
    const pairs: { reviewerId: number; submissionId: number }[] = [];
    for (let i = 0; i < k; i++) {
      for (let offset = 1; offset <= actualReviewsPerStudent; offset++) {
        const reviewerIdx = (i + offset) % k;
        pairs.push({
          reviewerId: studentSubmissions[reviewerIdx].userId,
          submissionId: studentSubmissions[i].submissionId,
        });
      }
    }

    const reviews = pairs.map(p => this.peerReviewRepository.create({ ...p, isCompleted: false }));
    await this.peerReviewRepository.save(reviews);

    // Обновляем статус submission на "under_review"
    await this.submissionRepository.update(
      { assignmentId: session.assignmentId, status: SubmissionStatus.SUBMITTED },
      { status: SubmissionStatus.UNDER_REVIEW },
    );

    await this.sessionRepository.update(session.id, { isDistributed: true, reviewsPerStudent: actualReviewsPerStudent });

    return {
      success: true,
      count: pairs.length,
      actualReviewsPerStudent,
      totalStudents: k,
    };
  }

  async getSessionStats(sessionId: number) {
    const session = await this.findById(sessionId);

    const submissions = await this.submissionRepository.find({
      where: { assignmentId: session.assignmentId },
      relations: ['user', 'peerReviewsReceived'],
    });

    return submissions.map(sub => {
      const reviews = sub.peerReviewsReceived || [];
      const completed = reviews.filter(r => r.isCompleted);
      const avgScore = completed.length
        ? Math.round(completed.reduce((s, r) => s + Number(r.score || 0), 0) / completed.length * 10) / 10
        : null;

      return {
        submissionId: sub.id,
        studentName: `${sub.user.firstName} ${sub.user.lastName}`,
        totalReviews: reviews.length,
        completedReviews: completed.length,
        averageScore: avgScore,
        finalScore: sub.finalScore,
        status: sub.status,
      };
    });
  }

  async updateSession(id: number, dto: Partial<PeerReviewSession>): Promise<PeerReviewSession> {
    await this.sessionRepository.update(id, dto);
    return this.findById(id);
  }

  async deleteSession(id: number): Promise<void> {
    await this.sessionRepository.delete(id);
  }
}
