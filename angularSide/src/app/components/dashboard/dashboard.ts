import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { SharedModule } from '../../shared/shared-module';
import { RouterModule } from '@angular/router';
import { Data } from '../../services/data';

@Component({
  selector: 'app-dashboard',
  imports: [...SharedModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  courseList: any[] = [];
  user: any = null;

  constructor(
    private apiService: Api,
    private cdr: ChangeDetectorRef,
    private data: Data
  ) {}

 ngOnInit() {
    this.user = this.data.loadStorage('user_detail');

    this.apiService.getCourses().subscribe({
      next: (response) => {
        console.log("Dashboard received:", response.data);
        this.courseList = response.data;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load dashboard courses", err);
      }
    });
  }
}
