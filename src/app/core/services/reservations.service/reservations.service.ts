import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Reservation } from '../../models/reservation.model';
import { ErrorService } from '../../../shared/services/error.services';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly errorService = inject(ErrorService);

  reservations = signal<Reservation[]>([]);
  selectedReservation = signal<Reservation | null>(null);

  loadReservations(): void {
    const saved = localStorage.getItem('reservations');
    if (saved) {
      this.reservations.set(JSON.parse(saved) as Reservation[]);
    } else {
      const mock: Reservation[] = [
        {
          id: 1,
          computerId: 101,
          computerName: 'PC-101',
          userId: 2,
          date: '2025-09-04',
          duration: 2,
          location: 'Room A',
        },
        {
          id: 2,
          computerId: 102,
          computerName: 'PC-102',
          userId: 2,
          date: '2025-09-05',
          duration: 3,
          location: 'Room B',
        },
      ];
      this.reservations.set(mock);
      localStorage.setItem('reservations', JSON.stringify(mock));
    }
  }

  loadReservation(id: number): void {
    const res = this.reservations().find((r) => r.id === id) || null;
    this.selectedReservation.set(res);
  }

  addReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    const newReservation: Reservation = {
      id:
        this.reservations().length > 0
          ? Math.max(...this.reservations().map((r) => r.id)) + 1
          : 1,
      computerId: reservation.computerId ?? 0,
      computerName: reservation.computerName ?? 'Unknown',
      userId: reservation.userId ?? 0,
      date: reservation.date ?? new Date().toISOString().split('T')[0],
      duration: reservation.duration ?? 1,
      location: reservation.location ?? 'Room A',
    };

    return of(newReservation).pipe(
      delay(300),
      tap((res) => {
        this.reservations.update((list) => {
          const updated = [...list, res];
          localStorage.setItem('reservations', JSON.stringify(updated));
          return updated;
        });
      })
    );
  }

  deleteReservation(id: number): Observable<void> {
    const exists = this.reservations().some((r) => r.id === id);
    if (!exists) {
      this.errorService.showError('Réservation non trouvée');
      return throwError(() => new Error('Réservation non trouvée'));
    }

    return of(void 0).pipe(
      delay(300),
      tap(() => {
        this.reservations.update((list) => {
          const updated = list.filter((r) => r.id !== id);
          localStorage.setItem('reservations', JSON.stringify(updated));
          return updated;
        });
      })
    );
  }
}
