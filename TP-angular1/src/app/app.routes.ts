
import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Component } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';

@Component({
    standalone: true,
    template: `<div class="welcome-message">Vous êtes connecté !</div>`,
})
export class Welcome {}

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'welcome', component: Welcome, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
