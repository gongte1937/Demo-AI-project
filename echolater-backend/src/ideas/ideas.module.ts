import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { AiModule } from '../ai/ai.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [AiModule, UploadModule],
  providers: [IdeasService],
  controllers: [IdeasController],
})
export class IdeasModule {}
