import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);

  private API_URL = 'http://localhost:3000/api/auth';

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, { username, password }).pipe(
      tap((user: User) => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  register(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, { username, password });
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  loadUserFromStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const parsedUser = JSON.parse(userJson) as User;
      this.currentUser.set(parsedUser);
    }
  }
}
