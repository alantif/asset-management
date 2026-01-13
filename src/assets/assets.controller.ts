import { Controller, Get, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsQueryDto } from './dto/assets-query.dto';

@Controller('api/assets')
export class AssetsController {
  constructor(private readonly service: AssetsService) {}

  @Get()
  findAll(@Query() q: AssetsQueryDto) {
    return this.service.findAll(q);
  }
}
