import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Api } from '../../services/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ui } from '../../services/ui';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  allScores: any[] = [];
  allCourses : any[] = [];
  isLoading = true;
  isCreating = false;

  courseForm: FormGroup;
  isSubmitting = false;

  constructor(
    private api:Api, 
    private cdr: ChangeDetectorRef,
    private fb : FormBuilder,
    private uiservice: Ui
  ){
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(50)]] // AI needs enough text!
    });
  }

  ngOnInit() {
    this.fetchScores();
    this.fetchCourses();
  }

  fetchScores() {
    this.api.getAllScores().subscribe({
      next: (res) => {
        this.allScores = res.data; 
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Failed to load scores", err);
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  fetchCourses() {
    // Reusing the exact same API call your Student Dashboard uses!
    this.api.getCourses().subscribe({
      next: (res) => {
        this.allCourses = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load admin courses", err);
      }
    });
  }


  onSubmitCourse() {
    if (this.courseForm.invalid) return;
    
    this.isSubmitting = true;
    this.api.createCourse(this.courseForm.value).subscribe({
      next: (res) => {
        this.uiservice.openSnackBar('Course Created Successfully!');
        this.courseForm.reset();
        this.isSubmitting = false;
        this.isCreating = false; // Go back to the table view
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uiservice.openSnackBar('Error creating course.');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteCourse(courseId: string) {
    const confirmDelete = window.confirm("Are you sure? This will delete all student scores for this course!");
    
    if (confirmDelete) {
      this.api.deleteCourse(courseId).subscribe({
        next: () => {
          alert("Course deleted.");
          // Add logic here to reload your course array so it disappears from the screen!
          // Filter out the deleted course so it instantly vanishes from the screen!
          // (Change 'this.allCourses' to whatever your array variable is named)
          this.allCourses = this.allCourses.filter(course => course.courseId !== courseId);
          
          // Wake up Angular to redraw the HTML
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Delete failed", err)
      });
    }
  }
  
}
