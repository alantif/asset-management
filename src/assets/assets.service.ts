import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Asset, AssetStatus } from './entities/asset.entity';
import { AssetCategory } from '../categories/entities/asset-category.entity';
import { AssetAssignment } from '../assignments/entities/asset-assignment.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetsQueryDto } from './dto/assets-query.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private readonly assetsRepo: Repository<Asset>,
    @InjectRepository(AssetCategory) private readonly categoriesRepo: Repository<AssetCategory>,
    @InjectRepository(AssetAssignment) private readonly assignmentsRepo: Repository<AssetAssignment>,
  ) {}

  private async getActiveCategoryOrThrow(categoryId: number) {
    const cat = await this.categoriesRepo.findOne({ where: { id: String(categoryId) } });
    if (!cat) throw new NotFoundException('Category not found');
    if (!cat.isActive) throw new BadRequestException('Category is inactive');
    return cat;
  }

  async create(dto: CreateAssetDto) {
    const category = await this.getActiveCategoryOrThrow(dto.categoryId);

    try {
      const asset = this.assetsRepo.create({
        assetTag: dto.assetTag.trim(),
        category,
        status: dto.status ?? AssetStatus.USED,
        brand: dto.brand?.trim(),
        model: dto.model?.trim(),
        serialNo: dto.serialNo?.trim(),
        notes: dto.notes,
      });
      return await this.assetsRepo.save(asset);
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('Asset tag or serial number already exists');
      throw e;
    }
  }

  async update(id: string, dto: UpdateAssetDto) {
    const asset = await this.assetsRepo.findOne({ where: { id }, relations: ['category'] });
    if (!asset) throw new NotFoundException('Asset not found');

    if (dto.categoryId !== undefined) {
      asset.category = await this.getActiveCategoryOrThrow(dto.categoryId);
    }

    if (dto.assetTag !== undefined) asset.assetTag = dto.assetTag.trim();
    if (dto.status !== undefined) asset.status = dto.status;
    if (dto.brand !== undefined) asset.brand = dto.brand?.trim();
    if (dto.model !== undefined) asset.model = dto.model?.trim();
    if (dto.serialNo !== undefined) asset.serialNo = dto.serialNo?.trim();
    if (dto.notes !== undefined) asset.notes = dto.notes;

    try {
      return await this.assetsRepo.save(asset);
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('Asset tag or serial number already exists');
      throw e;
    }
  }

  async findOne(id: string) {
    const asset = await this.assetsRepo.findOne({ where: { id }, relations: ['category'] });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  // PrimeNG table endpoint: includes current assignment if any
  async findAll(q: AssetsQueryDto) {
    const qb = this.assetsRepo
      .createQueryBuilder('a')
      .leftJoin('a.category', 'c')
      .leftJoin(AssetAssignment, 'aa', 'aa.asset_id = a.id AND aa.unassigned_at IS NULL')
      .leftJoin('aa.employee', 'e')
      .select([
        'a.id AS "id"',
        'a.asset_tag AS "assetTag"',
        'a.status AS "status"',
        'a.brand AS "brand"',
        'a.model AS "model"',
        'a.serial_no AS "serialNo"',
        'c.id AS "categoryId"',
        'c.name AS "categoryName"',
        'aa.id AS "activeAssignmentId"',
        'aa.assigned_at AS "assignedAt"',
        'e.id AS "employeeId"',
        'e.full_name AS "employeeName"',
        'e.employee_no AS "employeeNo"',
      ])
      .orderBy('a.id', 'DESC');

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

    return qb.getRawMany();
  }
}
