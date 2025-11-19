// src/professional-orientation/dto/create-professional-orientation.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProfessionalOrientationDto {
  @IsString()
  @IsNotEmpty()
  recommendedProfession: string;

  @IsOptional()
  testResult?: Record<string, any>;
}