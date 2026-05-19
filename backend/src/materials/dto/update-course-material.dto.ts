// src/materials/dto/update-course-material.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseMaterialDto } from './create-course-material.dto';

export class UpdateCourseMaterialDto extends PartialType(CreateCourseMaterialDto) {}