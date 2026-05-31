import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
@Component({
  selector: 'app-course-viewer',
  imports: [...SharedModule],
  templateUrl: './course-viewer.html',
  styleUrl: './course-viewer.css',
})

export class CourseViewer implements OnInit {

  courseData: any; // 
  isGenerating: boolean = false;
  generatedQuiz: any[] = [];

  selectedAnswers: string[] = []; 
  score: number | null = null;    

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
  
  onGenerateQuiz() {
    this.isGenerating = true;
    this.cdr.detectChanges();

    // Since your DB doesn't have a content column yet, we will send a fake paragraph to the AI!
    const fakeContent = "Information technology (IT) is the use of computers to create, process, store, retrieve, and exchange all kinds of data and information. IT is typically used within the context of business operations as opposed to personal or entertainment technologies.";

    this.apiService.generateQuiz(fakeContent).subscribe({
      next: (response) => {
        console.log("AI Questions Arrived!", response.data);
        this.generatedQuiz = response.data; // Save the 5 questions!
        this.isGenerating = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to get quiz", err);
        this.isGenerating = false;
        this.cdr.detectChanges();
      }
    });
  }


  // 1. When the user clicks an option (A, B, C, D)
  selectOption(questionIndex: number, option: string) {
    this.selectedAnswers[questionIndex] = option;
    this.cdr.detectChanges();
  }

  // 2. When the user clicks "Submit Quiz"
  submitQuiz() {
    let correctCount = 0;
    
    // Loop through the AI questions and check the user's answers
    this.generatedQuiz.forEach((question, index) => {
      if (this.selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    this.score = correctCount; // Save the final score!
    this.cdr.detectChanges();
  }

  // 3. When the user closes the pop-up
  closeQuiz() {
    this.generatedQuiz = []; // This hides the modal!
    this.selectedAnswers = [];
    this.score = null;
    this.cdr.detectChanges();
  }

}
