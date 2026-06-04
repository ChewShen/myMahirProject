import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { ActivatedRoute } from '@angular/router';
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
  isQuizOpen: boolean = false;

  selectedAnswers: string[] = []; 
  score: number | null = null;  
  courseId: string | null = null
  isLoading = true;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Call the backend as soon as the component loads
    this.courseId = this.route.snapshot.paramMap.get('id');
    
    if (this.courseId){
      if (this.courseId) {
      // 4. Fetch the specific course data
      // (Make sure you added getCourseById to your api.ts file!)
      this.api.getCourseById(this.courseId).subscribe({
        next: (res) => {
          this.courseData = res.data;
          this.isLoading = false;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error("Failed to load course details", err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
  }
  
  onGenerateQuiz() {

    if (this.generatedQuiz.length > 0 && this.score === null) {
      const resume = window.confirm("You have an unfinished quiz in progress! Do you want to resume?");
      
      if (resume) {
        this.isQuizOpen = true; // Just pop the modal back open!
        this.cdr.detectChanges();
        return; // Stop the function here so we don't ask the AI for new questions
      }
    }

    this.isGenerating = true;
    this.generatedQuiz = [];
    this.selectedAnswers = [];
    this.cdr.detectChanges();


    this.api.generateQuiz(this.courseData.courseContent).subscribe({
      next: (response) => {
        console.log("Questions Arrived!", response.data);
        this.generatedQuiz = response.data; // Save the 5 questions!
        this.isQuizOpen = true;
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

    this.api.saveScore(this.courseData.courseId, this.score, this.generatedQuiz.length)
      .subscribe({
        next: (res) => console.log("Score saved successfully!", res),
        error: (err) => console.error("Failed to save score", err)
      });
  }

  // 3. When the user closes the pop-up
  closeQuiz() {
    if (this.score !== null) {
      // 1. If they already submitted and got a score, completely reset it for next time.
      this.generatedQuiz = []; 
      this.selectedAnswers = [];
      this.score = null;
    }

    this.isQuizOpen = false;
    this.cdr.detectChanges();
  }

}
