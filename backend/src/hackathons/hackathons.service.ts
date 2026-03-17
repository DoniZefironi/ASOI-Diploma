import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Hackathon } from './entities/hackathon.entity';
import { HackathonTeam } from './entities/hackathon-team.entity';
import { HackathonTeamMember } from './entities/hackathon-team-member.entity';
import { HackathonSubmission } from './entities/hackathon-submission.entity';
import { HackathonGrade } from './entities/hackathon-grade.entity';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SubmitProjectDto } from './dto/submit-project.dto';
import { GradeProjectDto } from './dto/grade-project.dto';
import { SearchDto, SortOrder } from '../common/dto/pagination.dto';

export interface HackathonStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalSubmissions: number;
}

export interface TeamRanking {
  teamId: number;
  teamName: string;
  projectName: string;
  averageScore: number;
  totalScore: number;
}

@Injectable()
export class HackathonsService {
  constructor(
    @InjectRepository(Hackathon)
    private readonly hackathonRepo: Repository<Hackathon>,
    @InjectRepository(HackathonTeam)
    private readonly teamRepo: Repository<HackathonTeam>,
    @InjectRepository(HackathonTeamMember)
    private readonly teamMemberRepo: Repository<HackathonTeamMember>,
    @InjectRepository(HackathonSubmission)
    private readonly submissionRepo: Repository<HackathonSubmission>,
    @InjectRepository(HackathonGrade)
    private readonly gradeRepo: Repository<HackathonGrade>,
  ) {}

