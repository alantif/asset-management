import { Body, Controller, Post } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignDto } from './dto/assign.dto';
import { UnassignDto } from './dto/unassign.dto';

@Controller('api/assignments')
export class AssignmentsController {
  constructor(private readonly service: AssignmentsService) {}

  @Post('assign')
  assign(@Body() dto: AssignDto) {
    return this.service.assign(dto);
  }

  @Post('unassign')
  unassign(@Body() dto: UnassignDto) {
    return this.service.unassign(dto);
  }
}
