import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../../core/models/user.model';
import { ErrorService } from '../../shared/services/error.services';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private errorService = inject(ErrorService);

  // Signal pour stocker l'utilisateur courant
  currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Mock data - utilisateurs
  private users: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: 2, name: 'Normal User', email: 'user@example.com', role: 'user' },
  ];

  // Mots de passe mock
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
    const password = this.passwords[credentials.email as keyof typeof this.passwords];

    if (user && password === credentials.password) {
      this.setCurrentUser(user);
      return of(user).pipe(delay(500)); // simule un délai réseau
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
      this.errorService.showInfo('Utilisateur supprimé avec succès');
      return of(void 0).pipe(delay(300));
    }
    this.errorService.showError('Utilisateur non trouvé');
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  updateUserRole(userId: number, newRole: 'user' | 'admin'): Observable<User> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.errorService.showInfo(`Rôle de ${user.name} changé en ${newRole}`);
      return of(user).pipe(delay(300));
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
