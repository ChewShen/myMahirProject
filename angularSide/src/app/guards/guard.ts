
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const Guard: CanActivateFn = (route,state) => {
  const router = inject(Router);

  const token = localStorage.getItem('mymahir_token')
}
