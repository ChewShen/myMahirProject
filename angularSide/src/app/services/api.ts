import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  getCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses`);
  }

  generateQuiz(courseContent: string) {
    return this.http.post<any>(`${this.apiUrl}/courses/generate-quiz`, {
      courseContent: courseContent
    });
  }

  saveScore(courseId: number, score: number, totalQuestions: number) {
    return this.http.post<any>(`${this.apiUrl}/courses/save-score`, { 
      courseId: courseId,
      score: score,
      totalQuestions: totalQuestions
    });
  }

  getBatchExplanations(wrongAnswers: any[]) {
    return this.http.post<any>(`${this.apiUrl}/courses/explain-batch`, {
      wrongAnswers: wrongAnswers
    });
  }

  generateStudyKit(courseContent: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses/study-kit/generate`, {
      courseContent: courseContent
    });
  }


  login(userData: any) {
    // return this.http.post<any>('/api/login', userData);
    return this.http.post<any>(`${this.apiUrl}/login`, userData);
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  getAllScores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/scores`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/                     admin/courses`, courseData);
  }

  getCourseById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${id}`);
  }

  getMyScores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/my-scores`);
  }

  deleteCourse(courseId: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/courses/${courseId}`);
  }

  updateCourse(courseId: string | number, courseData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/courses/${courseId}`, courseData);
  }
  
}
