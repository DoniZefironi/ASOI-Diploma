// src/forum/dto/create-forum-post.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateForumPostDto {
  @IsString()
  content: string;

  @IsNumber()
  topicId: number;

  @IsNumber()
  @IsOptional()
  parentPostId?: number;
}