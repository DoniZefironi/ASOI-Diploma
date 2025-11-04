// backend/src/compiler/compiler.module.ts
import { Module } from '@nestjs/common';
import { CompilerController } from './controllers/compiler.controller';
import { CompilerService } from './services/compiler.service';

@Module({
  controllers: [CompilerController],
  providers: [CompilerService],
})
export class CompilerModule {}