  async createHackathon(dto: CreateHackathonDto): Promise<Hackathon> {
    const hackathon = this.hackathonRepo.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      registrationDeadline: dto.registrationDeadline ? new Date(dto.registrationDeadline) : null,
    });
    return await this.hackathonRepo.save(hackathon);
  }

  async findAll(searchDto?: SearchDto): Promise<Hackathon[]> {
    const { search, sortBy = 'startDate', sortOrder = SortOrder.DESC, page = 1, limit = 10 } = searchDto || {};

    const where: any = {};

    // Поиск по названию
    if (search) {
      where.title = Like(`%${search}%`);
    }

    // Сортировка
    const order: any = {};
    order[sortBy] = sortOrder;

    return this.hackathonRepo.find({
      where,
      relations: ['course', 'teams'],
      order,
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async findOne(id: number): Promise<Hackathon> {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id },
      relations: ['course', 'teams', 'teams.members', 'teams.members.user', 'teams.submissions', 'teams.submissions.grades'],
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    return hackathon;
  }

  async createTeam(dto: CreateTeamDto, leaderId: number): Promise<HackathonTeam> {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: dto.hackathonId }
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    const now = new Date();
    if (hackathon.registrationDeadline && now > hackathon.registrationDeadline) {
      throw new BadRequestException('Registration deadline has passed');
    }

    if (now > hackathon.startDate) {
      throw new BadRequestException('Hackathon has already started');
    }

    // Проверка: лидер должен быть в команде
    if (!dto.memberIds.includes(leaderId)) {
      throw new BadRequestException('Leader must be a member of the team');
    }

    // Проверка: пользователь уже в другой команде этого хакатона
    const existingMembers = await this.teamMemberRepo.find({
      where: {
        userId: In(dto.memberIds),
        team: { hackathonId: dto.hackathonId }
      },
      relations: ['team']
    });

    if (existingMembers.length > 0) {
      const conflictingUsers = existingMembers.map(m => m.userId);
      throw new BadRequestException(`Users ${conflictingUsers.join(', ')} are already in another team`);
    }

    const team = new HackathonTeam() as HackathonTeam;
    team.name = dto.name;
    team.hackathonId = dto.hackathonId;
    team.leaderId = leaderId;
    team.status = 'forming';
    team.projectName = dto.projectName ?? null;
    team.projectDescription = dto.projectDescription ?? null;

    const savedTeam = await this.teamRepo.save(team);

    // Добавляем участников
    const teamMembers = dto.memberIds.map((userId) => {
      const member = new HackathonTeamMember() as HackathonTeamMember;
      member.teamId = savedTeam.id;
      member.userId = userId;
      member.role = userId === leaderId ? 'leader' : 'member';
      return member;
    });

    await this.teamMemberRepo.save(teamMembers);

    const result = await this.teamRepo.findOne({
      where: { id: savedTeam.id },
      relations: ['members', 'members.user']
    });

    if (!result) {
      throw new NotFoundException('Team not found after creation');
    }

    return result;
  }

  async joinTeam(teamId: number, userId: number): Promise<HackathonTeam> {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['hackathon', 'members']
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Проверка: хакатон ещё принимает регистрации
    const now = new Date();
    if (team.hackathon.registrationDeadline && now > team.hackathon.registrationDeadline) {
      throw new BadRequestException('Registration deadline has passed');
    }

    // Проверка: пользователь ещё не в команде
    const existingMember = await this.teamMemberRepo.findOne({
      where: { teamId, userId }
    });

    if (existingMember) {
      throw new BadRequestException('User is already in this team');
    }

    // Проверка: пользователь не в другой команде этого хакатона
    const otherTeam = await this.teamMemberRepo.findOne({
      where: {
        userId,
        team: { hackathonId: team.hackathonId }
      }
    });

    if (otherTeam) {
      throw new BadRequestException('User is already in another team for this hackathon');
    }

    // Проверка: размер команды
    if (team.members.length >= team.hackathon.maxTeamSize) {
      throw new BadRequestException(`Team is full (max ${team.hackathon.maxTeamSize} members)`);
    }

    const member = new HackathonTeamMember() as HackathonTeamMember;
    member.teamId = teamId;
    member.userId = userId;
    member.role = 'member';

    await this.teamMemberRepo.save(member);

    const result = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['members', 'members.user']
    });

    if (!result) {
      throw new NotFoundException('Team not found');
    }

    return result;
  }

  async submitProject(dto: SubmitProjectDto, teamId: number, userId: number): Promise<HackathonSubmission> {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['hackathon', 'members']
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Проверка: только лидер команды может сдать проект
    if (team.leaderId !== userId) {
      throw new ForbiddenException('Only the team leader can submit the project');
    }

    const now = new Date();
    if (now < team.hackathon.startDate) {
      throw new BadRequestException('Hackathon has not started yet');
    }
    if (now > team.hackathon.endDate) {
      throw new BadRequestException('Hackathon has ended');
    }

    // Проверяем есть ли уже submission
    const existingSubmission = await this.submissionRepo.findOne({
      where: { teamId }
    });

    if (existingSubmission) {
      // Обновляем существующую submission
      existingSubmission.circuitProjectId = dto.circuitProjectId ?? null;
      existingSubmission.documentationUrl = dto.documentationUrl ?? null;
      existingSubmission.presentationUrl = dto.presentationUrl ?? null;
      existingSubmission.videoDemoUrl = dto.videoDemoUrl ?? null;
      existingSubmission.sourceCodeUrl = dto.sourceCodeUrl ?? null;
      existingSubmission.archiveUrl = dto.archiveUrl ?? existingSubmission.archiveUrl;
      existingSubmission.submissionNote = dto.submissionNote ?? null;

      return await this.submissionRepo.save(existingSubmission);
    } else {
      // Создаём новую submission
      const submission = new HackathonSubmission() as HackathonSubmission;
      submission.teamId = teamId;
      submission.circuitProjectId = dto.circuitProjectId ?? null;
      submission.documentationUrl = dto.documentationUrl ?? null;
      submission.presentationUrl = dto.presentationUrl ?? null;
      submission.videoDemoUrl = dto.videoDemoUrl ?? null;
      submission.sourceCodeUrl = dto.sourceCodeUrl ?? null;
      submission.archiveUrl = dto.archiveUrl ?? null;
      submission.submissionNote = dto.submissionNote ?? null;

      return await this.submissionRepo.save(submission);
    }
  }

  async gradeSubmission(submissionId: number, judgeId: number, dto: GradeProjectDto): Promise<HackathonGrade> {
    const submission = await this.submissionRepo.findOne({
      where: { id: submissionId },
      relations: ['team', 'team.hackathon']
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Вычисляем общий балл
    const totalScore = (Number(dto.innovationScore) || 0) +
                       (Number(dto.functionalityScore) || 0) +
                       (Number(dto.presentationScore) || 0) +
                       (Number(dto.teamworkScore) || 0);

    const grade = new HackathonGrade() as HackathonGrade;
    grade.submissionId = submissionId;
    grade.judgeId = judgeId;
    grade.innovationScore = dto.innovationScore ?? null;
    grade.functionalityScore = dto.functionalityScore ?? null;
    grade.presentationScore = dto.presentationScore ?? null;
    grade.teamworkScore = dto.teamworkScore ?? null;
    grade.totalScore = totalScore ?? null;
    grade.feedback = dto.feedback ?? null;
    grade.judgingCriteriaScores = dto.judgingCriteriaScores ?? null;

    return await this.gradeRepo.save(grade);
  }

  async getRankings(hackathonId: number): Promise<TeamRanking[]> {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
      relations: ['teams', 'teams.submissions', 'teams.submissions.grades']
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    const rankings: TeamRanking[] = [];

    for (const team of hackathon.teams) {
      if (team.submissions && team.submissions.length > 0) {
        const allGrades = team.submissions.flatMap(s => s.grades || []);
        
        if (allGrades.length > 0) {
          const totalScore = allGrades.reduce((sum, g) => sum + (Number(g.totalScore) || 0), 0);
          const averageScore = totalScore / allGrades.length;

          rankings.push({
            teamId: team.id,
            teamName: team.name,
            projectName: team.projectName || 'Без названия',
            totalScore: Math.round(totalScore * 100) / 100,
            averageScore: Math.round(averageScore * 100) / 100,
          });
        }
      }
    }

    return rankings.sort((a, b) => b.totalScore - a.totalScore);
  }

  async getStats(): Promise<HackathonStats> {
    const totalHackathons = await this.hackathonRepo.count();
    const activeHackathons = await this.hackathonRepo.count({
      where: { isActive: true }
    });
    const totalParticipants = await this.teamMemberRepo.count();
    const totalSubmissions = await this.submissionRepo.count();

    return {
      totalHackathons,
      activeHackathons,
      totalParticipants,
      totalSubmissions
    };
  }

  async updateHackathon(id: number, dto: Partial<CreateHackathonDto>): Promise<Hackathon> {
    const hackathon = await this.hackathonRepo.findOne({ where: { id } });
    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    Object.assign(hackathon, dto);
    if (dto.startDate) hackathon.startDate = new Date(dto.startDate);
    if (dto.endDate) hackathon.endDate = new Date(dto.endDate);
    if (dto.registrationDeadline) hackathon.registrationDeadline = new Date(dto.registrationDeadline);

    return this.hackathonRepo.save(hackathon);
  }

  async deleteHackathon(id: number): Promise<void> {
    const hackathon = await this.hackathonRepo.findOne({ where: { id } });
    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }
    await this.hackathonRepo.remove(hackathon);
  }

  async updateTeamStatus(teamId: number, status: string): Promise<HackathonTeam> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    team.status = status;
    return this.teamRepo.save(team);
  }

  async leaveTeam(teamId: number, userId: number): Promise<void> {
    const member = await this.teamMemberRepo.findOne({
      where: { teamId, userId }
    });

    if (!member) {
      throw new NotFoundException('You are not in this team');
    }

    if (member.role === 'leader') {
      throw new BadRequestException('Leader cannot leave the team. Transfer leadership first.');
    }

    await this.teamMemberRepo.remove(member);
  }

  async transferLeadership(teamId: number, newLeaderId: number, currentUserId: number): Promise<HackathonTeam> {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['members']
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.leaderId !== currentUserId) {
      throw new ForbiddenException('Only the team leader can transfer leadership');
    }

    const newLeader = await this.teamMemberRepo.findOne({
      where: { teamId, userId: newLeaderId }
    });

    if (!newLeader) {
      throw new NotFoundException('User is not in this team');
    }

    // Старый лидер становится обычным участником
    const oldLeader = await this.teamMemberRepo.findOne({
      where: { teamId, role: 'leader' }
    });

    if (oldLeader) {
      oldLeader.role = 'member';
      await this.teamMemberRepo.save(oldLeader);
    }

    // Новый лидер
    newLeader.role = 'leader';
    await this.teamMemberRepo.save(newLeader);

    team.leaderId = newLeaderId;
    return this.teamRepo.save(team);
  }

  async getTeam(teamId: number): Promise<HackathonTeam> {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['hackathon', 'members', 'members.user', 'submissions', 'submissions.grades'],
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  async getUserTeams(userId: number): Promise<HackathonTeam[]> {
    return this.teamRepo.find({
      where: { members: { userId } },
      relations: ['hackathon', 'members', 'members.user', 'submissions', 'submissions.grades']
    });
  }

  async getUserSubmissions(userId: number): Promise<HackathonSubmission[]> {
    return this.submissionRepo.find({
      where: { team: { members: { userId } } },
      relations: ['team', 'team.hackathon', 'grades']
    });
  }

  async getTeamSubmissionForReview(teamId: number): Promise<HackathonSubmission | null> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return this.submissionRepo.findOne({
      where: { teamId },
      relations: ['team', 'team.members', 'team.members.user', 'grades'],
    });
  }

  async getTeamSubmission(teamId: number, userId: number): Promise<HackathonSubmission | null> {
    // Проверка: пользователь является частью команды
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['members']
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const isMember = team.members?.some(m => m.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    return await this.submissionRepo.findOne({
      where: { teamId },
      relations: ['team', 'grades']
    });
  }
}
