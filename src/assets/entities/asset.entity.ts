import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import { AssetCategory } from '../../categories/entities/asset-category.entity';

export enum AssetStatus {
  NEW = 'NEW',
  USED = 'USED',
  DAMAGED = 'DAMAGED',
  MISSING = 'MISSING',
}

@Entity({ name: 'assets' })
export class Asset {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'asset_tag', unique: true })
  assetTag: string;

  @ManyToOne(() => AssetCategory, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: AssetCategory;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.USED })
  status: AssetStatus;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ name: 'serial_no', nullable: true, unique: true })
  serialNo?: string;

  @Column({ nullable: true })
  notes?: string;
}
