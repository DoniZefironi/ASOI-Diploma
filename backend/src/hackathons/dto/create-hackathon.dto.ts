import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateHackathonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsOptional()
  @IsDateString()
  registrationDeadline?: string;

  @IsOptional()
  @IsNumber()
  maxTeamSize?: number;

  @IsOptional()
  @IsNumber()
  minTeamSize?: number;

  @IsOptional()
  @IsNumber()
  prizePool?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  courseId?: number;

  @IsOptional()
  @IsObject()
  judgingCriteria?: any;
}
