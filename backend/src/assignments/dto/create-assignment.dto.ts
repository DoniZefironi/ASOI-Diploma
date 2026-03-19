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
  startDate: string;

  @IsDateString()
  deadline: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  courseGroupId?: number;

  @IsNumber()
  @IsOptional()
  electiveId?: number;

  // Для типа practice_review
  @IsInt()
  @IsOptional()
  practiceAssignmentId?: number;
}