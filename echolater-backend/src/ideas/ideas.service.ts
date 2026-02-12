import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { UploadService } from '../upload/upload.service';
import { QueryIdeasDto } from './dto/query-ideas.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';

@Injectable()
export class IdeasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(userId: string, query: QueryIdeasDto) {
    const { page = 1, limit = 20, timeCategory, isCompleted, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.IdeaWhereInput = { userId };

    if (timeCategory) where.timeCategory = timeCategory;
    if (isCompleted !== undefined) where.isCompleted = isCompleted;
    if (search) {
      where.transcription = { contains: search, mode: 'insensitive' };
    }

    const [ideas, total] = await Promise.all([
      this.prisma.idea.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.idea.count({ where }),
    ]);

    return {
      ideas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const idea = await this.prisma.idea.findFirst({
      where: { id, userId },
    });

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }

    return idea;
  }

  async createFromAudio(userId: string, file: Express.Multer.File, manualNote?: string) {
    const audioUrl = await this.uploadService.uploadAudio(file);

    const transcription = manualNote ?? await this.aiService.transcribeAudio(file.buffer, file.originalname);

    const { extractedTime, timeCategory } = this.aiService.extractTimeAndCategory(transcription);

    const idea = await this.prisma.idea.create({
      data: {
        userId,
        audioUrl,
        audioFileName: file.originalname,
        audioDuration: 0,
        transcription,
        extractedTime,
        timeCategory,
        tags: [],
      },
    });

    return idea;
  }

  async update(id: string, dto: UpdateIdeaDto) {
    const data: Prisma.IdeaUpdateInput = { ...dto };

    if (dto.extractedTime) {
      data.extractedTime = new Date(dto.extractedTime);
    }

    if (dto.isCompleted !== undefined) {
      data.completedAt = dto.isCompleted ? new Date() : null;
    }

    const idea = await this.prisma.idea.update({ where: { id }, data });
    return idea;
  }

  async remove(id: string) {
    await this.prisma.idea.delete({ where: { id } });
  }
}
