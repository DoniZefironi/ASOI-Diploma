// src/assignments/dto/create-peer-review.dto.ts
import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreatePeerReviewDto {
  @IsNumber()
  submissionId: number;

  @IsNumber()
  score: number;

  @IsString()
  feedback: string;

  @IsBoolean()
  @IsOptional()
  isMentorReview?: boolean;
}