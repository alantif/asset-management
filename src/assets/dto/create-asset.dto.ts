import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { AssetStatus } from '../entities/asset.entity';

export class CreateAssetDto {
  @IsString()
  @MaxLength(100)
  assetTag: string;

  @IsInt()
  @Min(1)
  categoryId: number;

  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  model?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNo?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
