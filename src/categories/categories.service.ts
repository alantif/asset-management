import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetCategory } from './entities/asset-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesQueryDto } from './dto/categories-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(AssetCategory)
    private readonly repo: Repository<AssetCategory>,
  ) {}

  async create(dto: CreateCategoryDto) {
    try {
      const category = this.repo.create({ name: dto.name.trim() });
      return await this.repo.save(category);
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('Category name already exists');
      throw e;
    }
  }

  async findAll(q: CategoriesQueryDto) {
    const qb = this.repo.createQueryBuilder('c').orderBy('c.name', 'ASC');

    if (q.active === 'true') qb.where('c.is_active = true');
    if (q.active === 'false') qb.where('c.is_active = false');

    return qb.getMany();
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');

    if (dto.name !== undefined) cat.name = dto.name.trim();
    if (dto.isActive !== undefined) cat.isActive = dto.isActive;

    try {
      return await this.repo.save(cat);
    } catch (e: any) {
      if (e?.code === '23505') throw new ConflictException('Category name already exists');
      throw e;
    }
  }

  async activate(id: string) {
    return this.update(id, { isActive: true });
  }

  async deactivate(id: string) {
    return this.update(id, { isActive: false });
  }
}
