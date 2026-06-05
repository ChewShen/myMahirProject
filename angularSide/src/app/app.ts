import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Data } from './services/data';
import { Ui } from './services/ui';


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
    private data: Data,
    private ui: Ui)
    {
    this.user = this.data.loadStorage('user_detail');

    this.data.observeEvent().subscribe((event: any) => {
      if (event.type === 'LOGIN_SUCCESS') {
        this.user = event.user;
      }
    });

  }

  onLogout() {
    // 1. Destroy the token and any saved user details
    this.data.removeStorage('user_detail'); 
    
    // 2. Redirect them back to the login page
    this.ui.openSnackBar('Logged Out Successfully!');
    this.router.navigate(['/login']); 
  }

}
