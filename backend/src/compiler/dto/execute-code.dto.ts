// backend/src/compiler/dto/execute-code.dto.ts
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum LanguageEnum {
  JS = 'js',
  PYTHON = 'python',
  CPP = 'cpp',
  JAVA = 'java',
}

export class ExecuteCodeDto {
  @IsString()
  code: string;

  @IsEnum(LanguageEnum)
  language: string;

  @IsOptional()
  @IsString()
  stdin?: string;

  @IsOptional()
  @IsNumber()
  assignmentId?: number;
}