import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { LoginRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" placeholder="Email" />
      <input type="password" formControlName="password" placeholder="Password" />
      <button type="submit" [disabled]="form.invalid">Login</button>
    </form>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    // Déclarer l'objet credentials ici
    const credentials: LoginRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };

    this.authService.login(credentials).subscribe({
      next: user => {
        console.log('Connecté :', user);
        this.router.navigate(['/reservations']);
      },
      error: err => console.error(err)
    });
  }
}
