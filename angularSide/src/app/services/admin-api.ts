import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminApi {

  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

   getCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses`);
  }


  getAllScores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/scores`);
  }

  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/courses`, courseData); // Fixed missing slash bug
  }

  updateCourse(courseId: string | number, courseData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/courses/${courseId}`, courseData);
  }

  deleteCourse(courseId: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/${courseId}`);
  }
}
