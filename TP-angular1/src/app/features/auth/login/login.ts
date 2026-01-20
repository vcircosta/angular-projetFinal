import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/services/auth-service';
import { Credentials } from '../../../core/auth/interface/credentials';
import { Router, RouterLink } from '@angular/router';

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
  
  // Utilisation de null pour un signal plus propre
  errorMessage = signal<string | null>(null);

  // Formulaire typé et non-nul
  loginForm: FormGroup = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Veuillez remplir correctement les champs.');
      return;
    }

    const credentials: Credentials = this.loginForm.getRawValue();
    this.errorMessage.set(null); // Reset de l'erreur

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/welcome']);
      },
      error: (err) => {
        // Gestion plus précise de l'erreur
        if (err.status === 401) {
          this.errorMessage.set('Identifiants incorrects.');
        } else {
          this.errorMessage.set('Erreur de connexion au serveur.');
        }
        console.error('Login failed', err);
      }
    });
  }
}