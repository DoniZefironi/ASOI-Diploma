import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseGroupDto {
  @ApiProperty({ description: 'Course ID' })
  @IsNumber()
  courseId: number;

  @ApiProperty({ description: 'Academic year' })
  @IsNumber()
  year: number;

  @ApiProperty({ description: 'Group name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Start date (ISO string)' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'End date (ISO string)' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Maximum number of students', required: false })
  @IsNumber()
  @IsOptional()
  maxStudents?: number;

  @ApiProperty({ description: 'Is group active', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}