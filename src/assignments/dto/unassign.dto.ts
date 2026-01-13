import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UnassignDto {
  @IsInt()
  @Min(1)
  assetId: number;

  @IsOptional()
  @IsString()
  unassignedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
