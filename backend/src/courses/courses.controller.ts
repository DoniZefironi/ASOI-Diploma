import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    if (category) {
      return this.coursesService.findByCategory(category);
    }
    return this.coursesService.findAll();
  }

  @Get('categories')
  async getCategories() {
    return this.coursesService.getCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Post()
  @Roles('admin', 'mentor')
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  @Roles('admin', 'mentor')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}