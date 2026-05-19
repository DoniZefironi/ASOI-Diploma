import { IsArray, IsObject, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TopMatchDto {
  @IsString()
  careerId: string;

  @IsString()
  careerTitle: string;

  @IsNumber()
  confidence: number;
}

export class SubmitExpertResultDto {
  @IsString()
  profileTitle: string;

  @IsString()
  profileDescription: string;

  @IsArray()
  @IsString({ each: true })
  dominantTraits: string[];

  @IsObject()
  traitScores: Record<string, number>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopMatchDto)
  topMatches: TopMatchDto[];
}
