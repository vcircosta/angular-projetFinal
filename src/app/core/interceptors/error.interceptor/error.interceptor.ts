import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../../shared/services/error.services';

export const errorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const errorService = inject(ErrorService);

    return next(req).pipe(
        catchError(err => {
            errorService.showError(err?.message || 'Erreur réseau');
            return throwError(() => err);
        })
    );
};
