import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:3000/api/reservations'; // à adapter

  reservations = signal<Reservation[]>([]);
  selectedReservation = signal<Reservation | null>(null);

  loadReservations() {
    this.http.get<Reservation[]>(this.API_URL).subscribe({
      next: data => this.reservations.set(data),
    });
  }

  loadReservation(id: number) {
    this.http.get<Reservation>(`${this.API_URL}/${id}`).subscribe({
      next: data => this.selectedReservation.set(data),
    });
  }

  addReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.post<Reservation>(this.API_URL, reservation).pipe(
      tap(newRes => this.reservations.update(list => [...list, newRes]))
    );
  }
}
