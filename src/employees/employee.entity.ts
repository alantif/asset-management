import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'employee_no', nullable: true, unique: true })
  employeeNo?: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;
}
