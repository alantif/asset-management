import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AssignDto {
  @IsInt()
  @Min(1)
  assetId: number;

  @IsInt()
  @Min(1)
  employeeId: number;

  @IsOptional()
  @IsString()
  assignedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
