import { Controller, Get, Post, Delete, Body, Param, Patch, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  getAllEmployees(@Query('page') page: number) {
    return this.employeeService.getAllEmployees(page);
  }

  @Get(':id')
  getEmployeeById(@Param('id') id: number) {
    return this.employeeService.getEmployeeById(id);
  }

  @Post()
  createEmployee(@Body() empData: CreateEmployeeDto) {
    return this.employeeService.createEmployee(empData);
  }

  @Patch(':id')
  updateEmployee(
    @Param('id') id: number,
    @Body() empData: UpdateEmployeeDto,
  ) {
    return this.employeeService.updateEmployee(id, empData);
  }

  @Delete(':id')
  deleteEmployee(@Param('id') id: number) {
    return this.employeeService.deleteEmployee(id);
  }
}
