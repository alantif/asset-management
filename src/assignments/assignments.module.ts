import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { AssetAssignment } from './entities/asset-assignment.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Employee } from '../employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetAssignment, Asset, Employee])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
