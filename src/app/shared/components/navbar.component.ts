import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="navbar">
      <a routerLink="/reservations">Reservations</a>

      <a *ngIf="!auth.currentUser()" routerLink="/login">Login</a>
      <a *ngIf="!auth.currentUser()" routerLink="/register">Register</a>

      <button *ngIf="auth.currentUser()" (click)="logout()">Logout</button>
    </nav>
  `,
    styles: [`
    .navbar { display: flex; gap: 1rem; padding: 1rem; background: #eee; }
    button { cursor: pointer; }
  `]
})
export class NavbarComponent {
    auth = inject(AuthService);
    private router = inject(Router);

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
