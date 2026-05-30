import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-course-viewer',
  imports: [],
  templateUrl: './course-viewer.html',
  styleUrl: './course-viewer.css',
})

export class CourseViewer implements OnInit {

  courseData: any; // Variable to hold your MySQL data

  constructor(
    private apiService: Api,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Call the backend as soon as the component loads
    this.apiService.getCourses().subscribe((response) => {
      // Save the first course from the array into our variable
      this.courseData = response.data[0]; 
      console.log("Data from Express:", this.courseData);

      this.cdr.detectChanges();
    });
  }
}
