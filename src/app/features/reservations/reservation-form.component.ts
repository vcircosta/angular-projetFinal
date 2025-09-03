import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationsService } from '../../features/reservations/reservations.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="text-xl font-bold mb-4">New Reservation</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-2">
      <input formControlName="computerName" placeholder="Computer Name" class="border p-2" />
      <input formControlName="date" type="date" class="border p-2" />

      <button type="submit" [disabled]="form.invalid" class="bg-green-500 text-white px-4 py-2">
        Save
      </button>
    </form>
  `
})
export class ReservationFormComponent {
  private fb = inject(FormBuilder);
  private reservationsService = inject(ReservationsService);
  private router = inject(Router);

  form = this.fb.group({
    computerName: ['', Validators.required],
    date: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.reservationsService.addReservation(this.form.value).subscribe({
      next: () => this.router.navigate(['/reservations']),
    });
  }
}
