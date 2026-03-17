// src/assignments/assignments.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Assignment, AssignmentType } from './entities/assignment.entity';
import { AssignmentSubmission, SubmissionStatus } from './entities/assignment-submission.entity';
import { PeerReview } from './entities/peer-review.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CreatePeerReviewDto } from './dto/create-peer-review.dto';
import { CourseRegistration, RegistrationStatus } from '../course-groups/entities/course-registration.entity';
import { AssignmentSearchDto, SortOrder } from '../common/dto/pagination.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentSubmission)
    private submissionRepository: Repository<AssignmentSubmission>,
    @InjectRepository(PeerReview)
    private peerReviewRepository: Repository<PeerReview>,
    @InjectRepository(CourseRegistration)
    private registrationRepository: Repository<CourseRegistration>,
  ) {}

  async createAssignment(createAssignmentDto: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentRepository.create(createAssignmentDto);
    return this.assignmentRepository.save(assignment);
  }

  async findAllAssignments(searchDto?: AssignmentSearchDto): Promise<Assignment[]> {
    const { search, type, startDate, endDate, sortBy = 'deadline', sortOrder = SortOrder.DESC, page = 1, limit = 10 } = searchDto || {};

    const where: any = {};

    // Поиск по названию
    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Фильтр по типу
    if (type) {
      where.type = type;
    }

    // Фильтр по дате
    if (startDate || endDate) {
      where.deadline = {};
      if (startDate) where.deadline.gte = new Date(startDate);
      if (endDate) where.deadline.lte = new Date(endDate);
    }

    // Сортировка
    const order: any = {};
    order[sortBy] = sortOrder;

    return this.assignmentRepository.find({
      where,
      relations: ['courseGroup', 'courseGroup.course'],
      order,
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findAssignmentById(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['courseGroup', 'courseGroup.course', 'submissions'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async updateAssignment(id: number, updateAssignmentDto: UpdateAssignmentDto): Promise<Assignment> {
    await this.assignmentRepository.update(id, updateAssignmentDto);
    return this.findAssignmentById(id);
  }

  async removeAssignment(id: number): Promise<void> {
    await this.assignmentRepository.delete(id);
  }

  async getCourseGroupAssignments(courseGroupId: number): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      where: { courseGroupId },
      relations: ['courseGroup', 'submissions'],
      order: { createdAt: 'DESC' },
    });
  }

  async createSubmission(createSubmissionDto: CreateSubmissionDto, userId: number): Promise<AssignmentSubmission> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: createSubmissionDto.assignmentId },
      relations: ['courseGroup'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const registration = await this.registrationRepository.findOne({
      where: {
        userId,
        courseGroupId: assignment.courseGroupId,
        status: RegistrationStatus.APPROVED,
      },
    });

    if (!registration) {
      throw new ForbiddenException('You are not registered for this course group');
    }

    if (new Date() > assignment.deadline) {
      throw new ConflictException('Assignment deadline has passed');
    }

    const submission = this.submissionRepository.create({
      ...createSubmissionDto,
      userId,
      status: SubmissionStatus.SUBMITTED,
      submittedAt: new Date(),
    });

    return this.submissionRepository.save(submission);
  }

  async getSubmissionById(id: number): Promise<AssignmentSubmission> {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: ['assignment', 'user', 'peerReviewsReceived', 'peerReviewsReceived.reviewer'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  async getUserSubmissions(userId: number, assignmentId?: number): Promise<AssignmentSubmission[]> {
    const where: any = { userId };
    if (assignmentId) {
      where.assignmentId = assignmentId;
    }

    return this.submissionRepository.find({
      where,
      relations: ['assignment', 'assignment.courseGroup'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAssignmentSubmissions(assignmentId: number, userId?: number): Promise<AssignmentSubmission[]> {
    // Если передан userId (студент) - возвращаем только его submission
    // Если нет (ментор) - возвращаем все submission
    if (userId) {
      return this.submissionRepository.find({
        where: { assignmentId, userId },
        relations: ['user', 'peerReviewsReceived'],
        order: { createdAt: 'DESC' },
      });
    } else {
      return this.submissionRepository.find({
        where: { assignmentId },
        relations: ['user', 'peerReviewsReceived'],
        order: { createdAt: 'DESC' },
      });
    }
  }

  async createPeerReview(createPeerReviewDto: CreatePeerReviewDto, reviewerId: number): Promise<PeerReview> {
    const submission = await this.submissionRepository.findOne({
      where: { id: createPeerReviewDto.submissionId },
      relations: ['assignment', 'assignment.courseGroup'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const reviewerRegistration = await this.registrationRepository.findOne({
      where: {
        userId: reviewerId,
        courseGroupId: submission.assignment.courseGroupId,
        status: RegistrationStatus.APPROVED,
      },
    });

    if (!reviewerRegistration) {
      throw new ForbiddenException('You are not registered for this course group');
    }

    if (submission.userId === reviewerId) {
      throw new ConflictException('You cannot review your own submission');
    }

    const existingReview = await this.peerReviewRepository.findOne({
      where: {
        submissionId: createPeerReviewDto.submissionId,
        reviewerId,
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this submission');
    }

    const peerReview = this.peerReviewRepository.create({
      ...createPeerReviewDto,
      reviewerId,
    });

    submission.status = SubmissionStatus.UNDER_REVIEW;
    await this.submissionRepository.save(submission);

    return this.peerReviewRepository.save(peerReview);
  }

  async calculateFinalGrade(submissionId: number): Promise<AssignmentSubmission> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['peerReviewsReceived', 'assignment'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const reviews = submission.peerReviewsReceived;
    if (reviews.length === 0) {
      throw new ConflictException('No peer reviews available for this submission');
    }

    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    const averageScore = totalScore / reviews.length;

    submission.finalScore = Math.round(averageScore);
    submission.status = SubmissionStatus.GRADED;

    return this.submissionRepository.save(submission);
  }

  async getCourseGroupGrades(courseGroupId: number) {
    const assignments = await this.assignmentRepository.find({
      where: { courseGroupId },
      relations: ['submissions', 'submissions.user'],
    });

    const registrations = await this.registrationRepository.find({
      where: { 
        courseGroupId,
        status: RegistrationStatus.APPROVED 
      },
      relations: ['user'],
    });

    const grades = registrations.map(registration => {
      const user = registration.user;
      const userSubmissions = assignments.flatMap(assignment =>
        assignment.submissions.filter(submission => submission.userId === user.id)
      );

      const totalScore = userSubmissions.reduce((sum, submission) => sum + (submission.finalScore || 0), 0);
      const averageScore = userSubmissions.length > 0 ? totalScore / userSubmissions.length : 0;

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        submissions: userSubmissions.map(submission => ({
          assignmentId: submission.assignmentId,
          assignmentTitle: assignments.find(a => a.id === submission.assignmentId)?.title,
          score: submission.finalScore,
          status: submission.status,
        })),
        totalScore,
        averageScore: Math.round(averageScore * 100) / 100,
      };
    });

    return {
      assignments: assignments.map(a => ({ id: a.id, title: a.title, maxScore: a.maxScore })),
      grades: grades.sort((a, b) => b.averageScore - a.averageScore),
    };
  }
}