import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReservationsService } from '../../features/reservations/reservations.service';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="reservation() as res; else loading">
      <h2 class="text-xl font-bold mb-2">Reservation Detail</h2>
      <p><strong>Computer:</strong> {{ res.computerName }}</p>
      <p><strong>Date:</strong> {{ res.date }}</p>
    </div>

    <ng-template #loading>
      <p>Loading reservation...</p>
    </ng-template>
  `
})
export class ReservationDetailComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private route = inject(ActivatedRoute);

  reservation = computed(() => this.reservationsService.selectedReservation());

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reservationsService.loadReservation(+id);
    }
  }
}
