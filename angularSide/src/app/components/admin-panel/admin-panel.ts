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
    this.api.getAllScores().subscribe({
      next : (res) => {
        this.allScores = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to laod scores",err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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
  
}
