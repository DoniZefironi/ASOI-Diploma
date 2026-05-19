// src/common/dto/pagination.dto.ts
import { IsOptional, IsInt, Min, IsString, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class SearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

export class GroupSearchDto extends SearchDto {
  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  semester?: string;

  @IsOptional()
  @IsString()
  isActive?: string;
}

export class AssignmentSearchDto extends SearchDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class ScheduleSearchDto extends SearchDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class StudentSearchDto extends SearchDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAverageScore?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAverageScore?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  minCompletedAssignments?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  maxCompletedAssignments?: number;
}
