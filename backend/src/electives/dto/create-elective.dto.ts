import { IsString, IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';
export class CreateElectiveDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsNumber() courseGroupId: number;
  @IsOptional() @IsNumber() instructorId?: number;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsNumber() maxParticipants?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
