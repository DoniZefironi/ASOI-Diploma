// src/assignments/dto/create-submission.dto.ts
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];

  @IsNumber()
  assignmentId: number;
}