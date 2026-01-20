import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Credentials } from "../interface/credentials";
import { Observable, tap } from "rxjs";
import { User } from "../interface/user";
import { AuthResponse } from "../interface/auth-response";
import { environment } from "../../../../environments/environment";
import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    private userSignal = signal<User | null>(this.getUserFromStorage());
    currentUser = this.userSignal.asReadonly();

    private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
    isAuthenticated = computed(() => !!this.tokenSignal());

    login(credentials: Credentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap(response => {
                console.log('Réponse API brute:', response);
                this.saveSession(response);
            })
        );
    }

    register(credentials: Credentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, credentials).pipe(
            tap(response => this.saveSession(response))
        );
    }

    getToken(): string | null {
        return this.tokenSignal() || localStorage.getItem(TOKEN_KEY);
    }

    private saveSession(response: any): void {
        if (response && response.access_token) {
            localStorage.setItem(TOKEN_KEY, response.access_token);
            this.tokenSignal.set(response.access_token);

            try {
                const decoded: any = jwtDecode(response.access_token);
                console.log('JWT Décodé :', decoded);

                const usernameFromToken = decoded.username || decoded.sub || 'Utilisateur';

                const userData: User = {
                    username: usernameFromToken,
                    id: decoded.id || response.id,
                    role: decoded.role || response.role
                };

                localStorage.setItem('user_data', JSON.stringify(userData));
                this.userSignal.set(userData);
                
                console.log('Succès : Utilisateur extrait du token ->', userData.username);
            } catch (error) {
                console.error('Erreur de décodage du token JWT', error);
                this.userSignal.set({ username: 'Utilisateur' });
            }
        } else {
            console.error('Erreur fatale : Pas d\'access_token dans la réponse');
        }
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('user_data');
        this.tokenSignal.set(null);
        this.userSignal.set(null);
    }

    private getUserFromStorage(): User | null {
        const data = localStorage.getItem('user_data');
        if (!data || data === 'undefined' || data === 'null') return null;
        try { return JSON.parse(data); } catch { return null; }
    }
}