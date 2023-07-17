export class CreateEmployeeDto {
    readonly name: string;
    readonly age: number;
    readonly address: string;
    readonly position: string;
    readonly salary: number;
    readonly official_email: string;
    readonly contacts: [{type: string, value: string}]
  }
  
export class UpdateEmployeeDto {
    readonly name?: string;
    readonly age?: number;
    readonly address?: string;
    readonly position?: string;
    readonly salary?: number;
    readonly contacts: [{action: string, type: string, value: string}]
  }
  