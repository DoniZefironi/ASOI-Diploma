import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterToCourseDto {
  @ApiProperty({ description: 'Course Group ID' })
  @IsNumber()
  courseGroupId: number;

  @ApiProperty({ description: 'User ID' })
  @IsNumber()
  userId: number;
}