// src/achievements/dto/update-achievement.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAchievementDto } from './create-achievement.dto';

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {}