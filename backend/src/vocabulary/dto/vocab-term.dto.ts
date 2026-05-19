import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class CreateVocabTermDto {
  @IsString()
  term: string;

  @IsOptional()
  @IsString()
  transcription?: string;

  @IsString()
  translation: string;

  @IsString()
  category: string;

  @IsString()
  definition: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  @IsIn(['basic', 'intermediate', 'advanced'])
  level?: string;
}

export class UpdateVocabTermDto {
  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsString()
  transcription?: string;

  @IsOptional()
  @IsString()
  translation?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  definition?: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  @IsIn(['basic', 'intermediate', 'advanced'])
  level?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
