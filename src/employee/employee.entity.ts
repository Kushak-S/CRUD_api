import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, Index } from 'typeorm';

@Entity({name: 'employees'})
export class Employee {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;
    
    @Column({ length: 500 })
    name: string;

    @Column({unique: true}) 
    official_email: string;
    
    @Column('int')
    age: number;
    
    @Column({ length: 500 })
    address: string;

    @Column({ length: 500 })
    position: string;
    
    @Column('int')
    salary: number;

    @OneToMany(() => Contact, contact => contact.employee, { cascade: true })
    contacts: Contact[];
}

@Entity({name: 'contacts'})
export class Contact {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    type: string;

    @Column()
    value: string;

    @ManyToOne(() => Employee, employee => employee.contacts)
    employee: Employee;

}