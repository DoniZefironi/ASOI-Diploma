// src/circuit/circuit.controller.ts
import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CircuitService } from './circuit.service';
import { CircuitSubmission } from './entities/circuit-submission.entity';
import { SubmitCircuitDto } from './dto/submit-circuit.dto';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../assignments/entities/assignment.entity';
import { User } from '../users/entities/user.entity';

interface JwtRequest extends Request {
  user: User; 
}

@Controller('circuit')
export class CircuitController {
  constructor(
    private readonly circuitService: CircuitService,
    @InjectRepository(CircuitSubmission)
    private submissionRepo: Repository<CircuitSubmission>,
    @InjectRepository(Assignment)
    private assignmentRepo: Repository<Assignment>,
  ) {}

  @Post('assignments/:assignmentId/submit')
  @UseGuards(AuthGuard('jwt'))
  async submitCircuit(
    @Param('assignmentId') assignmentId: number,
    @Body() dto: SubmitCircuitDto,
    @Req() req: JwtRequest,
  ) {
    const user = req.user;
    if (!user || !user.id) {
      throw new Error('User not authenticated');
    }

    const assignment = await this.assignmentRepo.findOne({ where: { id: assignmentId } });
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const result = this.circuitService.validateCircuit(dto.circuitData, assignment.testCases);

    const submission = this.submissionRepo.create({
      circuitData: dto.circuitData,
      score: result.score,
      maxScore: result.maxScore,
      feedback: result.feedback,
      isPassed: result.isPassed,
      assignmentId: assignment.id,
      userId: user.id,
    });

    await this.submissionRepo.save(submission);

    return {
      success: true,
      score: result.score,
      maxScore: result.maxScore,
      isPassed: result.isPassed,
      feedback: result.feedback,
    };
  }
}
