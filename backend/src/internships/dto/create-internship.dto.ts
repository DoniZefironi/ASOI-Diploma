import { IsString, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';

export class CreateInternshipDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  @IsOptional()
  companyDescription?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsString()
  @IsOptional()
  prospects?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  format?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsString()
  @IsOptional()
  applicationEmail?: string;

  @IsString()
  @IsOptional()
  applicationUrl?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
