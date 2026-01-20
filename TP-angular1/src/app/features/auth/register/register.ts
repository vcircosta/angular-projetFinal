import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth-service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Credentials } from '../../../core/auth/interface/credentials';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  registerForm: FormGroup = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { 
    validators: this.passwordMatchValidator 
  });

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Veuillez remplir correctement tous les champs.');
      return;
    }

    const { username, password } = this.registerForm.getRawValue();
    const credentials: Credentials = { username, password };

    this.authService.register(credentials).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleError(err: any) {
    if (err.status === 409) {
      this.errorMessage.set('Ce compte existe déjà.');
    } else {
      this.errorMessage.set('Une erreur réseau est survenue.');
    }
    console.error('Registration failed', err);
  }
}