// src/assignments/dto/create-assignment.dto.ts
import { IsString, IsEnum, IsNumber, IsDateString, IsBoolean, IsOptional, IsArray, IsInt, Min, Max } from 'class-validator';
import { AssignmentType } from '../entities/assignment.entity';

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(AssignmentType)
  type: AssignmentType;

  @IsOptional()
  requirements?: any;

  @IsNumber()
  maxScore: number;

  @IsDateString()
  deadline: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  courseGroupId: number;

  @IsBoolean()
  @IsOptional()
  peerReviewEnabled?: boolean;

  @IsDateString()
  @IsOptional()
  peerReviewStartDate?: string;

  @IsDateString()
  @IsOptional()
  peerReviewEndDate?: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  peerReviewsPerStudent?: number;

  @IsString()
  @IsOptional()
  peerReviewCriteria?: string;
}