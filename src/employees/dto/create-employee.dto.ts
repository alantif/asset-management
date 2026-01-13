import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EmployeeStatus } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  employeeNo?: string;

  @IsString()
  @MaxLength(200)
  fullName: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  email?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus; // defaults to ACTIVE in entity
}
