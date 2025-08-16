import { inject, Injectable, signal } from "@angular/core";
import { Employee, NewEmployee } from "./employee.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn:"root"
})
export class EmployeeService {

    //  employees: Employee[] = [];
     employees = signal<Employee[]>([]);
    private httpClient = inject(HttpClient);

    constructor() {
        this.setEmployees();
    }

    getLatestEmployees() {
        return this.employees.asReadonly();
    }

    getEmployees() {
       return this.httpClient.get<Employee[]>("http://localhost:8080/employees");
    }

    setEmployees() {
        this.httpClient.get<Employee[]>("http://localhost:8080/employees").subscribe((data) => {
            this.employees.set(data);
        })
    }

    addEmployee(newEmployee: NewEmployee) {
        this.httpClient.post<Employee>("http://localhost:8080/employee/add", newEmployee).subscribe((addedEmployee) => {
            this.employees.update((prevData) => {
                console.log("Prev Data", prevData);
                const newDetails = [...prevData, addedEmployee];
                console.log("New Details = ", newDetails);
                return newDetails;
            });
        })
    }

    saveEmployee(employeeData: Employee) {
        this.httpClient.put<Employee>("http://localhost:8080/employee/update", employeeData).subscribe((updatedData) => {
            this.employees.update((prev) => {
                return prev.map((employee) => {
                        if(employee.id === employeeData.id) {
                            return updatedData;
                        }
                        else {
                           return employee;
                        }
                    });
            });
        });
    };

    deleteEmployee(id: number) {
        this.httpClient.delete(`http://localhost:8080/employee/delete/${id}`).subscribe({
            complete: () => {
                this.employees.set(this.employees().filter((employee) => employee.id !== id));
            }
        })
    }

}