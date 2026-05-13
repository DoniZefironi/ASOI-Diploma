import { IsString, IsOptional, IsBoolean, IsIn, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['circuit', 'iot'])
  type: 'circuit' | 'iot';

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsNumber()
  hackathonTeamId?: number;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateMemberRoleDto {
  @IsIn(['editor', 'viewer'])
  role: 'editor' | 'viewer';
}
