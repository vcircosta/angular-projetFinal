import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Credentials } from "../interface/credentials";
import { Observable, tap } from "rxjs";
import { User } from "../interface/user";
import { AuthResponse } from "../interface/auth-response";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    // Signaux pour l'état de l'utilisateur
    private userSignal = signal<User | null>(this.getUserFromStorage());
    currentUser = this.userSignal.asReadonly();

    private tokenSignal = signal<string | null>(localStorage.getItem('auth_token'));
    isAuthenticated = computed(() => !!this.tokenSignal());

    login(credentials: Credentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap(response => this.saveSession(response))
        );
    }

    register(credentials: Credentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, credentials).pipe(
            tap(response => this.saveSession(response))
        );
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        this.userSignal.set(null);
        this.tokenSignal.set(null);
    }

    getToken(): string | null {
        return this.tokenSignal();
    }

    private saveSession(response: AuthResponse): void {
        // Sécurité : on ne sauvegarde que si les données sont valides
        if (response.token && response.user) {
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
            
            this.tokenSignal.set(response.token);
            this.userSignal.set(response.user);
        }
    }

    private getUserFromStorage(): User | null {
        const data = localStorage.getItem('user_data');

        // PROTECTION : Si data est null, undefined ou la chaîne "undefined", on arrête tout de suite
        if (!data || data === 'undefined' || data === 'null') {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            // Si le JSON est corrompu, on nettoie pour éviter de boucler sur l'erreur
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            localStorage.removeItem('user_data');
            return null;
        }
    }
}