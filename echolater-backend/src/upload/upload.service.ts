import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const ALLOWED_AUDIO_TYPES = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const AUDIO_BUCKET = 'audio-recordings';

@Injectable()
export class UploadService {
  constructor(private readonly supabase: SupabaseService) {}

  async uploadAudio(file: Express.Multer.File): Promise<string> {
    this.validateAudioFile(file);

    const ext = path.extname(file.originalname) || '.webm';
    const storagePath = `recordings/${uuidv4()}${ext}`;

    const publicUrl = await this.supabase.uploadFile(
      AUDIO_BUCKET,
      storagePath,
      file.buffer,
      file.mimetype,
    );

    return publicUrl;
  }

  async deleteAudio(audioUrl: string): Promise<void> {
    const url = new URL(audioUrl);
    const pathParts = url.pathname.split(`/${AUDIO_BUCKET}/`);
    if (pathParts.length < 2) return;

    const storagePath = pathParts[1];
    await this.supabase.deleteFile(AUDIO_BUCKET, storagePath);
  }

  private validateAudioFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    if (!ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_AUDIO_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the 50MB limit');
    }
  }
}
