import { Component, inject } from '@angular/core';
import { AddEmployee } from '../add-employee/add-employee';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../employees/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../employees/employee.model';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  private employeeService = inject(EmployeeService);
  displayedColumns: string[] = ['name', 'email', "gender", 'department', 'salary', "phone", "state", "city", "pincode", "dateOfJoining", "edit", "delete"];
  // dataSource = new MatTableDataSource<Employee>(this.employeeService.getEmployees());

  readonly dialog = inject(MatDialog);

  openDialog(type: string, employee: any): void {

    const dialogRef = this.dialog.open(AddEmployee, {
      data: {type: type, employee: employee},
      panelClass: 'add-dialog',
      disableClose: true,
      autoFocus: false,
    });

    // dialogRef.afterClosed().subscribe(() => {
    //   // console.log('The dialog was closed');
    //   if (employees !== undefined) {
    //     // this.dataSource.data = employees;
    //   }
    // });
  }

}
