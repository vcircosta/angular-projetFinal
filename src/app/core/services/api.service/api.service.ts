import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = '/api';

    get<T>(url: string, params?: Record<string, string | number | boolean>) {
        return this.http.get<T>(this.baseUrl + url, {
            params: params ? new HttpParams({ fromObject: params as Record<string, string> }) : undefined,
        });
    }

    post<T>(url: string, body: unknown) {
        return this.http.post<T>(this.baseUrl + url, body);
    }

    put<T>(url: string, body: unknown) {
        return this.http.put<T>(this.baseUrl + url, body);
    }

    delete<T>(url: string) {
        return this.http.delete<T>(this.baseUrl + url);
    }
}
