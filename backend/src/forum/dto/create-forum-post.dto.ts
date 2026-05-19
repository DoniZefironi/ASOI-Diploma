// src/forum/dto/create-forum-post.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateForumPostDto {
  @IsNumber()
  topicId: number;

  @IsString()
  content: string;
}