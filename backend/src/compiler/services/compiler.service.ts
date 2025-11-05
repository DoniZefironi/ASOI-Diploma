// backend/src/compiler/services/compiler.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ExecuteCodeDto } from '../dto/execute-code.dto';

@Injectable()
export class CompilerService {
  private readonly logger = new Logger(CompilerService.name);

  async executeCode(dto: ExecuteCodeDto): Promise<{ output: string; error: string; status: string }> {
    const { code, language, stdin, assignmentId } = dto;

    console.log('=== executeCode called ===');
    console.log('DTO:', { code, language, stdin, assignmentId });

    const commands = this.getCommandForLanguage(language);
    if (!commands) {
      throw new BadRequestException(`Язык ${language} не поддерживается`);
    }

    console.log('Command for language:', commands);

    const tempDir = path.join(__dirname, '..', '..', 'temp', Date.now().toString());
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      this.writeCodeToFile(code, language, tempDir);

      const result = await this.runInSandbox(commands, tempDir, stdin);

      return {
        output: result.stdout,
        error: result.stderr,
        status: result.stderr ? 'error' : 'success',
      };
    } catch (error) {
      console.error('Error in executeCode:', error.message);
      return {
        output: '',
        error: error.message || 'Неизвестная ошибка',
        status: 'error',
      };
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }

  private getCommandForLanguage(language: string): string | null {
    const os = process.platform;
    console.log('OS:', os);

    const commands: { [key: string]: string } = {
      js: 'node main.js',
      python: os === 'win32' ? 'python main.py' : 'python3 main.py',
      cpp: 'g++ main.cpp -o main && ./main',
      java: 'javac Main.java && java Main',
    };

    const command = commands[language];
    console.log('Looking up command for language:', language, 'found:', command);
    return command || null;
  }

  private writeCodeToFile(code: string, language: string, dir: string): void {
    console.log('=== writeCodeToFile called ===');
    const fileNameMap: { [key: string]: string } = {
      js: 'main.js',
      python: 'main.py',
      cpp: 'main.cpp',
      java: 'Main.java',
    };

    const fileName = fileNameMap[language];
    if (!fileName) {
      throw new Error(`Язык ${language} не поддерживается`);
    }

    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, code);
  }

  private runInSandbox(
    command: string,
    tempDir: string,
    stdin?: string,
  ): Promise<{ stdout: string; stderr: string }> {

    return new Promise((resolve, reject) => {
      const process = childProcess.exec(command, {
        cwd: tempDir,
        timeout: 5000, 
        maxBuffer: 1024 * 1024, 
      });

      let stdout = '';
      let stderr = '';

      process.stdout?.on('data', (data) => {
        stdout += data;
        console.log('stdout:', data.toString());
      });

      process.stderr?.on('data', (data) => {
        stderr += data;
        console.log('stderr:', data.toString());
      });

      if (stdin) {
        process.stdin?.write(stdin);
        process.stdin?.end();
      }

      process.on('close', (code) => {

        if (code === 0 || stdout) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`Процесс завершился с кодом ${code}: ${stderr}`));
        }
      });

      process.on('error', (err) => {
        console.error('Process error:', err);
        reject(err);
      });
    });
  }
}