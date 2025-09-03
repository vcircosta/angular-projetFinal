import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { RegisterRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name" />
      <input formControlName="email" placeholder="Email" />
      <input type="password" formControlName="password" placeholder="Password" />
      <input type="password" formControlName="confirmPassword" placeholder="Confirm Password" />
      <button type="submit" [disabled]="form.invalid">Register</button>
    </form>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Déclaration du FormGroup
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    // Création de l'objet RegisterRequest
    const data: RegisterRequest = {
      name: this.form.value.name!,
      email: this.form.value.email!,
      password: this.form.value.password!,
      confirmPassword: this.form.value.confirmPassword!
    };

    this.authService.register(data).subscribe({
      next: user => {
        console.log('Inscrit :', user);
        this.router.navigate(['/reservations']);
      },
      error: err => console.error(err)
    });
  }
}
