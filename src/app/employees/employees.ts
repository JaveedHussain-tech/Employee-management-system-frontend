import { Component, computed, effect, inject, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from './employee.model';
import { EmployeeService } from './employee.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployee } from '../add-employee/add-employee';
import { DeleteEmployee } from '../delete-employee/delete-employee';

@Component({
  selector: 'app-employees',
  imports: [MatTableModule, MatIconModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees implements OnInit  {
  displayedColumns: string[] = ['name', 'email', "dateOfJoining", 'department', 'salary', "edit", "delete"];
  dataSource = new MatTableDataSource<Employee>([]);
  private employeeService = inject(EmployeeService);
  private latestEmployees = computed(() => this.employeeService.getLatestEmployees());
  readonly dialog = inject(MatDialog);

  ngOnInit() {
    this.employeeService.getEmployees().subscribe((data) => {
      this.dataSource =  new MatTableDataSource<Employee>(data);
      console.log("OnInit ", data);
    });
  }

  constructor() {
    effect(() => {
      this.dataSource =  new MatTableDataSource<Employee>(this.latestEmployees()());
    });
  }

   onEdit(element: Employee) {
    this.openDialog('UPDATE', element);
  }

  onDelete(element: Employee) {
    this.openDeleteDialog(element.id);
  }

  openDialog(type: string, employee: any): void {

    const dialogRef = this.dialog.open(AddEmployee, {
      data: {type: type, employee: employee},
      panelClass: 'add-dialog',
      disableClose: true,
      autoFocus: false,
    });

    // dialogRef.afterClosed().subscribe(employee => {
    //   // console.log('The dialog was closed');
    //   if (employee !== undefined) {
    //     this.dataSource.data = [...this.latestEmployees()(), employee];
    //   }
    // });
  };

  openDeleteDialog(id: number) {
    const deleteDialogRef = this.dialog.open(DeleteEmployee, {
      data: { id: id},
      panelClass: 'delete-dialog',
    })

    // deleteDialogRef.afterClosed().subscribe(employees => {
    //   // console.log('The dialog was closed');
    //   if (employees !== undefined) {
    //     this.dataSource.data = employees;
    //   }
    // });
  }

}
