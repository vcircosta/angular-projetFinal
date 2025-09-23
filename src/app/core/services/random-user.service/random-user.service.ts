import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { RandomUser } from '../../models/randomuser.model';

interface RandomUserApiResponse {
    results: {
        name: { first: string; last: string };
        email: string;
        location: { city: string; country: string };
    }[];
}

@Injectable({
    providedIn: 'root'
})
export class RandomUserService {
    private apiUrl = 'https://randomuser.me/api/?results=10';

    private readonly http = inject(HttpClient);

    getUsers(): Observable<RandomUser[]> {
        return this.http.get<RandomUserApiResponse>(this.apiUrl).pipe(
            delay(500),
            map(res =>
                res.results.map((u, index) => ({
                    id: `${index + 1}`,
                    name: `${u.name.first} ${u.name.last}`,
                    email: u.email,
                    location: `${u.location.city}, ${u.location.country}`,
                    role: 'user'
                }))
            )
        );
    }
}
