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

 // empty for now
}
