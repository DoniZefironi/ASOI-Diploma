import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { InternshipsController } from './internships.controller';
import { InternshipsService } from './internships.service';
import { InternshipsHhService } from './internships-hh.service';
import { Internship } from './entities/internship.entity';
import { InternshipApplication } from './entities/internship-application.entity';
import { InternshipView } from './entities/internship-view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Internship,
      InternshipApplication,
      InternshipView,
    ]),
    HttpModule,
  ],
  controllers: [InternshipsController],
  providers: [
    InternshipsService,
    InternshipsHhService,
  ],
  exports: [
    InternshipsService,
    InternshipsHhService,
  ],
})
export class InternshipsModule {}
