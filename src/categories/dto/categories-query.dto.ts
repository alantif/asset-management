import { IsIn, IsOptional } from 'class-validator';

export class CategoriesQueryDto {
  @IsOptional()
  @IsIn(['true', 'false'])
  active?: 'true' | 'false';
}
