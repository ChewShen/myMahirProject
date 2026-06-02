import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Ui } from '../services/ui';
import { Data } from '../services/data';


export const authGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
   const uiService = inject(Ui);
   const data = inject(Data);

   const token = data.loadStorage('login_token')

   if(token){
    return true;
   } else {
    router.navigate(['/login']);
    uiService.openSnackBar('Access Denied: Please login to view this page.');
    return false;
   }
};
