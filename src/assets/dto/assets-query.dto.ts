import { IsBooleanString, IsEnum, IsOptional, IsString, IsNumberString } from 'class-validator';
import { AssetStatus } from '../entities/asset.entity';

export class AssetsQueryDto {
  @IsOptional()
  @IsNumberString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;

  // "true" | "false" as string from query params
  @IsOptional()
  @IsBooleanString()
  assigned?: 'true' | 'false';

  @IsOptional()
  @IsString()
  search?: string;
}
