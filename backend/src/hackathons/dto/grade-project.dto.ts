import { IsNumber, IsOptional, IsString, Min, Max, IsObject } from 'class-validator';

export class GradeProjectDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  innovationScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  functionalityScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  presentationScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  teamworkScore?: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsObject()
  judgingCriteriaScores?: any;
}
