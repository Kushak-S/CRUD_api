import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact, Employee } from './employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Contact])],
  controllers: [EmployeeController],
  providers: [EmployeeService]
})
export class EmployeeModule {}
