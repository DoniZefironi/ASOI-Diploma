// backend/src/compiler/services/compiler.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Docker from 'dockerode';
import * as fs from 'fs';
import * as path from 'path';
import { ExecuteCodeDto } from '../dto/execute-code.dto';

@Injectable()
export class CompilerService {
  private readonly logger = new Logger(CompilerService.name);
  private docker = new Docker();

  async executeCode(dto: ExecuteCodeDto): Promise<{ output: string; error: string; status: string }> {
    const { code, language, stdin, assignmentId } = dto;

    console.log('=== executeCode called ===');
    console.log('DTO:', { code, language, stdin, assignmentId });

    const imageName = this.getImageNameForLanguage(language);
    if (!imageName) {
      throw new BadRequestException(`Язык ${language} не поддерживается`);
    }

    console.log('Using image:', imageName);

    const tempDir = path.join(__dirname, '..', '..', 'temp', Date.now().toString());
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      this.writeCodeToFile(code, language, tempDir);

      const result = await this.runInDockerContainer(imageName, language, tempDir, stdin);

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

  private getImageNameForLanguage(language: string): string | null {
    const images: { [key: string]: string } = {
      js: 'sandbox-node:latest',
      python: 'sandbox-python:latest',
      cpp: 'sandbox-cpp:latest',
      java: 'sandbox-java:latest',
    };

    return images[language] || null;
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
    console.log('Writing to file:', filePath);
    console.log('Code content:\n', code);

    fs.writeFileSync(filePath, code);
  }

  private async runInDockerContainer(
    imageName: string,
    language: string,
    tempDir: string,
    stdin?: string,
  ): Promise<{ stdout: string; stderr: string }> {
    console.log('=== runInDockerContainer called ===');
    console.log('Image:', imageName);
    console.log('Language:', language);
    console.log('TempDir:', tempDir);
    console.log('Stdin:', stdin);

    try {
      await this.docker.getImage(imageName).inspect();
    } catch (err) {
      throw new BadRequestException(`Образ ${imageName} не найден. Убедитесь, что он собран.`);
    }

    let cmd: string[] = [];
    switch (language) {
      case 'js':
        cmd = ['node', 'main.js'];
        break;
      case 'python':
        cmd = ['python', 'main.py'];
        break;
      case 'cpp':
        cmd = ['/bin/sh', '-c', 'g++ main.cpp -o main && ./main'];
        break;
      case 'java':
        cmd = ['/bin/sh', '-c', 'javac Main.java && java Main'];
        break;
      default:
        throw new Error(`Команда для языка ${language} не определена`);
    }

    const container = await this.docker.createContainer({
      Image: imageName,
      Cmd: cmd,
      HostConfig: {
        Binds: [`${tempDir}:/app`],
        Memory: 100 * 1024 * 1024, 
        NanoCpus: 500000000, 
        NetworkMode: 'none', 
        PidsLimit: 100, 
      },
      WorkingDir: '/app',
      AttachStdin: !!stdin,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    });

    await container.start();

    if (stdin) {
      const stream = await container.attach({ stream: true, stdin: true, stdout: true, stderr: true });
      stream.write(stdin);
      stream.end();
    }

    const waitResult = await container.wait();

    const logs = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,
    });

    const logString = logs.toString();

    const stdout = logString;
    const stderr = '';

    await container.remove();

    return { stdout, stderr };
  }
}