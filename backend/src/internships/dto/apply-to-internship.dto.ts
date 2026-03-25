// src/internships/dto/apply-to-internship.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class ApplyToInternshipDto {
  @IsOptional()
  @IsString()
  comment?: string;
}
