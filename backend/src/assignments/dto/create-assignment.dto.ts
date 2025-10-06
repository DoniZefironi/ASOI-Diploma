// src/assignments/dto/create-assignment.dto.ts
import { IsString, IsEnum, IsNumber, IsDateString, IsBoolean, IsOptional, IsArray } from 'class-validator';
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
}