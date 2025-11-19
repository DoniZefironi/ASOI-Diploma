import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateHackathonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  rules?: string;

  @IsOptional()
  @IsNumber()
  maxTeamSize?: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}