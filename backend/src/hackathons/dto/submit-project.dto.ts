import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class SubmitProjectDto {
  @IsNumber()
  teamId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  repositoryUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  presentationUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  demoUrl?: string;
}