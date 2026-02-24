import { IsString, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class SubmitProjectDto {
  @IsNumber()
  teamId: number;

  @IsOptional()
  @IsNumber()
  circuitProjectId?: number;

  @IsOptional()
  @IsString()
  @IsUrl()
  documentationUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  presentationUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  videoDemoUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  sourceCodeUrl?: string;

  @IsOptional()
  @IsString()
  submissionNote?: string;
}
