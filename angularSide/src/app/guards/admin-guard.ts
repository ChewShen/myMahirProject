import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Ui } from '../services/ui';
import { Data } from '../services/data';

export const adminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const ui = inject(Ui);
  const data = inject(Data);

  const user = data.loadStorage('mymahir_user');

  if (user && user.role === 'admin') {
    return true; 
  } else {
    ui.openSnackBar('Access Denied: Administrator privileges required.');
    router.navigate(['/dashboard']); // Kick them back to the normal dashboard
    return false;
  }
};
