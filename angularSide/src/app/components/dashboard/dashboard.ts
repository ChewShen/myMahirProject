import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { SharedModule } from '../../shared/shared-module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [...SharedModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  courseList: any[] = [];

  constructor(
    private apiService: Api,
    private cdr: ChangeDetectorRef) {}

 ngOnInit() {
    this.apiService.getCourses().subscribe({
      next: (response) => {
        console.log("Dashboard received:", response.data); // ADD THIS LINE!
        this.courseList = response.data;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load dashboard courses", err);
      }
    });
  }
}
