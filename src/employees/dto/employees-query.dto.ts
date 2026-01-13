import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmployeeStatus } from '../entities/employee.entity';

export class EmployeesQueryDto {
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
