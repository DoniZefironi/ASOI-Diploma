import { SetMetadata } from '@nestjs/common';
import { CourseType } from '../../courses/entities/course.entity';

export const REQUIRE_COURSE_TYPE = 'requireCourseType';

export const RequireCourseType = (courseType: CourseType) =>
  SetMetadata(REQUIRE_COURSE_TYPE, courseType);
