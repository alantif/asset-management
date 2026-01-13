import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { AssetAssignment } from '../assignments/entities/asset-assignment.entity';
import { AssetsQueryDto } from './dto/assets-query.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private readonly assetsRepo: Repository<Asset>,
    @InjectRepository(AssetAssignment) private readonly assignmentsRepo: Repository<AssetAssignment>,
  ) {}

  async findAll(q: AssetsQueryDto) {
    const qb = this.assetsRepo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.category', 'c')
      .leftJoinAndSelect(
        AssetAssignment,
        'aa',
        'aa.asset_id = a.id AND aa.unassigned_at IS NULL',
      )
      .leftJoinAndSelect('aa.employee', 'e')
      .select([
        'a.id',
        'a.assetTag',
        'a.status',
        'a.brand',
        'a.model',
        'a.serialNo',
        'a.notes',
        'c.id',
        'c.name',
        'aa.id',
        'aa.assignedAt',
        'e.id',
        'e.fullName',
        'e.employeeNo',
        'e.status',
      ]);

    if (q.categoryId) qb.andWhere('c.id = :categoryId', { categoryId: q.categoryId });
    if (q.status) qb.andWhere('a.status = :status', { status: q.status });

    if (q.assigned === 'true') qb.andWhere('aa.id IS NOT NULL');
    if (q.assigned === 'false') qb.andWhere('aa.id IS NULL');

    if (q.search) {
      qb.andWhere(
        new Brackets((b) => {
          b.where('a.asset_tag ILIKE :s', { s: `%${q.search}%` })
            .orWhere('a.serial_no ILIKE :s', { s: `%${q.search}%` })
            .orWhere('a.brand ILIKE :s', { s: `%${q.search}%` })
            .orWhere('a.model ILIKE :s', { s: `%${q.search}%` });
        }),
      );
    }

    return qb.getRawMany(); // keeps it simple for PrimeNG table
  }
}
