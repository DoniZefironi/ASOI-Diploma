// src/circuit/circuit.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CircuitController } from './circuit.controller';
import { CircuitService } from './circuit.service';
import { CircuitSubmission } from './entities/circuit-submission.entity';
import { Assignment } from '../assignments/entities/assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CircuitSubmission, Assignment]),
  ],
  controllers: [CircuitController],
  providers: [CircuitService],
  exports: [CircuitService],
})
export class CircuitModule {}