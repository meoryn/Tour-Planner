import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserStateService } from './user-state-service';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

const BACKEND_BASE_URL = 'http://localhost:8080';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userState = inject(UserStateService);
  const router = inject(Router);

  const isBackend = req.url.startsWith(BACKEND_BASE_URL);
  const skip = req.context.get(SKIP_AUTH);
  const token = userState.getToken();

  const outbound = isBackend && !skip && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(outbound).pipe(
    catchError((err) => {
      if (err.status === 401 && isBackend && !skip) {
        userState.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
