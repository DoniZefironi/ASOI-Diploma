import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

// Определяем enum прямо здесь вместо импорта
export enum CourseCategory {
  ENGLISH = 'english',
  COMPUTER_SCIENCE = 'computer_science',
  ELECTRONICS = 'electronics',
  IOT = 'iot'
}

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CourseCategory)
  category: CourseCategory;

  @IsOptional()
  createdBy?: number;
}