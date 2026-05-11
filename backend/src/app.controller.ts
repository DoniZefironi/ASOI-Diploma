// src/app.controller.ts
import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Post('ai/chat')
  async aiChat(@Body() body: { apiKey: string; folderId: string; messages: any[] }) {
    const { apiKey, folderId, messages } = body;
    if (!apiKey || !folderId) {
      throw new HttpException('apiKey и folderId обязательны', HttpStatus.BAD_REQUEST);
    }
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
          {
            modelUri: `gpt://${folderId}/yandexgpt-lite`,
            completionOptions: { stream: false, temperature: 0.4, maxTokens: 800 },
            messages,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Api-Key ${apiKey}`,
            },
          },
        ),
      );
      return data;
    } catch (e: any) {
      const status = e?.response?.status || 502;
      const msg = e?.response?.data?.message || e?.message || 'Ошибка Yandex API';
      throw new HttpException(msg, status);
    }
  }
}
