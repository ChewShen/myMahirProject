import { AuthApi } from './../../services/auth-api';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Data } from '../../services/data';

@Component({
  selector: 'app-auth',
  imports: [...SharedModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})

export class Auth {
  loginForm: FormGroup;
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private api: AuthApi, 
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private data :Data
  ) {
    // Login Form Rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Register Form Rules
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;

    this.api.login(this.loginForm.value).subscribe({
      next: (res) => {
        // SUCCESS! Save the JWT to the browser's secret vault
        this.data.saveStorage('login_token', res.token);
        this.data.saveStorage('user_detail', res.user);
        this.data.publishEvent({ type: 'LOGIN_SUCCESS', user: res.user });
        this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });

        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/dashboard']); // Send them to the dashboard!
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges(); // WAKE UP ANGULAR!
        this.snackBar.open(err.error.message || 'Login Failed', 'Close', { duration: 3000 });
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.isLoading = true;

    this.api.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Registration Successful! Please login.', 'Close', { duration: 4000 });
        this.registerForm.reset();
        // (In a real app, you might programmatically switch the tab to Login here)
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open(err.error.message || 'Registration Failed', 'Close', { duration: 3000 });
      }
    });
  }


}
