import { IsString, IsOptional, IsBoolean, IsDateString, IsArray, IsNumber } from 'class-validator';

export class CreateOlympiadDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsDateString()
  @IsOptional()
  registrationDeadline?: string;

  @IsArray()
  @IsOptional()
  allowedLanguages?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  courseId?: number;
}
