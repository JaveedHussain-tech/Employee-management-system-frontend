import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Employees } from "./employees/employees";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Employees],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('employee-frontend');
}
