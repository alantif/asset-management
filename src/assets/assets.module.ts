import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { AssetAssignment } from '../assignments/entities/asset-assignment.entity';
import { AssetCategory } from '../categories/entities/asset-category.entity';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetCategory, AssetAssignment])],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
