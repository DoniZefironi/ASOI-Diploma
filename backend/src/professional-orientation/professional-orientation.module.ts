// src/professional-orientation/professional-orientation.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalOrientation } from './entities/professional-orientation.entity';
import { ProfessionalOrientationService } from './professional-orientation.service';
import { ProfessionalOrientationController } from './professional-orientation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalOrientation])],
  providers: [ProfessionalOrientationService],
  controllers: [ProfessionalOrientationController],
  exports: [ProfessionalOrientationService],
})
export class ProfessionalOrientationModule {}