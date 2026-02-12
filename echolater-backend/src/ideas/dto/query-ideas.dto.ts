import { IsOptional, IsInt, Min, Max, IsString, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryIdeasDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  timeCategory?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}
