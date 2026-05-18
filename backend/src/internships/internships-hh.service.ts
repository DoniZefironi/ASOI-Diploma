// src/internships/internships-hh.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InternshipsService } from './internships.service';
import { HhVacancy, HhVacanciesResponse } from './dto/import-from-hh.dto';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InternshipsHhService {
  private readonly logger = new Logger(InternshipsHhService.name);
  private readonly hhApiUrl = 'https://api.hh.ru/vacancies';

  constructor(
    private readonly httpService: HttpService,
    private readonly internshipsService: InternshipsService,
  ) {}

  /**
   * Получение вакансий с HH.ru
   */
  async fetchVacanciesFromHh(
    searchQuery: string = 'стажировка IT',
    limit: number = 20,
  ): Promise<HhVacancy[]> {
    try {
      const params = new URLSearchParams({
        text: searchQuery,
        per_page: limit.toString(),
        order_by: 'publication_time',
      });

      const response = await firstValueFrom(
        this.httpService
          .get<HhVacanciesResponse>(`${this.hhApiUrl}?${params.toString()}`, {
            headers: {
              'User-Agent': 'ASOI-Diploma/1.0 (vladneckt@gmail.com)',
              'Accept': 'application/json',
              'HH-User-Agent': 'ASOI-Diploma/1.0 (vladneckt@gmail.com)',
            },
            timeout: 15000,
          })
          .pipe(map((res: any) => res.data)),
      );

      this.logger.log(`Найдено вакансий: ${(response as any).found}`);
      return (response as any).items;
    } catch (error) {
      this.logger.error('Ошибка при получении вакансий с HH.ru:', error);
      throw new BadRequestException('Не удалось получить вакансии с HH.ru');
    }
  }

  /**
   * Преобразование вакансии HH.ru в формат стажировки
   */
  private transformHhVacancy(vacancy: HhVacancy) {
    // Определяем формат работы
    let format = 'office';
    if (vacancy.schedule?.name) {
      const scheduleName = vacancy.schedule.name.toLowerCase();
      if (scheduleName.includes('удален') || scheduleName.includes('remote')) {
        format = 'remote';
      } else if (scheduleName.includes('гибк')) {
        format = 'hybrid';
      }
    }

    // Форматируем зарплату
    let salary = '';
    if (vacancy.salary) {
      const { from, to, currency } = vacancy.salary;
      if (from && to) {
        salary = `${from.toLocaleString('ru-RU')} - ${to.toLocaleString('ru-RU')} ${currency}`;
      } else if (from) {
        salary = `от ${from.toLocaleString('ru-RU')} ${currency}`;
      } else if (to) {
        salary = `до ${to.toLocaleString('ru-RU')} ${currency}`;
      }
    }

    // Извлекаем ключевые навыки из описания
    const tags: string[] = [];
    if (vacancy.name.toLowerCase().includes('frontend')) tags.push('Frontend');
    if (vacancy.name.toLowerCase().includes('backend')) tags.push('Backend');
    if (vacancy.name.toLowerCase().includes('python')) tags.push('Python');
    if (vacancy.name.toLowerCase().includes('java')) tags.push('Java');
    if (vacancy.name.toLowerCase().includes('javascript')) tags.push('JavaScript');
    if (vacancy.name.toLowerCase().includes('react')) tags.push('React');
    if (vacancy.name.toLowerCase().includes('аналитик')) tags.push('Аналитика');
    if (vacancy.name.toLowerCase().includes('дизайн')) tags.push('Дизайн');
    if (vacancy.name.toLowerCase().includes('стаж') || vacancy.name.toLowerCase().includes('intern')) {
      tags.push('Стажировка');
    }

    return {
      title: vacancy.name,
      company: vacancy.employer.name,
      companyDescription: '',
      description: this.cleanHtml(vacancy.description || 'Описание отсутствует'),
      requirements: vacancy.requirement ? this.cleanHtml(vacancy.requirement) : '',
      prospects: vacancy.responsibility ? this.cleanHtml(vacancy.responsibility) : '',
      location: vacancy.area?.name || 'Не указано',
      format,
      duration: vacancy.experience?.name || '',
      salary,
      applicationEmail: '',
      applicationUrl: vacancy.url,
      imageUrl: vacancy.employer.logo?.original || '',
      isActive: true,
      deadline: null,
      tags: tags.length > 0 ? tags : ['Стажировка', 'IT'],
      externalId: vacancy.id,
      source: 'hh.ru',
    };
  }

  /**
   * Очистка HTML тегов из описания
   */
  private cleanHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }

  /**
   * Импорт вакансий с HH.ru в базу данных
   */
  async importFromHh(
    searchQuery: string = 'стажировка IT',
    limit: number = 20,
  ): Promise<{ imported: number; skipped: number; items: any[] }> {
    this.logger.log(`Начало импорта вакансий с HH.ru: "${searchQuery}" (лимит: ${limit})`);

    const vacancies = await this.fetchVacanciesFromHh(searchQuery, limit);
    const imported: any[] = [];
    let skipped = 0;

    for (const vacancy of vacancies) {
      try {
        // Проверяем, есть ли уже такая вакансия по внешнему ID
        const existing = await this.internshipsService.findByExternalId(vacancy.id, 'hh.ru');
        
        if (existing) {
          this.logger.debug(`Вакансия уже существует: ${vacancy.name}`);
          skipped++;
          continue;
        }

        const transformed = this.transformHhVacancy(vacancy);
        const created = await this.internshipsService.createWithSource(transformed);
        imported.push({
          id: created.id,
          title: created.title,
          company: created.company,
          url: transformed.applicationUrl,
        });

        this.logger.log(`Импортировано: ${created.title} в ${created.company}`);
      } catch (error) {
        this.logger.error(`Ошибка импорта вакансии ${vacancy.name}:`, error);
        skipped++;
      }
    }

    this.logger.log(`Импорт завершён. Импортировано: ${imported.length}, пропущено: ${skipped}`);

    return {
      imported: imported.length,
      skipped,
      items: imported,
    };
  }

  /**
   * Проверяет, существует ли вакансия на HH.ru
   */
  private async isVacancyActive(externalId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.hhApiUrl}/${externalId}`, {
            headers: { 'User-Agent': 'ASOI-Diploma/1.0' },
          })
          .pipe(map((res: any) => res.data)),
      );
      return !(response as any).archived;
    } catch {
      // 404 или другая ошибка — вакансия недоступна
      return false;
    }
  }

  /**
   * Удаляет из базы вакансии, которых больше нет на HH.ru
   */
  async cleanupStaleVacancies(): Promise<{ removed: number; checked: number }> {
    const all = await this.internshipsService.findAllFromSource('hh.ru');
    let removed = 0;

    for (const internship of all) {
      if (!internship.externalId) continue;

      const active = await this.isVacancyActive(internship.externalId);
      if (!active) {
        await this.internshipsService.remove(internship.id);
        removed++;
        this.logger.log(`Удалена устаревшая вакансия: ${internship.title} (${internship.externalId})`);
      }

      // Пауза, чтобы не превысить лимиты HH API
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.logger.log(`Очистка завершена. Проверено: ${all.length}, удалено: ${removed}`);
    return { removed, checked: all.length };
  }

  /**
   * Автоматический импорт по расписанию
   */
  async scheduledImport() {
    const searchQueries = [
      'стажировка IT',
      'стажер программист',
      'intern developer',
      'стажировка frontend',
      'стажировка backend',
      'стажировка аналитик',
    ];

    let totalImported = 0;
    let totalSkipped = 0;

    for (const query of searchQueries) {
      try {
        const result = await this.importFromHh(query, 10);
        totalImported += result.imported;
        totalSkipped += result.skipped;
        
        // Делаем паузу между запросами, чтобы не превысить лимиты API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        this.logger.error(`Ошибка при импорте по запросу "${query}":`, error);
      }
    }

    this.logger.log(
      `Автоматический импорт завершён. Всего импортировано: ${totalImported}, пропущено: ${totalSkipped}`,
    );

    return {
      imported: totalImported,
      skipped: totalSkipped,
    };
  }
}
