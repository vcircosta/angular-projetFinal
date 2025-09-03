import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="text-xl font-bold">Login</h2>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-2">
      <input formControlName="username" placeholder="Username" class="border p-2" />
      <input type="password" formControlName="password" placeholder="Password" class="border p-2" />

      <button type="submit" [disabled]="loginForm.invalid" class="bg-blue-500 text-white px-4 py-2">
        Login
      </button>
    </form>

    <p *ngIf="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/reservations']),
      error: () => this.errorMessage = 'Invalid credentials',
    });
  }
}
