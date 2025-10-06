// src/materials/dto/create-course-material.dto.ts
import { IsString, IsEnum, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { MaterialType } from '../entities/course-material.entity';

export class CreateCourseMaterialDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(MaterialType)
  type: MaterialType;

  @IsUrl()
  fileUrl: string;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsNumber()
  courseId: number;
}