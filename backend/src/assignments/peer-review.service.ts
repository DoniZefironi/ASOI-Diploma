// src/assignments/peer-review.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeerReview } from './entities/peer-review.entity';
import { AssignmentSubmission, SubmissionStatus } from './entities/assignment-submission.entity';
import { CourseRegistration } from '../course-groups/entities/course-registration.entity';
import { CreatePeerReviewDto, AssignPeerReviewsDto } from './dto/create-peer-review.dto';
import { Assignment } from './entities/assignment.entity';
import { PeerReviewSession } from './entities/peer-review-session.entity';

@Injectable()
export class PeerReviewService {
  constructor(
    @InjectRepository(PeerReview)
    private peerReviewRepository: Repository<PeerReview>,
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(PeerReviewSession)
    private sessionRepository: Repository<PeerReviewSession>,
  ) {}

  /**
   * Назначает peer review для задания
   * Каждый студент получает N работ на проверку
   * Каждую работу проверяют N студентов (или меньше если студентов недостаточно)
   */
  async assignPeerReviews(assignmentId: number, reviewsPerStudent: number = 5) {
    // Проверяем существование задания
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['courseGroup'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Проверяем даты
    const now = new Date();
    if (assignment.peerReviewStartDate && now < assignment.peerReviewStartDate) {
      throw new BadRequestException('Период peer review ещё не начался');
    }
    if (assignment.peerReviewEndDate && now > assignment.peerReviewEndDate) {
      throw new BadRequestException('Период peer review завершён');
    }

    // Получаем все submission для этого задания
    const submissions = await this.submissionRepository.find({
      where: { assignmentId },
      relations: ['user'],
    });

    if (submissions.length < 2) {
      throw new BadRequestException('Недостаточно студентов для peer review (минимум 2)');
    }

    // Получаем всех студентов с их submission
    const studentSubmissions = submissions.map(s => ({
      userId: s.userId,
      submissionId: s.id,
    }));

    // Удаляем старые назначения для этого задания
    const subIds = studentSubmissions.map(s => s.submissionId);
    if (subIds.length > 0) {
      await this.peerReviewRepository
        .createQueryBuilder()
        .delete()
        .where('submissionId IN (:...ids)', { ids: subIds })
        .execute();
    }

    // Адаптируем количество рецензий под количество студентов
    const actualReviewsPerStudent = Math.min(reviewsPerStudent, studentSubmissions.length - 1);

    // Для каждого студента назначаем случайные работы на проверку
    for (const student of studentSubmissions) {
      // Фильтруем submission, которые студент ещё не проверял и не свою собственную
      const availableSubmissions = studentSubmissions.filter(
        s => s.userId !== student.userId
      );

      // Перемешиваем и берём первые N (или все если меньше)
      const shuffled = availableSubmissions.sort(() => 0.5 - Math.random());
      const selectedSubmissions = shuffled.slice(0, actualReviewsPerStudent);

      // Создаём peer reviews
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
      { assignmentId, status: SubmissionStatus.SUBMITTED },
      { status: SubmissionStatus.UNDER_REVIEW },
    );

    return { 
      success: true, 
      count: studentSubmissions.length * actualReviewsPerStudent,
      actualReviewsPerStudent,
      totalStudents: studentSubmissions.length,
    };
  }

  /**
   * Получает peer reviews для студента (которые он должен проверить)
   */
  async getReviewsToComplete(userId: number) {
    const reviews = await this.peerReviewRepository.find({
      where: { reviewerId: userId, isCompleted: false },
      relations: [
        'submission',
        'submission.user',
        'submission.assignment',
        'submission.assignment.courseGroup',
      ],
    });

    // Load peer review sessions for these assignments to get structured criteria
    const assignmentIds = [...new Set(reviews.map(r => r.submission.assignment.id))];
    const sessions = assignmentIds.length
      ? await this.sessionRepository.find({
          where: assignmentIds.map(id => ({ assignmentId: id, isActive: true })),
          order: { createdAt: 'DESC' },
        })
      : [];
    const sessionByAssignment = new Map(sessions.map(s => [s.assignmentId, s]));

    return reviews.map(review => {
      const session = sessionByAssignment.get(review.submission.assignment.id);
      return {
        id: review.id,
        reviewId: review.id,
        submissionId: review.submission.id,
        assignmentId: review.submission.assignment.id,
        assignmentTitle: review.submission.assignment.title,
        studentName: `${review.submission.user.firstName} ${review.submission.user.lastName}`,
        content: review.submission.content,
        repositoryUrl: review.submission.repositoryUrl,
        attachments: review.submission.attachments,
        isCompleted: review.isCompleted,
        score: review.score !== null ? Number(review.score) : null,
        criteriaScores: review.criteriaScores,
        feedback: review.feedback,
        criteria: session?.criteria ?? null,
        sessionId: session?.id ?? null,
      };
    });
  }

  /**
   * Получает peer reviews для submission студента (которые другие студенты проверяют)
   */
  async getReviewsForSubmission(userId: number, submissionId?: number) {
    const where: any = { submission: { userId } };
    if (submissionId) {
      where.submission = { id: submissionId };
    }

    const reviews = await this.peerReviewRepository.find({
      where,
      relations: ['reviewer', 'submission'],
    });

    return reviews.map(review => ({
      id: review.id,
      reviewerName: `${review.reviewer.firstName} ${review.reviewer.lastName}`,
      score: review.score,
      feedback: review.feedback,
      isCompleted: review.isCompleted,
      createdAt: review.createdAt,
    }));
  }

  /**
   * Создаёт или обновляет peer review
   */
  async createPeerReview(userId: number, dto: CreatePeerReviewDto) {
    // Проверяем что submission существует
    const submission = await this.submissionRepository.findOne({
      where: { id: dto.submissionId },
      relations: ['assignment'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Проверяем что пользователь назначен проверять эту работу
    const existingReview = await this.peerReviewRepository.findOne({
      where: {
        reviewerId: userId,
        submissionId: dto.submissionId,
      },
    });

    if (!existingReview) {
      throw new ForbiddenException('Вы не назначены для проверки этой работы');
    }

    // Вычисляем балл: либо из criteriaScores, либо из прямого score
    let totalScore: number | null = null;

    if (dto.criteriaScores && dto.criteriaScores.length > 0) {
      totalScore = dto.criteriaScores.reduce((sum, c) => sum + (Number(c.score) || 0), 0);
      existingReview.criteriaScores = dto.criteriaScores;
    } else if (dto.score !== undefined && dto.score !== null) {
      totalScore = Number(dto.score);
    }

    if (totalScore === null) {
      throw new BadRequestException('Необходимо указать оценку по критериям или общий балл');
    }

    existingReview.score = totalScore;
    existingReview.feedback = dto.feedback?.trim() || '';
    existingReview.isCompleted = true;

    const savedReview = await this.peerReviewRepository.save(existingReview);

    // Пересчитываем средний балл по всем завершённым рецензиям на эту работу
    const allReviews = await this.peerReviewRepository.find({
      where: { submissionId: dto.submissionId },
    });
    const completed = allReviews.filter(r => r.isCompleted && r.score !== null);

    if (completed.length > 0) {
      const avgScore = completed.reduce((sum, r) => sum + Number(r.score), 0) / completed.length;
      const roundedAvg = Math.round(avgScore * 100) / 100;

      await this.submissionRepository.update(dto.submissionId, {
        finalScore: Math.round(avgScore),
        status: allReviews.every(r => r.isCompleted)
          ? SubmissionStatus.REVIEWED
          : SubmissionStatus.UNDER_REVIEW,
      });
    }

    return savedReview;
  }

  /**
   * Получает все рецензии которые студент получил на свои работы
   */
  async getMyReceivedReviews(userId: number) {
    const submissions = await this.submissionRepository.find({
      where: { userId },
      relations: ['assignment', 'peerReviewsReceived'],
    });

    return submissions
      .filter(s => s.peerReviewsReceived && s.peerReviewsReceived.length > 0)
      .map(s => ({
        submissionId: s.id,
        assignmentId: s.assignment?.id,
        assignmentTitle: s.assignment?.title,
        finalScore: s.finalScore,
        status: s.status,
        reviews: s.peerReviewsReceived
          .filter(r => r.isCompleted)
          .map(r => ({
            id: r.id,
            score: r.score !== null ? Number(r.score) : null,
            criteriaScores: r.criteriaScores,
            feedback: r.feedback,
            createdAt: r.createdAt,
          })),
        totalReviews: s.peerReviewsReceived.length,
        completedReviews: s.peerReviewsReceived.filter(r => r.isCompleted).length,
      }));
  }

  /**
   * Получает статистику peer review для ментора
   */
  async getPeerReviewStats(assignmentId: number) {
    const submissions = await this.submissionRepository.find({
      where: { assignmentId },
      relations: ['user', 'peerReviewsReceived'],
    });

    const stats = submissions.map(submission => ({
      submissionId: submission.id,
      studentName: `${submission.user.firstName} ${submission.user.lastName}`,
      totalReviews: submission.peerReviewsReceived?.length || 0,
      completedReviews: submission.peerReviewsReceived?.filter(r => r.isCompleted).length || 0,
      averageScore: submission.peerReviewsReceived?.filter(r => r.isCompleted && r.score).length
        ? submission.peerReviewsReceived
            .filter(r => r.isCompleted && r.score)
            .reduce((sum, r) => sum + r.score, 0) /
          submission.peerReviewsReceived.filter(r => r.isCompleted && r.score).length
        : null,
    }));

    return stats;
  }
}
