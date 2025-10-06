// src/compiler/compiler.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export interface CompilationResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface TestResult {
  testCase: TestCase;
  success: boolean;
  actualOutput?: string;
  error?: string;
  executionTime?: number;
}

@Injectable()
export class CompilerService {
  private readonly supportedLanguages = ['javascript', 'python', 'java', 'cpp'];

  async compileCode(code: string, language: string): Promise<CompilationResult> {
    if (!this.supportedLanguages.includes(language)) {
      throw new BadRequestException(`Unsupported language: ${language}`);
    }

    const tempDir = tmpdir();
    const fileName = `code_${Date.now()}`;
    
    try {
      let command: string;
      let filePath: string;

      switch (language) {
        case 'javascript':
          filePath = join(tempDir, `${fileName}.js`);
          await writeFile(filePath, code);
          command = `node ${filePath}`;
          break;

        case 'python':
          filePath = join(tempDir, `${fileName}.py`);
          await writeFile(filePath, code);
          command = `python ${filePath}`;
          break;

        case 'java':
          filePath = join(tempDir, `${fileName}.java`);
          await writeFile(filePath, code);
          const className = this.extractJavaClassName(code) || fileName;
          command = `cd ${tempDir} && javac ${fileName}.java && java ${className}`;
          break;

        case 'cpp':
          filePath = join(tempDir, `${fileName}.cpp`);
          const executablePath = join(tempDir, fileName);
          await writeFile(filePath, code);
          command = `g++ ${filePath} -o ${executablePath} && ${executablePath}`;
          break;

        default:
          throw new BadRequestException('Unsupported language');
      }

      const startTime = Date.now();
      const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
      const executionTime = Date.now() - startTime;

      // Cleanup
      await this.cleanupFiles(filePath, language, tempDir, fileName);

      return {
        success: true,
        output: stdout,
        error: stderr || undefined,
        executionTime,
      };
    } catch (error: any) {
      // Cleanup in case of error
      const filePath = join(tempDir, `${fileName}.${this.getFileExtension(language)}`);
      await this.cleanupFiles(filePath, language, tempDir, fileName);

      return {
        success: false,
        output: '',
        error: error.stderr || error.message,
      };
    }
  }

  async runTests(code: string, language: string, testCases: TestCase[]): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      try {
        const testCode = this.wrapCodeWithInput(code, language, testCase.input);
        const result = await this.compileCode(testCode, language);
        
        const testResult: TestResult = {
          testCase,
          success: result.success && this.normalizeOutput(result.output) === this.normalizeOutput(testCase.expectedOutput),
          actualOutput: result.output,
          error: result.error,
          executionTime: result.executionTime,
        };

        results.push(testResult);
      } catch (error: any) {
        results.push({
          testCase,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  }

  private extractJavaClassName(code: string): string | null {
    const classMatch = code.match(/class\s+(\w+)/);
    return classMatch ? classMatch[1] : null;
  }

  private getFileExtension(language: string): string {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
    };
    return extensions[language] || 'txt';
  }

  private async cleanupFiles(
    mainFilePath: string,
    language: string,
    tempDir: string,
    fileName: string,
  ): Promise<void> {
    try {
      await unlink(mainFilePath);

      // Cleanup additional files for specific languages
      if (language === 'java') {
        await unlink(join(tempDir, `${fileName}.class`)).catch(() => {});
      } else if (language === 'cpp') {
        await unlink(join(tempDir, fileName)).catch(() => {});
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  private wrapCodeWithInput(code: string, language: string, input: string): string {
    const normalizedInput = input.replace(/'/g, "\\'").replace(/\n/g, '\\n');

    switch (language) {
      case 'python':
        return `
import sys
${code}
if __name__ == "__main__":
    input_data = '''${input}'''
    sys.stdin = __import__('io').StringIO(input_data)
    exec(compile(open(__file__).read().split('\\n', 1)[1], __file__, 'exec'))
`;

      case 'javascript':
        return `
const readline = require('readline');
${code}
// Your code that uses readline goes here
`;

      case 'java':
        return `
import java.util.*;
${code}
class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = "${normalizedInput}";
        Scanner inputScanner = new Scanner(input);
        // Your code that uses inputScanner goes here
    }
}
`;

      default:
        return code;
    }
  }

  private normalizeOutput(output: string): string {
    return output.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  }
}