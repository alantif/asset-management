import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { AssetAssignment } from '../assignments/entities/asset-assignment.entity';
import { Asset } from '../assets/entities/asset.entity';
import { AssetCategory } from '../categories/entities/asset-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, AssetAssignment, Asset, AssetCategory])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
