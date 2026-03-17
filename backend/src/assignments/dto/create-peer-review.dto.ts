// src/assignments/dto/create-peer-review.dto.ts
import { IsInt, IsOptional, IsString, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CriterionScoreDto {
  @IsString()
  name: string;

  @Min(0)
  score: number;

  @Min(0)
  maxScore: number;
}

export class CreatePeerReviewDto {
  @IsInt()
  submissionId: number;

  @IsOptional()
  @Min(0)
  @Max(400)
  score?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterionScoreDto)
  criteriaScores?: CriterionScoreDto[];

  @IsString()
  @IsOptional()
  feedback?: string;
}

export class AssignPeerReviewsDto {
  @IsInt()
  assignmentId: number;

  @IsInt()
  @Min(1)
  @Max(10)
  reviewsPerStudent: number = 5;
}
