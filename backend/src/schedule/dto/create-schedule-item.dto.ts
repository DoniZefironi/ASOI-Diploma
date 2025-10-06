import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleItemDto {
  @ApiProperty({ description: 'Course Group ID' })
  @IsNumber()
  courseGroupId: number;

  @ApiProperty({ description: 'Item title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Item description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Item type',
    enum: ['lecture', 'practice', 'assignment', 'project', 'test', 'peer_review']
  })
  @IsEnum(['lecture', 'practice', 'assignment', 'project', 'test', 'peer_review'])
  itemType: string;

  @ApiProperty({ description: 'Scheduled date (ISO string)' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ description: 'Due date (ISO string)', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ description: 'Maximum score', required: false })
  @IsNumber()
  @IsOptional()
  maxScore?: number;

  @ApiProperty({ description: 'Content URL', required: false })
  @IsUrl()
  @IsOptional()
  contentUrl?: string;

  @ApiProperty({ description: 'Meeting URL (for online sessions)', required: false })
  @IsUrl()
  @IsOptional()
  meetingUrl?: string;

  @ApiProperty({ description: 'Duration in minutes', required: false })
  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @ApiProperty({ description: 'Is item active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}