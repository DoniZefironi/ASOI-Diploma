// src/assignments/dto/create-peer-review.dto.ts
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreatePeerReviewDto {
  @IsInt()
  submissionId: number;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  score?: number;

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
