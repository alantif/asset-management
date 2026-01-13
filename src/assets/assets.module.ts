import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { Asset } from './entities/asset.entity';
import { AssetCategory } from '../categories/entities/asset-category.entity';
import { AssetAssignment } from '../assignments/entities/asset-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asset, AssetCategory, AssetAssignment])],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
