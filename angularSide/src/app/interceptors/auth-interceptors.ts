import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Data } from '../services/data';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const data = inject(Data);
  // 1. Get the token from the vault
    const token = data.loadStorage('login_token');

  // 2. If we have a token, clone the request and attach the token to the Headers
    if (token) {
        const clonedRequest = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
        });
        // Send the cloned request with the token attached!
        return next(clonedRequest);
    }

    // 3. If no token, just send the normal request
    return next(req);
};