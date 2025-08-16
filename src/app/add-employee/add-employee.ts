import { Component, computed, inject } from '@angular/core';
import { EmployeeService } from '../employees/employee.service';
import { Employee } from '../employees/employee.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import DOMPurify from 'dompurify';
import { Departments } from '../constants/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

function noScriptTagsValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (typeof value !== 'string') return null;

  const sanitized = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  if (sanitized !== value) {
    return { containsHtml: true };
  }

  return null;
}

function formatDate(dateOfJoining: string) {
  const date = new Date(dateOfJoining);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const formatted = `${year}-${month}-${day}`;
  return formatted;
}

@Component({
  selector: 'app-add-employee',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee {
  private employeeService = inject(EmployeeService);
  readonly dialogRef = inject(MatDialogRef<Employee>);
  readonly data = inject<{
    type: 'UPDATE' | 'ADD';
    employee: Employee | null;
  }>(MAT_DIALOG_DATA);

  readonly isEditMode = computed(() => this.data.type === 'UPDATE');

  form = new FormGroup({
    name: new FormControl(this.data.employee?.name, {
      validators: [Validators.required, noScriptTagsValidator],
    }),
    email: new FormControl(this.data.employee?.email, {
      validators: [
        Validators.email,
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
        noScriptTagsValidator,
      ],
    }),
    dateOfJoining: new FormControl(this.data.employee?.dateOfJoining, {
      validators: [Validators.required],
    }),
    department: new FormControl(this.data.employee?.department, {
      validators: [Validators.required],
    }),
    salary: new FormControl(this.data.employee?.salary!, {
      validators: [Validators.required, Validators.min(1)],
    }),
  });
  submitted = false;
  updating = false;

  departments: string[] = Departments;

  get name() {
    return this.form.controls.name;
  }

  get email() {
    return this.form.controls.email;
  }

  get dateOfJoining() {
    return this.form.controls.dateOfJoining;
  }

  get department() {
    return this.form.controls.department;
  }

  get salary() {
    return this.form.controls.salary;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      // add new employee service to be called
      let newEmployee = {
        name: this.form.value.name!,
        email: this.form.value.email!,
        department: this.form.value.department!,
        salary: this.form.value.salary!,
        dateOfJoining: formatDate(this.form.value.dateOfJoining!),
      };
      console.log('Adding new employee');
      console.log("New Employee details: ", newEmployee);
      this.employeeService.addEmployee(newEmployee);
      this.dialogRef.close();
      this.submitted = false;
    }
  }

  updateEmployee() {
    this.submitted = true;
    if (this.form.valid) {
      // let oldEmployee =
      let updatedEmployeeDetails = {
        id: this.data.employee?.id!,
        name: this.form.value.name!,
        email: this.form.value.email!,
        department: this.form.value.department!,
        salary: this.form.value.salary!,
        dateOfJoining: formatDate(this.form.value.dateOfJoining!),
      };
      console.log('Updating EMployee: ', updatedEmployeeDetails);
      // update service method to be called
      this.employeeService.saveEmployee(updatedEmployeeDetails);
      this.dialogRef.close();
      this.submitted = false;
    }
  }
}
