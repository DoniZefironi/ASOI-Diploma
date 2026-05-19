import { IsString, IsNumber } from 'class-validator';

export class SubmitSolutionDto {
  @IsString()
  code: string;

  @IsString()
  language: string;
}
