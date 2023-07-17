import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact, Employee } from './employee.entity';
import { Repository } from 'typeorm';
import { CreateEmployeeDto, UpdateEmployeeDto } from './employee.dto';

@Injectable()
export class EmployeeService {

  constructor(
    @InjectRepository(Employee) private empRepository: Repository<Employee>,
    @InjectRepository(Contact) private conRepository: Repository<Contact>,
  ) {}
  
  // getAllEmployees_____________________________________________________________
  async getAllEmployees(page: number = 1) {
    const limit = 1;
    const [users, total] = await this.empRepository.findAndCount({relations: ['contacts'], take: limit, skip: limit*(page-1)});
    return {
      data:users,
      total,
      page
    };
  }

  // getEmployeeById_____________________________________________________________
  async getEmployeeById(id: number) {
    const employee = await this.empRepository.findOne({where: {id}, relations: ['contacts']});
    if (!employee) {
      throw new NotFoundException('Could not find employee');
    }
    return employee;
  }

  // createEmployee_____________________________________________________________
  async createEmployee(empData: CreateEmployeeDto) { 
    const {contacts, ...empDetails} = empData;
    const checkEmail = await this.empRepository.findOneBy({official_email: empDetails.official_email});
    if(checkEmail) throw new BadRequestException('Employee already exists');

    const newEmployee = this.empRepository.create(empDetails);
    const savedUser = await this.empRepository.save(newEmployee);
    for(let contact of contacts) {
      await this.addContact(savedUser, contact);
    }
    return {savedUser, contacts};
  }

  // UpdataEmployee_____________________________________________________________
  async updateEmployee(
    id: number,
    empData: UpdateEmployeeDto,
  ) {
    const {contacts, ...empDetails} = empData;
    const employee = await this.empRepository.findOneBy({id});
    if (!employee) {
      throw new NotFoundException('Could not find employee');
    }

    if(contacts){
      for(let contact of contacts) {
        const {action, ...contactDetails} = contact;
        if(action === 'add') {
          await this.addContact(employee, contactDetails);
        } else if(action === 'delete') {
          await this.deleteContact(employee, contactDetails);
        }
      }
    }
    await this.empRepository.update(id, empDetails);
    return await this.empRepository.findOne({where: {id}, relations: ['contacts']});
  }


  // deleteEmployee_____________________________________________________________
  async deleteEmployee(id: number): Promise<Employee> {
    const employee = await this.empRepository.findOne({where: {id}, relations: ['contacts']});
    if (!employee) {
      throw new NotFoundException('Could not find employee');
    }
    await this.conRepository.delete({employee});
    await this.empRepository.delete(id);
    return employee;
  }

  // addContact_____________________________________________________________
  async addContact(employee: Employee, contact: {type: string, value: string}) {
    const checkContact = await this.conRepository.findOne({where: {...contact, employee}});
    if(!checkContact){
      await this.conRepository.save({...contact, employee: employee});
    }
  }

  // deleteContact_____________________________________________________________
  async deleteContact(employee: Employee, contact: {type: string, value: string}){
    const checkContact = await this.conRepository.findOne({where: {...contact, employee}});
    if(checkContact){
      await this.conRepository.delete({...contact, employee });
    }
  }

}
