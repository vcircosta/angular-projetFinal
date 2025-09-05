import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from './../models/user.model';
import { ErrorService } from './../../shared/services/error.services';

type UserRole = 'user' | 'admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private errorService = new ErrorService();

  currentUser = signal<User | null>(null);
  readonly currentUser$ = this.currentUser.asReadonly();

  private tokenKey = 'authToken';

  // Liste mockée des utilisateurs existants
  private users: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 2, name: 'Normal User', email: 'user@example.com', role: 'user' },
  ];

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  /** Connexion mockée */
  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    if (!user) {
      this.errorService.showError('Utilisateur non trouvé');
      return throwError(() => new Error('Utilisateur non trouvé'));
    }

    const token = 'mock-token-' + user.id;

    return of({ ...user, token }).pipe(
      delay(500),
      tap(u => this.setCurrentUser(u))
    );
  }

  /** Inscription mockée */
  register(data: RegisterRequest): Observable<User> {
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      this.errorService.showError('Cet email est déjà utilisé');
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User & { token: string } = {
      id: this.users.length + 1,
      name: data.name,
      email: data.email,
      role: 'user',
      token: 'mock-token-' + (this.users.length + 1),
    };

    this.users.push(newUser);

    return of(newUser).pipe(
      delay(500),
      tap(u => this.setCurrentUser(u))
    );
  }

  /** Vérifie si connecté */
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  /** Récupère tous les utilisateurs */
  getAllUsers(): Observable<User[]> {
    // Simule un délai comme si on appelait un backend
    return of(this.users).pipe(delay(300));
  }

  /** Déconnexion */
  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.tokenKey);
    this.errorService.showInfo('Déconnexion réussie');
  }

  /** Stocke l’utilisateur et le token */
  private setCurrentUser(user: User & { token?: string }): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (user.token) {
      localStorage.setItem(this.tokenKey, user.token);
    }
  }

  /** Récupère le token */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
