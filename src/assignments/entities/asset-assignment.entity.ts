import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity({ name: 'asset_assignments' })
export class AssetAssignment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @ManyToOne(() => Asset, { nullable: false })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'assigned_at', type: 'timestamptz', default: () => 'now()' })
  assignedAt: Date;

  @Column({ name: 'unassigned_at', type: 'timestamptz', nullable: true })
  unassignedAt?: Date;

  @Column({ name: 'assigned_by', nullable: true })
  assignedBy?: string;

  @Column({ nullable: true })
  notes?: string;
}
