// src/forum/dto/create-forum-section.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';

export class CreateForumSectionDto {
  @IsNumber()
  courseId: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}