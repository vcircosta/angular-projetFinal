import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service/auth.service';

export const adminGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): boolean | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.currentUser();

    if (user && user.role === 'admin') {
        return true;
    }

    return router.parseUrl('/');
};
