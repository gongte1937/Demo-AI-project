import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IdeasService } from './ideas.service';
import { QueryIdeasDto } from './dto/query-ideas.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { IdeaOwnerGuard } from '../common/guards/idea-owner.guard';

@Controller('ideas')
@UseGuards(JwtAuthGuard)
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Get()
  async findAll(
    @Request() req: { user: { id: string } },
    @Query() query: QueryIdeasDto,
  ) {
    const data = await this.ideasService.findAll(req.user.id, query);
    return { success: true, data };
  }

  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async create(
    @Request() req: { user: { id: string } },
    @UploadedFile() file: Express.Multer.File,
    @Body('manualNote') manualNote?: string,
  ) {
    const idea = await this.ideasService.createFromAudio(req.user.id, file, manualNote);
    return { success: true, data: { idea } };
  }

  @Get(':id')
  @UseGuards(IdeaOwnerGuard)
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const idea = await this.ideasService.findOne(req.user.id, id);
    return { success: true, data: { idea } };
  }

  @Put(':id')
  @UseGuards(IdeaOwnerGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIdeaDto,
  ) {
    const idea = await this.ideasService.update(id, dto);
    return { success: true, data: { idea } };
  }

  @Delete(':id')
  @UseGuards(IdeaOwnerGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.ideasService.remove(id);
    return { success: true, message: 'Idea deleted successfully' };
  }
}
