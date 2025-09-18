import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from './../../models/user.model';
import { ErrorService } from './../../../shared/services/error.services';

type InternalUser = User & { password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private errorService = new ErrorService();

  // utilisateur connecté
  currentUser = signal<User | null>(null);
  readonly currentUser$ = this.currentUser.asReadonly();

  private tokenKey = 'authToken';
  private userKey = 'currentUser';

  // Utilisateurs mockés avec mot de passe
  private users: InternalUser[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'admin123' },
    { id: 2, name: 'Normal User', email: 'user@example.com', role: 'user', password: 'user123' },
  ];

  constructor() {
    this.restoreSession();
  }

  /** Recharge un utilisateur depuis le localStorage */
  private restoreSession(): void {
    const savedUser = localStorage.getItem(this.userKey);
    if (!savedUser) return;

    try {
      const parsed: User = JSON.parse(savedUser);
      if (parsed && (parsed.role === 'admin' || parsed.role === 'user')) {
        this.currentUser.set(parsed);
      } else {
        this.clearSession();
      }
    } catch {
      this.clearSession();
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    if (!user) {
      this.errorService.showError('Utilisateur non trouvé');
      return throwError(() => new Error('Utilisateur non trouvé'));
    }

    // Vérification du mot de passe
    if (user.password !== credentials.password) {
      this.errorService.showError('Mot de passe incorrect');
      return throwError(() => new Error('Mot de passe incorrect'));
    }

    const token = 'mock-token-' + user.id;
    const userWithToken = { ...user, token };

    return of(userWithToken).pipe(
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

    const newUser: InternalUser = {
      id: this.users.length + 1,
      name: data.name,
      email: data.email,
      role: 'user',
      password: data.password, // on stocke le mdp
    };

    this.users.push(newUser);

    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));

    const { password, ...userWithoutPassword } = newUser;
    const userWithToken = { ...userWithoutPassword, token: 'mock-token-' + newUser.id };

    return of(userWithToken).pipe(
      delay(500),
      tap(u => this.setCurrentUser(u))
    );
  }

  /** Vérifie si connecté */
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  /** Vérifie si admin */
  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  /** Déconnexion */
  logout(): void {
    this.clearSession();
    this.errorService.showInfo('Déconnexion réussie');
  }

  /** Stocke l’utilisateur et son token */
  private setCurrentUser(user: User & { token?: string }): void {
    this.currentUser.set(user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    if (user.token) {
      localStorage.setItem(this.tokenKey, user.token);
    }
  }

  /** Vide la session */
  private clearSession(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
  }

  /** Récupère le token */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Récupère tous les utilisateurs mockés (sans mdp) */
  getUsers(): User[] {
    return this.users.map(({ password, ...user }) => user);
  }
}
