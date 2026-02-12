import { IsOptional, IsString, IsArray, IsBoolean, IsDateString } from 'class-validator';

export class UpdateIdeaDto {
  @IsOptional()
  @IsString()
  transcription?: string;

  @IsOptional()
  @IsDateString()
  extractedTime?: string;

  @IsOptional()
  @IsString()
  timeCategory?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
