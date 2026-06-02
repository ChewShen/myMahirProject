import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Data } from './services/data';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angularSide');
  user:any = null;

  constructor(
    public router: Router,
    private data:Data)
    {
    this.user = this.data.loadStorage('user_role');

    this.data.observeEvent().subscribe((event: any) => {
      if (event.type === 'LOGIN_SUCCESS') {
        this.user = event.user;
      }
    });
    
  }
}
