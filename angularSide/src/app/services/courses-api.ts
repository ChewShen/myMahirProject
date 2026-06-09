import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesApi {

  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCourseById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMyScores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-scores`);
  }

  // Phase 4 & Phase 8 AI Engine Integrations
  generateQuiz(courseContent: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-quiz`, { courseContent });
  }

  saveScore(courseId: number, score: number, totalQuestions: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save-score`, {
      courseId,
      score,
      totalQuestions,
    });
  }

  // Smart Remediation Loop ("Why Did I Get This Wrong?")
  getBatchExplanations(wrongAnswers: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/explain-batch`, { wrongAnswers });
  }

  // AI Tutor Expansion Workspace
  generateStudyKit(courseContent: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/study-kit/generate`, { courseContent });
  }
}
