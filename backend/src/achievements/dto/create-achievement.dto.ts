// src/achievements/dto/create-achievement.dto.ts
import { IsString, IsEnum, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { AchievementType } from '../entities/achievement.entity';

export class CreateAchievementDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(AchievementType)
  type: AchievementType;

  @IsString()
  icon: string;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsOptional()
  conditions?: any;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}