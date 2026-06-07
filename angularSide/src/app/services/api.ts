import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  generateQuiz(courseContent: string) {
    return this.http.post<any>('/api/courses/generate-quiz', {
      courseContent: courseContent
    });
  }

  saveScore(courseId: number, score: number, totalQuestions: number) {
    return this.http.post<any>('api/courses/save-score', { 
      courseId: courseId,
      score: score,
      totalQuestions: totalQuestions
    });
  }

  login(userData: any) {
    return this.http.post<any>('/api/login', userData);
  }

  register(userData: any) {
    return this.http.post<any>('/api/register', userData);
  }

  getAllScores(): Observable<any> {
    return this.http.get<any>('/api/admin/scores');
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>('/api/admin/courses', courseData);
  }

  getCourseById(id: string | number): Observable<any> {
    return this.http.get<any>(`/api/courses/${id}`);
  }

  getMyScores(): Observable<any> {
    return this.http.get<any>('/api/courses/my-scores');
  }

  deleteCourse(courseId: string | number): Observable<any> {
    return this.http.delete<any>(`/api/admin/courses/${courseId}`);
  }

  updateCourse(courseId: string | number, courseData: any): Observable<any> {
    return this.http.put<any>(`/api/admin/courses/${courseId}`, courseData);
  }
  
}
