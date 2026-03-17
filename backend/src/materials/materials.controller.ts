// src/materials/materials.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../users/entities/user-role.entity';
import { MENTOR_ROLES } from '../common/helpers/role.helper';
import { MaterialType } from './entities/course-material.entity';
import { SearchDto } from '../common/dto/pagination.dto';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Get()
  findAll(@Query() searchDto: SearchDto) {
    return this.materialsService.findAll(searchDto);
  }

  @Get('public')
  getPublicMaterials() {
    return this.materialsService.getPublicMaterials();
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.materialsService.findByCourse(+courseId);
  }

  @Get('type/:type')
  findByType(@Param('type') type: MaterialType) {
    return this.materialsService.findByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  create(@Body() createMaterialDto: CreateCourseMaterialDto, @Request() req) {
    return this.materialsService.create(createMaterialDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateCourseMaterialDto) {
    return this.materialsService.update(+id, updateMaterialDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...MENTOR_ROLES, UserRoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.materialsService.remove(+id);
  }
}
