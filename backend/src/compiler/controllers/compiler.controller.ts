// backend/src/compiler/controllers/compiler.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CompilerService } from '../services/compiler.service';
import { ExecuteCodeDto } from '../dto/execute-code.dto';

@Controller('compiler')
export class CompilerController {
  constructor(private readonly compilerService: CompilerService) {}

  @Post('execute')
  async execute(@Body() dto: ExecuteCodeDto) { 
    return this.compilerService.executeCode(dto);
  }
}
