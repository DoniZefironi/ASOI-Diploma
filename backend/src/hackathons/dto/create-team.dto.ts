import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  hackathonId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  memberIds: number[]; // ID пользователей в команде (первый - капитан)
}