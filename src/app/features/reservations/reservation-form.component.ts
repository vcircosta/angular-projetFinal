import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationsService } from '../../core/services/reservations.service';
import { Reservation } from '../../core/models/reservation.model';

// Shared components
import { ButtonComponent } from '../../shared/components/button.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, LoadingSpinnerComponent],
  template: `
    <h2 class="text-xl font-bold mb-4">Nouvelle réservation</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">

      <input 
        formControlName="computerName" 
        placeholder="Nom de l'ordinateur" 
        class="border p-2 rounded"
      />

      <input 
        formControlName="date" 
        type="date" 
        class="border p-2 rounded"
      />

      <!-- bouton custom -->
      <app-button label="Enregistrer" [disabled]="form.invalid || isLoading()" />

      <!-- spinner -->
      <app-loading-spinner [loading]="isLoading()" />

      <!-- affichage erreur -->
      <p *ngIf="error()" class="text-red-500 text-sm">
        {{ error() }}
      </p>
    </form>
  `
})
export class ReservationFormComponent {
  private fb = inject(FormBuilder);
  private reservationsService = inject(ReservationsService);
  private router = inject(Router);

  // ✅ Signals pour gérer état UI
  isLoading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    computerName: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    date: this.fb.control('', { validators: Validators.required, nonNullable: true }),
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.reservationsService.addReservation(this.form.value as Partial<Reservation>).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Impossible d’enregistrer la réservation.');
        console.error(err);
      }
    });
  }
}
