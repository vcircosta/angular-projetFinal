import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface RandomUser {
    id: string;
    name: string;
    email: string;
    location: string;
}

@Injectable({
    providedIn: 'root'
})
export class RandomUserService {
    private apiUrl = 'https://randomuser.me/api/?results=10'; // récupère 10 utilisateurs

    constructor(private http: HttpClient) { }

    getUsers(): Observable<RandomUser[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            delay(500), // délai simulé pour ressembler à une vraie API
            map(res => res.results.map((u: any, index: number) => ({
                id: `${index + 1}`,
                name: `${u.name.first} ${u.name.last}`,
                email: u.email,
                location: `${u.location.city}, ${u.location.country}`
            })))
        );
    }
}
