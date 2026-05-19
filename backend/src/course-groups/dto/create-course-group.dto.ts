// src/course-groups/dto/create-course-group.dto.ts
import { IsString, IsNumber, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCourseGroupDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsNumber()
  semester: number;

  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  courseId: number;
}