import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reservation } from '../../models/reservation.model';
import { ErrorService } from '../../../shared/services/error.services';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  private errorService = inject(ErrorService);

  reservations = signal<Reservation[]>([]);
  selectedReservation = signal<Reservation | null>(null);

  private reservationsMock: Reservation[] = [
    { id: 1, computerId: 101, computerName: 'PC-101', userId: 2, date: '2025-09-04', duration: 2, location: 'Room A' },
    { id: 2, computerId: 102, computerName: 'PC-102', userId: 2, date: '2025-09-05', duration: 3, location: 'Room B' },
  ];

  loadReservations(): void {
    of(this.reservationsMock)
      .pipe(delay(300))
      .subscribe(res => this.reservations.set(res));
  }

  loadReservation(id: number): void {
    const reservation = this.reservationsMock.find(r => r.id === id) || null;
    of(reservation)
      .pipe(delay(300))
      .subscribe(res => this.selectedReservation.set(res));
  }

  addReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    const newReservation: Reservation = {
      id: this.reservationsMock.length + 1,
      computerId: reservation.computerId || 0,
      computerName: reservation.computerName || 'Unknown',
      userId: reservation.userId || 0,
      date: reservation.date || new Date().toISOString().split('T')[0],
      duration: reservation.duration || 1,
      location: reservation.location || 'Room A',
    };

    this.reservationsMock.push(newReservation);

    return of(newReservation).pipe(
      delay(300),
      tap((res: Reservation) => this.reservations.update(list => [...list, res]))
    );
  }

  deleteReservation(id: number): Observable<void> {
    const index = this.reservationsMock.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reservationsMock.splice(index, 1);
      this.reservations.update(list => list.filter(r => r.id !== id));
      return of(void 0).pipe(delay(300));
    } else {
      this.errorService.showError('Réservation non trouvée');
      return throwError(() => new Error('Réservation non trouvée'));
    }
  }
}
