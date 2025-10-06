// src/compiler/compiler.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CompilerService, CompilationResult, TestCase, TestResult } from './compiler.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('compiler')
@UseGuards(JwtAuthGuard)
export class CompilerController {
  constructor(private readonly compilerService: CompilerService) {}

  @Post('compile')
  async compileCode(
    @Body('code') code: string,
    @Body('language') language: string,
  ): Promise<CompilationResult> {
    return this.compilerService.compileCode(code, language);
  }

  @Post('test')
  async runTests(
    @Body('code') code: string,
    @Body('language') language: string,
    @Body('testCases') testCases: TestCase[],
  ): Promise<TestResult[]> {
    return this.compilerService.runTests(code, language, testCases);
  }

  @Post('validate-solution')
  async validateSolution(
    @Body('code') code: string,
    @Body('language') language: string,
    @Body('problemId') problemId: string,
  ) {
    // Здесь можно добавить логику для получения тестовых случаев из базы данных
    // по problemId и запуска тестов
    const testCases = await this.getTestCasesForProblem(problemId);
    return this.compilerService.runTests(code, language, testCases);
  }

  private async getTestCasesForProblem(problemId: string): Promise<TestCase[]> {
    // Заглушка - в реальной реализации здесь будет запрос к базе данных
    return [
      {
        input: '5\n2 3 1 4 5',
        expectedOutput: '1 2 3 4 5',
      },
      {
        input: '3\n3 2 1',
        expectedOutput: '1 2 3',
      },
    ];
  }
}