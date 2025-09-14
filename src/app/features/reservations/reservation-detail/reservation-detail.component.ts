import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
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
