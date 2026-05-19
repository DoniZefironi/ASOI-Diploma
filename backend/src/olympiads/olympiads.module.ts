import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { OlympiadsService } from './olympiads.service';
import { OlympiadsController } from './olympiads.controller';
import { Olympiad } from './entities/olympiad.entity';
import { OlympiadProblem } from './entities/olympiad-problem.entity';
import { OlympiadSubmission } from './entities/olympiad-submission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Olympiad, OlympiadProblem, OlympiadSubmission]),
    HttpModule,
  ],
  controllers: [OlympiadsController],
  providers:   [OlympiadsService],
  exports:     [OlympiadsService],
})
export class OlympiadsModule {}
