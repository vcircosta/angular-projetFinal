import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from './../../models/user.model';
import { ErrorService } from './../../../shared/services/error.services';

type InternalUser = User & { password: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private errorService = new ErrorService();

  currentUser = signal<User | null>(null);
  readonly currentUser$ = this.currentUser.asReadonly();

  private tokenKey = 'authToken';
  private userKey = 'currentUser';

  private users: InternalUser[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', password: 'admin123' },
    { id: 2, name: 'Normal User', email: 'user@example.com', role: 'user', password: 'user123' },
  ];

  constructor() {
    this.restoreSession();
  }

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
      password: data.password,
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

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  logout(): void {
    this.clearSession();
    this.errorService.showInfo('Déconnexion réussie');
  }

  private setCurrentUser(user: User & { token?: string }): void {
    this.currentUser.set(user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    if (user.token) {
      localStorage.setItem(this.tokenKey, user.token);
    }
  }

  private clearSession(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsers(): User[] {
    return this.users.map(({ password, ...user }) => user);
  }
}
