import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipsController } from './internships.controller';
import { InternshipsService } from './internships.service';
import { Internship } from './entities/internship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Internship])],
  controllers: [InternshipsController],
  providers: [InternshipsService],
})
export class InternshipsModule {}
