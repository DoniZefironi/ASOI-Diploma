import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Hackathon } from './entities/hackathon.entity';
import { HackathonTeam } from './entities/hackathon-team.entity';
import { HackathonTeamMember } from './entities/hackathon-team-member.entity';
import { HackathonProject } from './entities/hackathon-project.entity';
import { HackathonJury } from './entities/hackathon-jury.entity';
import { HackathonGrade } from './entities/hackathon-grade.entity';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { SubmitProjectDto } from './dto/submit-project.dto';
import { GradeProjectDto } from './dto/grade-project.dto';

export interface HackathonStats {
  totalHackathons: number;
  activeHackathons: number;
  totalParticipants: number;
  totalProjects: number;
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
    @InjectRepository(HackathonProject)
    private readonly projectRepo: Repository<HackathonProject>,
    @InjectRepository(HackathonJury)
    private readonly juryRepo: Repository<HackathonJury>,
    @InjectRepository(HackathonGrade)
    private readonly gradeRepo: Repository<HackathonGrade>,
  ) {}

  async createHackathon(dto: CreateHackathonDto): Promise<Hackathon> {
    const hackathon = this.hackathonRepo.create({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });
    return this.hackathonRepo.save(hackathon);
  }

  async findAll(): Promise<Hackathon[]> {
    return this.hackathonRepo.find({
      relations: ['teams', 'juryMembers'],
      order: { startDate: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Hackathon> {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id },
      relations: ['teams', 'teams.members', 'teams.members.user', 'juryMembers', 'juryMembers.user']
    });
    
    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }
    
    return hackathon;
  }

  async createTeam(dto: CreateTeamDto, captainId: number): Promise<HackathonTeam> {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: dto.hackathonId }
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    if (new Date() > hackathon.startDate) {
      throw new BadRequestException('Registration for this hackathon has ended');
    }

    if (dto.memberIds.length > hackathon.maxTeamSize) {
      throw new BadRequestException(`Team size cannot exceed ${hackathon.maxTeamSize} members`);
    }

    if (!dto.memberIds.includes(captainId)) {
      throw new BadRequestException('Captain must be a member of the team');
    }

    const existingMembers = await this.teamMemberRepo.find({
      where: {
        userId: In(dto.memberIds),
        team: { hackathonId: dto.hackathonId }
      },
      relations: ['team']
    });

    if (existingMembers.length > 0) {
      const conflictingUsers = existingMembers.map(member => member.userId);
      throw new BadRequestException(`Users ${conflictingUsers.join(', ')} are already in another team for this hackathon`);
    }

    const joinCode = this.generateJoinCode();
    const team = this.teamRepo.create({
      name: dto.name,
      hackathonId: dto.hackathonId,
      joinCode,
      status: 'pending'
    });

    const savedTeam = await this.teamRepo.save(team);

    const teamMembers = dto.memberIds.map((userId, index) => 
      this.teamMemberRepo.create({
        teamId: savedTeam.id,
        userId,
        role: index === 0 ? 'captain' : 'member' 
      })
    );

    await this.teamMemberRepo.save(teamMembers);

    const teamWithMembers = await this.teamRepo.findOne({
      where: { id: savedTeam.id },
      relations: ['members', 'members.user']
    });

    if (!teamWithMembers) {
      throw new NotFoundException('Team not found after creation');
    }

    return teamWithMembers;
  }

  async submitProject(dto: SubmitProjectDto, userId: number): Promise<HackathonProject> {
    const team = await this.teamRepo.findOne({
      where: { id: dto.teamId },
      relations: ['members', 'hackathon']
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const isMember = team.members.some(member => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    if (new Date() > team.hackathon.endDate) {
      throw new BadRequestException('Hackathon has ended');
    }

    let project = await this.projectRepo.findOne({
      where: { teamId: dto.teamId }
    });

    if (project) {
      project.name = dto.name;
      project.description = dto.description;
      if (dto.repositoryUrl !== undefined) project.repositoryUrl = dto.repositoryUrl;
      if (dto.presentationUrl !== undefined) project.presentationUrl = dto.presentationUrl;
      if (dto.demoUrl !== undefined) project.demoUrl = dto.demoUrl;
    } else {
      project = new HackathonProject();
      project.teamId = dto.teamId;
      project.name = dto.name;
      project.description = dto.description;
      project.repositoryUrl = dto.repositoryUrl || null;
      project.presentationUrl = dto.presentationUrl || null;
      project.demoUrl = dto.demoUrl || null;
      project.isSubmitted = false;
    }

    return this.projectRepo.save(project);
  }

  async finalizeProjectSubmission(teamId: number, userId: number): Promise<HackathonProject> {
    const team = await this.teamRepo.findOne({
      where: { id: teamId },
      relations: ['members', 'hackathon', 'project']
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (!team.project) {
      throw new BadRequestException('Project not submitted yet');
    }

    const isMember = team.members.some(member => member.userId === userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    team.project.isSubmitted = true;
    team.project.submittedAt = new Date();

    return this.projectRepo.save(team.project);
  }

  async gradeProject(projectId: number, juryId: number, dto: GradeProjectDto): Promise<HackathonGrade> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['team', 'team.hackathon']
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isJury = await this.juryRepo.findOne({
      where: {
        hackathonId: project.team.hackathonId,
        userId: juryId
      }
    });

    if (!isJury) {
      throw new ForbiddenException('You are not a jury member for this hackathon');
    }

    const existingGrade = await this.gradeRepo.findOne({
      where: {
        projectId,
        juryId
      }
    });

    if (existingGrade) {
      existingGrade.innovationScore = dto.innovationScore;
      existingGrade.technicalScore = dto.technicalScore;
      existingGrade.presentationScore = dto.presentationScore;
      existingGrade.usabilityScore = dto.usabilityScore;
      if (dto.comment !== undefined) existingGrade.comment = dto.comment;
      existingGrade.gradedAt = new Date();
      return this.gradeRepo.save(existingGrade);
    } else {
      const grade = new HackathonGrade();
      grade.projectId = projectId;
      grade.juryId = juryId;
      grade.innovationScore = dto.innovationScore;
      grade.technicalScore = dto.technicalScore;
      grade.presentationScore = dto.presentationScore;
      grade.usabilityScore = dto.usabilityScore;
      grade.comment = dto.comment || null;
      grade.gradedAt = new Date();

      return this.gradeRepo.save(grade);
    }
  }

  async getRankings(hackathonId: number): Promise<TeamRanking[]> {
    const hackathon = await this.hackathonRepo.findOne({
      where: { id: hackathonId },
      relations: ['teams', 'teams.project']
    });

    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
    }

    const rankings: TeamRanking[] = [];

    for (const team of hackathon.teams) {
      if (team.project && team.project.isSubmitted) {
        const grades = await this.gradeRepo.find({
          where: { projectId: team.project.id }
        });

        if (grades.length > 0) {
          const totalScore = grades.reduce((sum, grade) => 
            sum + Number(grade.innovationScore) + Number(grade.technicalScore) + 
                 Number(grade.presentationScore) + Number(grade.usabilityScore), 0
          );
          const averageScore = totalScore / (grades.length * 4); 

          rankings.push({
            teamId: team.id,
            teamName: team.name,
            projectName: team.project.name,
            averageScore: Number(averageScore.toFixed(2)),
            totalScore: Number(totalScore.toFixed(2))
          });
        }
      }
    }

    return rankings.sort((a, b) => b.averageScore - a.averageScore);
  }

  async getStats(): Promise<HackathonStats> {
    const totalHackathons = await this.hackathonRepo.count();
    const activeHackathons = await this.hackathonRepo.count({
      where: {
        status: 'active'
      }
    });
    const totalParticipants = await this.teamMemberRepo.count();
    const totalProjects = await this.projectRepo.count({
      where: {
        isSubmitted: true
      }
    });

    return {
      totalHackathons,
      activeHackathons,
      totalParticipants,
      totalProjects
    };
  }

  private generateJoinCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async updateHackathon(id: number, dto: Partial<CreateHackathonDto>): Promise<Hackathon> {
  const hackathon = await this.hackathonRepo.findOne({ where: { id } });
  if (!hackathon) {
    throw new NotFoundException('Hackathon not found');
  }

  Object.assign(hackathon, dto);
  if (dto.startDate) hackathon.startDate = new Date(dto.startDate);
  if (dto.endDate) hackathon.endDate = new Date(dto.endDate);

  return this.hackathonRepo.save(hackathon);
}

async deleteHackathon(id: number): Promise<void> {
  const hackathon = await this.hackathonRepo.findOne({ where: { id } });
  if (!hackathon) {
    throw new NotFoundException('Hackathon not found');
  }

  await this.hackathonRepo.remove(hackathon);
}

async approveTeam(teamId: number): Promise<HackathonTeam> {
  const team = await this.teamRepo.findOne({ where: { id: teamId } });
  if (!team) {
    throw new NotFoundException('Team not found');
  }

  team.status = 'approved';
  team.rejectionReason = null;
  return this.teamRepo.save(team);
}

async rejectTeam(teamId: number, reason: string): Promise<HackathonTeam> {
  const team = await this.teamRepo.findOne({ where: { id: teamId } });
  if (!team) {
    throw new NotFoundException('Team not found');
  }

  team.status = 'rejected';
  team.rejectionReason = reason;
  return this.teamRepo.save(team);
}

async addJury(hackathonId: number, userId: number): Promise<HackathonJury> {
  const hackathon = await this.hackathonRepo.findOne({ where: { id: hackathonId } });
  if (!hackathon) {
    throw new NotFoundException('Hackathon not found');
  }

  const existingJury = await this.juryRepo.findOne({
    where: { hackathonId, userId }
  });

  if (existingJury) {
    throw new BadRequestException('This user is already a jury member for this hackathon');
  }

  const jury = this.juryRepo.create({
    hackathonId,
    userId
  });

  return this.juryRepo.save(jury);
}

async removeJury(hackathonId: number, userId: number): Promise<void> {
  const jury = await this.juryRepo.findOne({
    where: { hackathonId, userId }
  });

  if (!jury) {
    throw new NotFoundException('Jury member not found');
  }

  await this.juryRepo.remove(jury);
}
}
