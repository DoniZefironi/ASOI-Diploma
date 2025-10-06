// src/schedule/dto/create-schedule-item.dto.ts
import { IsString, IsEnum, IsDateString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { ScheduleItemType } from '../entities/schedule-item.entity';

export class CreateScheduleItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(ScheduleItemType)
  type: ScheduleItemType;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUrl()
  @IsOptional()
  meetingUrl?: string;

  @IsNumber()
  courseGroupId: number;

  @IsNumber()
  @IsOptional()
  instructorId?: number;
}