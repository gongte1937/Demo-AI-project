import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }

    this.client = createClient(url, key);
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async uploadFile(bucket: string, path: string, file: Buffer, contentType: string): Promise<string> {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, file, { contentType, upsert: false });

    if (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }

    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([path]);
    if (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }
}
