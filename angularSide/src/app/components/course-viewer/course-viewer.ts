import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../../services/data';
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
  courseId: string | null = null;
  isLoading = true;

  explanations: any[] = [];
  isLoadingExplanations: boolean = false;

  constructor(
    private api: Api,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private data: Data,
  ) {}

  ngOnInit(): void {
    // Call the backend as soon as the component loads
    this.courseId = this.route.snapshot.paramMap.get('id');

    if (this.courseId) {
      if (this.courseId) {
        const saveKey = `quiz_progress_${this.courseId}`;
        const previousSave = this.data.loadStorage(saveKey);

        // If a save file exists, load it into memory instantly
        if (previousSave && previousSave.questions && previousSave.questions.length > 0) {
          this.generatedQuiz = previousSave.questions;
          this.selectedAnswers = previousSave.answers || []; // Load answers, or empty array if none
          console.log('Loaded previous quiz state from Local Storage!');
        }

        // Finally, go fetch the course details from Express
        // Fetch the specific course data
        // (Make sure you added getCourseById to your api.ts file!)
        this.api.getCourseById(this.courseId).subscribe({
          next: (res) => {
            this.courseData = res.data;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Failed to load course details', err);
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      }
    }
  }

  onGenerateQuiz() {
    if (this.generatedQuiz.length > 0 && this.score === null) {
      const resume = window.confirm(
        'You have an unfinished quiz in progress! Do you want to resume?',
      );

      if (resume) {
        this.isQuizOpen = true; // Just pop the modal back open!
        this.cdr.detectChanges();
        return; // Stop the function here so we don't ask the AI for new questions
      }
    }

    this.isGenerating = true;
    this.generatedQuiz = [];
    this.selectedAnswers = [];
    this.explanations = [];
    this.cdr.detectChanges();

    this.api.generateQuiz(this.courseData.courseContent).subscribe({
      next: (response) => {
        console.log('Questions Arrived!', response.data);
        this.generatedQuiz = response.data; // Save the 5 questions!

        this.isGenerating = false;

        this.isQuizOpen = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to get quiz', err);
        this.isGenerating = false;
        this.cdr.detectChanges();
      },
    });
  }

  // 1. When the user clicks an option (A, B, C, D)
  selectOption(questionIndex: number, option: string) {
    this.selectedAnswers[questionIndex] = option;
    this.cdr.detectChanges();

    const saveKey = `quiz_progress_${this.courseId}`;

    const saveData = {
      questions: this.generatedQuiz,
      answers: this.selectedAnswers,
    };

    this.data.saveStorage(saveKey, saveData);
  }

  // 2. When the user clicks "Submit Quiz"
  submitQuiz() {
    let correctCount = 0;
    const wrongAnswersPayload: any[] = [];

    this.generatedQuiz.forEach((question, index) => {
      const chosenAnswer = this.selectedAnswers[index];
      if (chosenAnswer === question.correctAnswer) {
        correctCount++;
      } else {
        // Build the payload for the AI batch route
        wrongAnswersPayload.push({
          question: question.question,
          studentAnswer: chosenAnswer || 'No answer selected',
          correctAnswer: question.correctAnswer
        });
      }
    });

    this.score = correctCount; // Instantly transition frontend calculations
    this.cdr.detectChanges();

    this.api.saveScore(this.courseData.courseId, this.score, this.generatedQuiz.length).subscribe({
      next: (res) => console.log('Score saved successfully!', res),
      error: (err) => console.error('Failed to save score', err),
    });

    // Request for explanation
    if (wrongAnswersPayload.length > 0) {
      this.isLoadingExplanations = true;
      this.cdr.detectChanges();

      this.api.getBatchExplanations(wrongAnswersPayload).subscribe({
        next: (res) => {
          this.explanations = res.data; // Store returned Postman-like array matches
          this.isLoadingExplanations = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('AI Tutor remediation fetch failed:', err);
          this.isLoadingExplanations = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.isLoadingExplanations = false; // Guard edge-case for 100% perfect scores
    }
  }

  getExplanationByIndex(index: number): string | null {
    if (this.explanations && this.explanations[index]) {
      return this.explanations[index].explanation;
    }
    
    // Fallback attempt: if array positions shifted, look for a matching question string
    if (this.generatedQuiz[index]) {
      const targetQuestion = this.generatedQuiz[index].question;
      const match = this.explanations.find(item => item.question === targetQuestion);
      return match ? match.explanation : null;
    }
    
    return null;
  }
  
  // 3. When the user closes the pop-up
  closeQuiz() {
    if (this.score !== null) {
      // 1. If they already submitted and got a score, completely reset it for next time.
      this.generatedQuiz = [];
      this.selectedAnswers = [];
      this.explanations = [];
      this.score = null;

      const saveKey = `quiz_progress_${this.courseId}`;
      this.data.removeStorage(saveKey); 
    }

    this.isQuizOpen = false;
    this.cdr.detectChanges();
  }
}
