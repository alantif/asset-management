import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AssetCategory } from './entities/asset-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AssetCategory])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [TypeOrmModule], // optional
})
export class CategoriesModule {}
