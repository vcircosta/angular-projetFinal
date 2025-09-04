import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { NotificationService } from './../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notify = inject(NotificationService);

    return next(req).pipe(
        catchError(err => {
            notify.error(err?.error?.message || 'Une erreur est survenue.');
            return throwError(() => err);
        })
    );
};
