import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { isSameDay, startOfDay, endOfWeek } from 'date-fns';
import { Readable } from 'stream';
import * as path from 'path';

interface TimeExtractionResult {
  extractedTime: Date | null;
  timeCategory: string;
}

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribeAudio(buffer: Buffer, filename: string): Promise<string> {
    try {
      const ext = path.extname(filename) || '.webm';
      const readable = Readable.from(buffer);
      (readable as NodeJS.ReadableStream & { name?: string }).name = `audio${ext}`;

      const response = await this.openai.audio.transcriptions.create({
        file: readable as unknown as File,
        model: 'whisper-1',
        language: 'zh',
      });

      return response.text;
    } catch (error) {
      this.logger.error('Transcription failed', error);
      throw new InternalServerErrorException('Audio transcription failed');
    }
  }

  extractTimeAndCategory(transcription: string): TimeExtractionResult {
    const extractedTime = this.extractTime(transcription);
    const timeCategory = this.categorizeByTime(extractedTime);
    return { extractedTime, timeCategory };
  }

  private extractTime(text: string): Date | null {
    const now = new Date();
    const lower = text.toLowerCase();

    if (lower.includes('明天') || lower.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    if (lower.includes('后天') || lower.includes('day after tomorrow')) {
      const dayAfter = new Date(now);
      dayAfter.setDate(dayAfter.getDate() + 2);
      return dayAfter;
    }

    if (lower.includes('下周') || lower.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }

    if (lower.includes('今天') || lower.includes('today') || lower.includes('今晚') || lower.includes('tonight')) {
      return now;
    }

    const monthDayMatch = text.match(/(\d{1,2})月(\d{1,2})[日号]/);
    if (monthDayMatch) {
      const month = parseInt(monthDayMatch[1]) - 1;
      const day = parseInt(monthDayMatch[2]);
      const date = new Date(now.getFullYear(), month, day);
      if (date < now) date.setFullYear(date.getFullYear() + 1);
      return date;
    }

    return null;
  }

  private categorizeByTime(extractedTime: Date | null): string {
    if (!extractedTime) return 'inbox';

    const now = new Date();
    const today = startOfDay(now);
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    if (isSameDay(extractedTime, today)) return 'today';
    if (extractedTime <= weekEnd) return 'thisWeek';
    return 'future';
  }
}
