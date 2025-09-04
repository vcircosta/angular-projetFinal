import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservationsService } from '../../core/services/reservations.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2 class="text-xl font-bold mb-4">Reservations</h2>

    <button routerLink="/reservations/new" class="bg-blue-500 text-white px-4 py-2 mb-4">
      New Reservation
    </button>

    <ul>
      <li *ngFor="let reservation of reservations()" class="border p-2 mb-2">
        <a [routerLink]="['/reservations', reservation.id]" class="font-semibold">
          {{ reservation.computerName }}
        </a>
        <span class="ml-2 text-gray-600">({{ reservation.date }})</span>
      </li>
    </ul>
  `
})
export class ReservationListComponent implements OnInit {
  private reservationsService = inject(ReservationsService);

  reservations = computed(() => this.reservationsService.reservations());

  ngOnInit() {
    this.reservationsService.loadReservations();
  }
}
