import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Ui {
  constructor(public snackBar: MatSnackBar) {}

  // A single, clean method with an optional action button
  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action || 'Close', { duration: 4000, verticalPosition: 'top'});
  }
}
