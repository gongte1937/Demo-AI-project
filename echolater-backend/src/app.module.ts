import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IdeasModule } from './ideas/ideas.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    IdeasModule,
    UploadModule,
    AiModule,
  ],
})
export class AppModule {}
