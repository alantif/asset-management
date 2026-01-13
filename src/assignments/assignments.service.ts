import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AssetAssignment } from './entities/asset-assignment.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Employee } from '../employees/entities/employee.entity';
import { AssignDto } from './dto/assign.dto';
import { UnassignDto } from './dto/unassign.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(AssetAssignment) private readonly assignmentsRepo: Repository<AssetAssignment>,
    @InjectRepository(Asset) private readonly assetsRepo: Repository<Asset>,
    @InjectRepository(Employee) private readonly employeesRepo: Repository<Employee>,
  ) {}

  async assign(dto: AssignDto) {
    const asset = await this.assetsRepo.findOne({ where: { id: String(dto.assetId) } });
    if (!asset) throw new NotFoundException('Asset not found');

    const employee = await this.employeesRepo.findOne({ where: { id: String(dto.employeeId) } });
    if (!employee) throw new NotFoundException('Employee not found');

    try {
      const assignment = this.assignmentsRepo.create({
        asset,
        employee,
        assignedBy: dto.assignedBy,
        notes: dto.notes,
      });

      return await this.assignmentsRepo.save(assignment);
    } catch (e: any) {
      // Postgres unique violation = 23505
      if (e?.code === '23505') {
        throw new ConflictException('Asset is already assigned. Unassign it first.');
      }
      throw e;
    }
  }

  async unassign(dto: UnassignDto) {
    const active = await this.assignmentsRepo.findOne({
      where: {
        asset: { id: String(dto.assetId) },
        unassignedAt: IsNull(),
      },
      relations: ['asset', 'employee'],
    });

    if (!active) throw new NotFoundException('No active assignment found for this asset');

    active.unassignedAt = new Date();

    // optionally append notes
    if (dto.notes) active.notes = active.notes ? `${active.notes}\n${dto.notes}` : dto.notes;

    return await this.assignmentsRepo.save(active);
  }
}
