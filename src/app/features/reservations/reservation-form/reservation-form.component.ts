import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';
import { ButtonComponent } from '../../../shared/components/button.component/button.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component/loading-spinner.component';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, LoadingSpinnerComponent],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent {
  private fb = inject(FormBuilder);
  private reservationsService = inject(ReservationsService);

  isLoading = signal(false);
  error = signal<string | null>(null);

  computers = Array.from({ length: 10 }, (_, i) => ({ id: 101 + i, name: `PC-${101 + i}` }));

  form = this.fb.group({
    computerId: this.fb.control<number | null>(null, { validators: Validators.required, nonNullable: true }),
    date: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    duration: this.fb.control(1, { validators: [Validators.required, Validators.min(1)], nonNullable: true }),
  });

  onSubmit() {
    if (this.form.invalid) return;

    const selectedId = this.form.value.computerId!;
    const selectedPC = this.computers.find(c => c.id === selectedId);
    if (!selectedPC) {
      this.error.set('Ordinateur invalide');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.reservationsService.addReservation({
      computerId: selectedPC.id,
      computerName: selectedPC.name,
      date: this.form.value.date!,
      duration: this.form.value.duration!,
      userId: 1,
      location: 'Room A',
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.form.reset({ computerId: null, date: '', duration: 1 });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Impossible d’enregistrer la réservation.');
        console.error(err);
      }
    });
  }
}
