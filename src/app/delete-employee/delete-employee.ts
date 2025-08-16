import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../employees/employee.service';
import { Employee } from '../employees/employee.model';

@Component({
  selector: 'app-delete-employee',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
  ],
  templateUrl: './delete-employee.html',
  styleUrl: './delete-employee.css',
})
export class DeleteEmployee {

  private employeeService = inject(EmployeeService);
  readonly dialogRef = inject(MatDialogRef<Employee>);
  readonly data = inject<{ id: number}>(MAT_DIALOG_DATA);
  id = this.data.id;
  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteEmployee() {
    // call delete service method here
  this.employeeService.deleteEmployee(this.id);
    this.dialogRef.close();
  }

}
