// src/internships/dto/import-from-hh.dto.ts
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class ImportFromHhDto {
  @IsString()
  @IsOptional()
  searchQuery?: string = 'стажировка IT';

  @IsNumber()
  @IsOptional()
  limit?: number = 20;

  @IsBoolean()
  @IsOptional()
  isActiveOnly?: boolean = true;
}

export interface HhVacancy {
  id: string;
  name: string;
  employer: {
    name: string;
    logo?: {
      original?: string;
    };
  };
  area: {
    name: string;
  };
  description: string;
  requirement?: string;
  responsibility?: string;
  salary?: {
    from?: number;
    to?: number;
    currency: string;
  };
  published_at: string;
  url: string;
  employment?: {
    name: string;
  };
  schedule?: {
    name: string;
  };
  experience?: {
    name: string;
  };
}

export interface HhVacanciesResponse {
  items: HhVacancy[];
  pages: number;
  page: number;
  found: number;
}
