import { Component, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Veuillez remplir correctement les champs.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (localStorage.getItem('auth_token')) {
            this.router.navigate(['/todos']);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Erreur de connexion');
        }
      });
    }

  private handleError(err: any) {
    console.error('Détails de l\'erreur de connexion:', err);
    
    if (err.status === 0) {
      this.errorMessage.set('Impossible de contacter le serveur.');
    } else if (err.status === 401) {
      this.errorMessage.set('Identifiants incorrects.');
    } else {
      this.errorMessage.set(err.error?.message || 'Une erreur inattendue est survenue.');
    }
  }
}