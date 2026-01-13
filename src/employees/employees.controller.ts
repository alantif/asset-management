import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesQueryDto } from './dto/employees-query.dto';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';

@Controller('api/employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() q: EmployeesQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateEmployeeStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Get(':id/details')
  details(@Param('id') id: string) {
    return this.service.getEmployeeDetails(id);
  }
}
