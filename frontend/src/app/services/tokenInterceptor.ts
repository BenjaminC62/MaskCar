import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { User } from '../models/User';

export function jwtInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const user = authService.user();
  const isLoggedIn = authService.isLoggedIn();
  const isApiUrl = request.url.startsWith(environment.apiUrl);

  if (isLoggedIn && isApiUrl) {
    const token = user?.token;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isLoggedIn) {
        const oldToken = user?.token;
        if (!oldToken) {
          console.error('Token manquant pour le rafraîchissement');
          authService.logout();
          return throwError(() => new Error('Token manquant pour le rafraîchissement'));
        }

        return from(authService.refresh()).pipe(
          switchMap((refreshedUser: User) => {
            if (!refreshedUser?.token) {
              console.error('Échec du rafraîchissement du token');
              authService.logout();
              return throwError(() => new Error('Échec du rafraîchissement du token'));
            }

            const retryRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshedUser.token}`,
              },
            });
            return next(retryRequest);
          }),
          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
}
