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
    // We send the content as a JSON object, exactly like we did in Postman!
    return this.http.post<any>('http://localhost:3000/api/generate-quiz', { 
      courseContent: courseContent 
    });
  }

  saveScore(courseId: number, score: number, totalQuestions: number) {
    return this.http.post<any>('http://localhost:3000/api/save-score', { 
      courseId: courseId,
      score: score,
      totalQuestions: totalQuestions
    });
  }

  login(userData: any) {
    return this.http.post<any>('http://localhost:3000/api/login', userData);
  }

  register(userData: any) {
    return this.http.post<any>('http://localhost:3000/api/register', userData);
  }

  getAllScores(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/admin/scores');
  }
  
  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/admin/courses', courseData);
  }

  getCourseById(id: string | number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/courses/${id}`);
  }
  
}
