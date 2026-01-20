import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';
import { Reservation } from '../../../core/models/reservation.model';

export interface Computer {
  id: number;
  name: string;
}

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private fb = inject(FormBuilder);

  rooms = ['Room A', 'Room B', 'Room C'];

  computers: Computer[] = Array.from({ length: 10 }, (_, i) => ({
    id: 101 + i,
    name: `PC-${101 + i}`
  }));

  reservations = computed(() => this.reservationsService.reservations());

  form = this.fb.group({
    computerId: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    location: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    date: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    duration: this.fb.control(1, { validators: [Validators.required, Validators.min(1)], nonNullable: true }),
  });

  ngOnInit() {
    this.reservationsService.loadReservations();
  }

  addReservation() {
    if (this.form.invalid) return;

    const computerId = Number(this.form.value.computerId);
    const selectedPC = this.computers.find(c => c.id === computerId);
    if (!selectedPC) return;

    const newReservation: Reservation = {
      id: this.reservations().length + 1,
      computerId: selectedPC.id,
      computerName: selectedPC.name,
      userId: 1,
      date: this.form.value.date!,
      duration: this.form.value.duration!,
      location: this.form.value.location!,
    };

    this.reservationsService.addReservation(newReservation).subscribe(() => {
      this.form.reset({ computerId: '', location: '', date: '', duration: 1 });
    });
  }

  deleteReservation(id: number) {
    this.reservationsService.deleteReservation(id).subscribe();
  }
}
