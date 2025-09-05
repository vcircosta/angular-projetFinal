import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservationsService } from '../../core/services/reservations.service';

export interface Reservation {
  id: number;
  computerId: number;
  computerName: string;
  userId: number;
  date: string;
  duration: number;
  location: string;
}

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="text-xl font-bold mb-4">Reservations</h2>

    <!-- Formulaire de création -->
    <form [formGroup]="form" (ngSubmit)="addReservation()" class="flex flex-wrap gap-2 items-end mb-4">
      <input formControlName="computerName" placeholder="Computer Name" class="border p-2 rounded" />

      <select formControlName="location" class="border p-2 rounded">
        <option value="">Select Room</option>
        <option *ngFor="let room of rooms" [value]="room">{{ room }}</option>
      </select>

      <input formControlName="date" type="date" class="border p-2 rounded" />

      <div class="flex items-center gap-1">
        <input formControlName="duration" type="number" min="1" class="border p-2 rounded w-20" />
        <span>h</span>
      </div>

      <button type="submit" [disabled]="form.invalid" class="bg-green-600 text-white px-3 py-1 rounded">
        Add
      </button>
    </form>

    <!-- Liste des reservations -->
    <ul>
      <li *ngFor="let reservation of reservations()" class="border p-2 mb-2 flex justify-between items-center">
        <div>
          <span class="font-semibold">{{ reservation.computerName }}</span>
          <span>
            ({{ reservation.date }}, {{ reservation.duration }}h, {{ reservation.location }})
          </span>
        </div>
        <button class="bg-red-600 text-white px-2 py-1 rounded" (click)="deleteReservation(reservation.id)">
          Delete
        </button>
      </li>
    </ul>
  `
})
export class ReservationListComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private fb = inject(FormBuilder);

  rooms = ['Room A', 'Room B', 'Room C'];
  reservations = computed(() => this.reservationsService.reservations());

  form = this.fb.group({
    computerName: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    location: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    date: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    duration: this.fb.control(1, { validators: [Validators.required, Validators.min(1)], nonNullable: true }),
  });

  ngOnInit() {
    this.reservationsService.loadReservations();
  }

  addReservation() {
    if (this.form.invalid) return;

    this.reservationsService.addReservation({
      id: this.reservations().length + 1,
      computerId: this.reservations().length + 1,
      computerName: this.form.get('computerName')!.value,
      userId: 1,
      date: this.form.get('date')!.value,
      duration: this.form.get('duration')!.value,
      location: this.form.get('location')!.value,
    });

    this.form.reset({ computerName: '', location: '', date: '', duration: 1 });
  }

  deleteReservation(id: number) {
    this.reservationsService.deleteReservation(id);
  }
}
