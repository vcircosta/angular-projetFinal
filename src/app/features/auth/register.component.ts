import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="text-xl font-bold">Register</h2>

    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-2">
      <input formControlName="username" placeholder="Username" class="border p-2" />
      <input type="password" formControlName="password" placeholder="Password" class="border p-2" />
      <input type="password" formControlName="confirmPassword" placeholder="Confirm Password" class="border p-2" />

      <button type="submit" [disabled]="registerForm.invalid" class="bg-green-500 text-white px-4 py-2">
        Register
      </button>
    </form>

    <p *ngIf="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { username, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(username!, password!).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.errorMessage = 'Registration failed',
    });
  }
}
