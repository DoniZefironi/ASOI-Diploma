import { IsArray, IsIn, IsString } from 'class-validator';

export class SubmitTestDto {
  @IsString()
  @IsIn(['holland', 'klimov'])
  testType: string;

  @IsArray()
  answers: any[];
}
