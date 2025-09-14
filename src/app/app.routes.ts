import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard/auth.guard';
import { adminGuard } from './core/guards/admin.guard/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'reservations',
    canActivate: [authGuard],
    loadChildren: () => import('./features/reservations/reservations.routes').then(m => m.RESERVATIONS_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
