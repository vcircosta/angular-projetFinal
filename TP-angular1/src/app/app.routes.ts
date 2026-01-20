import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { 
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./features/todo/todo').then(m => m.TodoComponent) 
  },

  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '**', redirectTo: 'tasks' }
];