// src/assignments/dto/create-submission.dto.ts
import { IsString, IsNumber, IsArray, IsOptional, IsUrl } from 'class-validator';

export class CreateSubmissionDto {
  @IsNumber()
  assignmentId: number;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsUrl()
  @IsOptional()
  repositoryUrl?: string;
}