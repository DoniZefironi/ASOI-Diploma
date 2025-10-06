// src/forum/dto/create-forum-section.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateForumSectionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  courseId: number;
}