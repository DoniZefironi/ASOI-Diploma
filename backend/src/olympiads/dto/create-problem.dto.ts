import { IsString, IsOptional, IsNumber, IsArray, IsEnum } from 'class-validator';
import { ProblemDifficulty } from '../entities/olympiad-problem.entity';

export class CreateProblemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  inputDescription?: string;

  @IsString()
  @IsOptional()
  outputDescription?: string;

  @IsArray()
  @IsOptional()
  examples?: { input: string; output: string; explanation?: string }[];

  @IsEnum(ProblemDifficulty)
  @IsOptional()
  difficulty?: ProblemDifficulty;

  @IsNumber()
  @IsOptional()
  points?: number;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;
}
