import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = <T>(
    req: HttpRequest<T>,
    next: HttpHandlerFn
): Observable<HttpEvent<T>> => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    const clonedReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    // On cast explicitement le retour
    return next(clonedReq) as Observable<HttpEvent<T>>;
};
