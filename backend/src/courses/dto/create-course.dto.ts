// src/courses/dto/create-course.dto.ts
import { IsEnum, IsString, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';
import { CourseType } from '../entities/course.entity';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsEnum(CourseType)
  type: CourseType;

  @IsString()
  description: string;

  @IsNumber()
  duration: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}