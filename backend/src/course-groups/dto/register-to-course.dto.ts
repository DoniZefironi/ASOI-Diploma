// src/course-groups/dto/register-to-course.dto.ts
import { IsNumber } from 'class-validator';

export class RegisterToCourseDto {
  @IsNumber()
  courseGroupId: number;
}