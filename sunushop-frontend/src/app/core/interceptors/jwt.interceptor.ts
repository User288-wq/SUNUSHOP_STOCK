import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // Ne pas ajouter le token pour les routes d'auth (login/register)
  const isAuthRoute = req.url.includes('/api/v2/auth/');

  let authReq = req;
  if (token && !isAuthRoute) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si 401/403 → token invalide ou expire
      if ((error.status === 401 || error.status === 403) && !isAuthRoute) {
        console.warn('Token invalide ou expire - redirection vers /login');
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};