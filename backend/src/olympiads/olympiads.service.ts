import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Olympiad } from './entities/olympiad.entity';
import { OlympiadProblem } from './entities/olympiad-problem.entity';
import { OlympiadSubmission, SubmissionStatus } from './entities/olympiad-submission.entity';
import { CreateOlympiadDto } from './dto/create-olympiad.dto';
import { CreateProblemDto } from './dto/create-problem.dto';
import { SubmitSolutionDto } from './dto/submit-solution.dto';

@Injectable()
export class OlympiadsService {
  constructor(
    @InjectRepository(Olympiad)           private olympiadRepo: Repository<Olympiad>,
    @InjectRepository(OlympiadProblem)    private problemRepo:  Repository<OlympiadProblem>,
    @InjectRepository(OlympiadSubmission) private submissionRepo: Repository<OlympiadSubmission>,
    private readonly httpService: HttpService,
  ) {}

  // ── Public ─────────────────────────────────────────────────────────

  findAll() {
    return this.olympiadRepo.find({
      where: { isActive: true },
      relations: ['problems'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number) {
    const o = await this.olympiadRepo.findOne({
      where: { id },
      relations: ['problems', 'course'],
    });
    if (!o) throw new NotFoundException('Олимпиада не найдена');
    o.problems.sort((a, b) => a.orderIndex - b.orderIndex);
    return o;
  }

  async getLeaderboard(olympiadId: number) {
    const submissions = await this.submissionRepo.find({
      where: { olympiadId, status: SubmissionStatus.ACCEPTED },
      relations: ['user', 'problem'],
      order: { createdAt: 'ASC' },
    });

    // Aggregate by user: best score per problem, first accepted time
    const byUser = new Map<number, { userId: number; name: string; score: number; solvedAt: Date; solved: number }>();
    for (const s of submissions) {
      const uid = s.userId;
      if (!byUser.has(uid)) {
        byUser.set(uid, {
          userId: uid,
          name: `${s.user.firstName} ${s.user.lastName}`,
          score: 0, solvedAt: s.createdAt, solved: 0,
        });
      }
      const entry = byUser.get(uid)!;
      entry.score += s.score;
      entry.solved += 1;
      if (s.createdAt > entry.solvedAt) entry.solvedAt = s.createdAt;
    }

    return Array.from(byUser.values())
      .sort((a, b) => b.score - a.score || a.solvedAt.getTime() - b.solvedAt.getTime())
      .map((e, i) => ({ rank: i + 1, ...e }));
  }

  async getMySubmissions(olympiadId: number, userId: number) {
    return this.submissionRepo.find({
      where: { olympiadId, userId },
      relations: ['problem'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Submit & Judge ──────────────────────────────────────────────────

  async submitSolution(olympiadId: number, problemId: number, userId: number, dto: SubmitSolutionDto) {
    const olympiad = await this.findOne(olympiadId);
    const now = new Date();
    if (now < olympiad.startDate) throw new ForbiddenException('Олимпиада ещё не началась');
    if (now > olympiad.endDate)   throw new ForbiddenException('Олимпиада уже завершена');
    if (!olympiad.allowedLanguages.includes(dto.language)) throw new ForbiddenException('Язык не допускается');

    const problem = olympiad.problems.find(p => p.id === problemId);
    if (!problem) throw new NotFoundException('Задача не найдена');

    // Save preliminary submission
    const submission = this.submissionRepo.create({
      olympiadId, problemId, userId,
      code: dto.code, language: dto.language,
      status: SubmissionStatus.PENDING, score: 0,
    });
    const saved = await this.submissionRepo.save(submission);

    // Run against examples
    if (problem.examples.length > 0) {
      await this.judgeSubmission(saved, problem, dto.code, dto.language);
    } else {
      // No test cases — mark as pending for manual review
      saved.status = SubmissionStatus.PENDING;
      await this.submissionRepo.save(saved);
    }

    return this.submissionRepo.findOne({ where: { id: saved.id }, relations: ['problem'] });
  }

  private async judgeSubmission(
    submission: OlympiadSubmission,
    problem: OlympiadProblem,
    code: string,
    language: string,
  ) {
    const examples = problem.examples;
    let allPassed = true;
    let lastOutput = '';
    let lastError = '';

    for (const ex of examples) {
      try {
        const codeWithInput = this.injectInput(code, language, ex.input);
        const result = await this.runCode(codeWithInput, language);

        if (result.status !== 'success') {
          allPassed = false;
          lastError = result.error || 'Runtime error';
          break;
        }

        const actual   = (result.output || '').trim();
        const expected = (ex.output || '').trim();
        lastOutput = actual;

        if (actual !== expected) {
          allPassed = false;
          break;
        }
      } catch {
        allPassed = false;
        lastError = 'Ошибка выполнения';
        break;
      }
    }

    submission.status = allPassed ? SubmissionStatus.ACCEPTED : (lastError ? SubmissionStatus.ERROR : SubmissionStatus.WRONG_ANSWER);
    submission.score  = allPassed ? problem.points : 0;
    submission.output = lastOutput;
    submission.errorMessage = lastError || null;
    await this.submissionRepo.save(submission);
  }

  private injectInput(code: string, language: string, input: string): string {
    // Prepend input as a variable for simple judging
    if (language === 'js') {
      return `const _INPUT = \`${input.replace(/`/g, '\\`')}\`;\nconst _LINES = _INPUT.trim().split('\\n');\n${code}`;
    }
    if (language === 'python') {
      const lines = input.trim().split('\n');
      return `_INPUT_LINES = ${JSON.stringify(lines)}\nimport sys\n_idx=0\ndef input():\n  global _idx\n  v=_INPUT_LINES[_idx] if _idx<len(_INPUT_LINES) else ''\n  _idx+=1\n  return v\n\n${code}`;
    }
    return code; // For C++/Java, return as-is (limited judging)
  }

  private async runCode(code: string, language: string): Promise<{ status: string; output?: string; error?: string }> {
    const result = await firstValueFrom(
      this.httpService.post('http://localhost:2904/compiler/execute', { code, language }),
    );
    return result.data;
  }

  // ── Admin ─────────────────────────────────────────────────────────

  create(dto: CreateOlympiadDto) {
    return this.olympiadRepo.save(this.olympiadRepo.create(dto));
  }

  async update(id: number, dto: Partial<CreateOlympiadDto>) {
    await this.olympiadRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const o = await this.findOne(id);
    return this.olympiadRepo.remove(o);
  }

  async addProblem(olympiadId: number, dto: CreateProblemDto) {
    await this.findOne(olympiadId);
    return this.problemRepo.save(this.problemRepo.create({ ...dto, olympiadId }));
  }

  async updateProblem(olympiadId: number, problemId: number, dto: Partial<CreateProblemDto>) {
    const problem = await this.problemRepo.findOne({ where: { id: problemId, olympiadId } });
    if (!problem) throw new NotFoundException('Задача не найдена');
    Object.assign(problem, dto);
    return this.problemRepo.save(problem);
  }

  async removeProblem(olympiadId: number, problemId: number) {
    const problem = await this.problemRepo.findOne({ where: { id: problemId, olympiadId } });
    if (!problem) throw new NotFoundException('Задача не найдена');
    return this.problemRepo.remove(problem);
  }

  findAllAdmin() {
    return this.olympiadRepo.find({ relations: ['problems'], order: { createdAt: 'DESC' } });
  }

  async gradeSubmission(submissionId: number, status: SubmissionStatus, score: number) {
    const sub = await this.submissionRepo.findOne({ where: { id: submissionId } });
    if (!sub) throw new NotFoundException('Попытка не найдена');
    sub.status = status;
    sub.score  = score;
    return this.submissionRepo.save(sub);
  }

  getAllSubmissions(olympiadId: number) {
    return this.submissionRepo.find({
      where: { olympiadId },
      relations: ['user', 'problem'],
      order: { createdAt: 'DESC' },
    });
  }
}
