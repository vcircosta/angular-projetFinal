import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (): boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.getCurrentUser();

    if (user && user.role === 'admin') {
        return true;
    }

    return router.parseUrl('/');
};
