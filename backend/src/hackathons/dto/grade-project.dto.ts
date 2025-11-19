import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class GradeProjectDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  innovationScore: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  technicalScore: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  presentationScore: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  usabilityScore: number;

  @IsOptional()
  @IsString()
  comment?: string;
}