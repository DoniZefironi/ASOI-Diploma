// backend/src/compiler/services/compiler.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Docker from 'dockerode';
import { ExecuteCodeDto } from '../dto/execute-code.dto';

const IMAGE_MAP: Record<string, string> = {
  js:     'sandbox-node:latest',
  python: 'sandbox-python:latest',
  cpp:    'sandbox-cpp:latest',
  java:   'sandbox-java:latest',
};

const TIMEOUT_MS = 10_000;

@Injectable()
export class CompilerService {
  private readonly logger = new Logger(CompilerService.name);
  private readonly docker = new Docker();

  async executeCode(dto: ExecuteCodeDto): Promise<{ output: string; error: string; status: string }> {
    const { code, language, stdin } = dto;

    const imageName = IMAGE_MAP[language];
    if (!imageName) {
      throw new BadRequestException(`Язык ${language} не поддерживается`);
    }

    try {
      await this.docker.getImage(imageName).inspect();
    } catch {
      throw new BadRequestException(`Образ ${imageName} не найден. Убедитесь, что он собран.`);
    }

    try {
      return await this.run(imageName, language, code, stdin);
    } catch (err: any) {
      this.logger.error('executeCode error', err?.message);
      return { output: '', error: err?.message ?? 'Неизвестная ошибка', status: 'error' };
    }
  }

  // Кодируем код в base64 и встраиваем в команду контейнера.
  // Это позволяет избежать bind-mount temp-файлов через Docker socket.
  private buildCmd(language: string, code: string): string[] {
    const b64 = Buffer.from(code).toString('base64');
    switch (language) {
      case 'python':
        return ['sh', '-c', `echo '${b64}' | base64 -d > /app/main.py && python /app/main.py`];
      case 'js':
        return ['sh', '-c', `echo '${b64}' | base64 -d > /app/main.js && node /app/main.js`];
      case 'cpp':
        return ['sh', '-c', `echo '${b64}' | base64 -d > /app/main.cpp && g++ /app/main.cpp -o /app/main && /app/main`];
      case 'java':
        return ['sh', '-c', `echo '${b64}' | base64 -d > /app/Main.java && javac /app/Main.java && java -cp /app Main`];
      default:
        throw new BadRequestException(`Команда для языка ${language} не определена`);
    }
  }

  private async run(
    imageName: string,
    language: string,
    code: string,
    stdin?: string,
  ): Promise<{ output: string; error: string; status: string }> {
    const cmd      = this.buildCmd(language, code);
    const hasStdin = !!stdin;

    const container = await this.docker.createContainer({
      Image: imageName,
      Cmd: cmd,
      WorkingDir: '/app',
      HostConfig: {
        Memory:      100 * 1024 * 1024,
        NanoCpus:    500_000_000,
        NetworkMode: 'none',
        PidsLimit:   100,
        // Без Binds — файл передаётся через base64 в команде
      },
      AttachStdin:  hasStdin,
      OpenStdin:    hasStdin,
      StdinOnce:    hasStdin,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    });

    let timedOut = false;

    try {
      await container.start();

      if (hasStdin) {
        const s = await container.attach({ stream: true, stdin: true, hijack: true });
        s.write(stdin + '\n');
        s.end();
      }

      const killTimer = setTimeout(async () => {
        timedOut = true;
        try { await container.kill(); } catch {}
      }, TIMEOUT_MS);

      const waitResult = await container.wait();
      clearTimeout(killTimer);

      if (timedOut) {
        return {
          output: '',
          error:  'time_limit_exceeded: превышен лимит времени выполнения (10 сек)',
          status: 'error',
        };
      }

      const logBuf = await container.logs({ stdout: true, stderr: true, follow: false }) as Buffer;
      const { stdout, stderr } = this.demux(logBuf);

      return {
        output: stdout.trim(),
        error:  stderr.trim(),
        status: waitResult.StatusCode === 0 && !stderr.trim() ? 'success' : 'error',
      };
    } finally {
      try { await container.remove({ force: true }); } catch {}
    }
  }

  // Разделяет мультиплексированный вывод Docker (8-байтные заголовки)
  private demux(buf: Buffer): { stdout: string; stderr: string } {
    let out = '';
    let err = '';
    let i   = 0;

    while (i + 8 <= buf.length) {
      const type = buf[i];
      const size = buf.readUInt32BE(i + 4);
      i += 8;
      if (size === 0 || i + size > buf.length) break;
      const chunk = buf.slice(i, i + size).toString('utf8');
      if      (type === 1) out += chunk;
      else if (type === 2) err += chunk;
      i += size;
    }

    return { stdout: out, stderr: err };
  }
}
