import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'asset_categories' })
export class AssetCategory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
