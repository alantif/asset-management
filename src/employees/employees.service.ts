import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesQueryDto } from './dto/employees-query.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';
import { AssetAssignment } from '../assignments/entities/asset-assignment.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly employeesRepo: Repository<Employee>,
    @InjectRepository(AssetAssignment) private readonly assignmentsRepo: Repository<AssetAssignment>,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const emp = this.employeesRepo.create(dto);
    return this.employeesRepo.save(emp);
  }

  async findAll(q: EmployeesQueryDto) {
    const qb = this.employeesRepo.createQueryBuilder('e');

    if (q.status) qb.andWhere('e.status = :status', { status: q.status });

    if (q.search) {
      qb.andWhere(
        new Brackets((b) => {
          b.where('e.full_name ILIKE :s', { s: `%${q.search}%` })
            .orWhere('e.employee_no ILIKE :s', { s: `%${q.search}%` })
            .orWhere('e.email ILIKE :s', { s: `%${q.search}%` });
        }),
      );
    }

    qb.orderBy('e.id', 'DESC');
    return qb.getMany();
  }

  async findOne(id: string) {
    const emp = await this.employeesRepo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('Employee not found');
    return emp;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const emp = await this.findOne(id);
    Object.assign(emp, dto);
    return this.employeesRepo.save(emp);
  }

  async updateStatus(id: string, dto: UpdateEmployeeStatusDto) {
    const emp = await this.findOne(id);
    emp.status = dto.status;
    return this.employeesRepo.save(emp);
  }

  /**
   * Employee details for UI:
   * - currentAssets: assets assigned right now
   * - history: assignments in last 6 months (default)
   */
  async getEmployeeDetails(id: string) {
    await this.findOne(id); // ensure exists

    // Current assets (active assignments)
    const currentAssets = await this.assignmentsRepo
      .createQueryBuilder('aa')
      .innerJoinAndSelect('aa.asset', 'a')
      .innerJoinAndSelect('a.category', 'c')
      .where('aa.employee_id = :id', { id })
      .andWhere('aa.unassigned_at IS NULL')
      .select([
        'aa.id',
        'aa.assignedAt',
        'a.id',
        'a.assetTag',
        'a.status',
        'a.brand',
        'a.model',
        'a.serialNo',
        'c.id',
        'c.name',
      ])
      .orderBy('aa.assigned_at', 'DESC')
      .getMany();

    // History (last 6 months)
    const history = await this.assignmentsRepo
      .createQueryBuilder('aa')
      .innerJoinAndSelect('aa.asset', 'a')
      .innerJoinAndSelect('a.category', 'c')
      .where('aa.employee_id = :id', { id })
      .andWhere("aa.assigned_at >= now() - interval '6 months'")
      .select([
        'aa.id',
        'aa.assignedAt',
        'aa.unassignedAt',
        'aa.assignedBy',
        'aa.notes',
        'a.id',
        'a.assetTag',
        'a.status',
        'c.id',
        'c.name',
      ])
      .orderBy('aa.assigned_at', 'DESC')
      .getMany();

    return { employeeId: id, currentAssets, history };
  }
}
