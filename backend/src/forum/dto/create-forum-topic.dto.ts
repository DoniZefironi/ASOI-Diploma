// src/forum/dto/create-forum-topic.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateForumTopicDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsNumber()
  sectionId: number;
}