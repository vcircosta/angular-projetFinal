import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, TOKEN_KEY } from '../auth/services/auth-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const tokenInStorage = localStorage.getItem(TOKEN_KEY);
  
  const isAuth = authService.isAuthenticated();

  console.log('Guard Check - Signal:', isAuth, ' - LocalStorage Token:', !!tokenInStorage);

  if (isAuth || !!tokenInStorage) {
    return true;
  }

  console.warn('Accès refusé par le Guard - Redirection Login');
  return router.createUrlTree(['/login']);
};