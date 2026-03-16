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
    criteria?: string;
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

  async assignPeerReviews(sessionId: number): Promise<any> {
    const session = await this.findById(sessionId);

    // Проверяем даты
    const now = new Date();
    if (now < session.startDate) {
      throw new BadRequestException('Период peer review ещё не начался');
    }
    if (now > session.endDate) {
      throw new BadRequestException('Период peer review завершён');
    }

    // Получаем все submission для этого задания
    const submissions = await this.submissionRepository.find({
      where: { assignmentId: session.assignmentId },
      relations: ['user'],
    });

    if (submissions.length < 2) {
      throw new BadRequestException('Недостаточно студентов для peer review (минимум 2)');
    }

    const studentSubmissions = submissions.map(s => ({
      userId: s.userId,
      submissionId: s.id,
    }));

    // Удаляем старые назначения для этой сессии
    await this.peerReviewRepository.delete({
      submission: { assignmentId: session.assignmentId },
    });

    // Адаптируем количество рецензий под количество студентов
    const actualReviewsPerStudent = Math.min(session.reviewsPerStudent, studentSubmissions.length - 1);

    // Для каждого студента назначаем случайные работы на проверку
    for (const student of studentSubmissions) {
      const availableSubmissions = studentSubmissions.filter(
        s => s.userId !== student.userId
      );

      const shuffled = availableSubmissions.sort(() => 0.5 - Math.random());
      const selectedSubmissions = shuffled.slice(0, actualReviewsPerStudent);

      for (const selected of selectedSubmissions) {
        const peerReview = this.peerReviewRepository.create({
          reviewerId: student.userId,
          submissionId: selected.submissionId,
          isCompleted: false,
        });
        await this.peerReviewRepository.save(peerReview);
      }
    }

    // Обновляем статус submission на "under_review"
    await this.submissionRepository.update(
      { assignmentId: session.assignmentId, status: SubmissionStatus.SUBMITTED },
      { status: SubmissionStatus.UNDER_REVIEW },
    );

    return { 
      success: true, 
      count: studentSubmissions.length * actualReviewsPerStudent,
      actualReviewsPerStudent,
      totalStudents: studentSubmissions.length,
    };
  }

  async updateSession(id: number, dto: Partial<PeerReviewSession>): Promise<PeerReviewSession> {
    await this.sessionRepository.update(id, dto);
    return this.findById(id);
  }

  async deleteSession(id: number): Promise<void> {
    await this.sessionRepository.delete(id);
  }
}
