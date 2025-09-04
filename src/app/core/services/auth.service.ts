import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from './../models/user.model';
import { ErrorService } from './../../shared/services/error.services';

type UserRole = 'user' | 'admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private errorService = inject(ErrorService);

  currentUser = signal<User | null>(null);
  readonly currentUser$ = this.currentUser.asReadonly();

  private users: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 2, name: 'Normal User', email: 'user@example.com', role: 'user' },
  ];

  private passwords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      this.setCurrentUser(user);
      return of(user).pipe(delay(500));
    } else {
      this.errorService.showError('Email ou mot de passe incorrect');
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(data: RegisterRequest): Observable<User> {
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      this.errorService.showError('Cet email est déjà utilisé');
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: data.name,
      email: data.email,
      role: 'user',
    };

    this.users.push(newUser);
    this.passwords[data.email] = data.password;

    this.setCurrentUser(newUser);
    return of(newUser).pipe(delay(500));
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.errorService.showInfo('Déconnexion réussie');
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(
        delay(300),
        tap(() => this.errorService.showInfo('Utilisateur supprimé avec succès'))
      );
    }
    this.errorService.showError('Utilisateur non trouvé');
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  updateUserRole(userId: number, newRole: UserRole): Observable<User> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      return of(user).pipe(
        delay(300),
        tap(() => this.errorService.showInfo(`Rôle de ${user.name} changé en ${newRole}`))
      );
    }
    this.errorService.showError('Utilisateur non trouvé');
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
