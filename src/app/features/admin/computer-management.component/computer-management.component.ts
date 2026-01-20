import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../../../core/services/reservations.service/reservations.service';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { User } from '../../../core/models/user.model';

export interface Computer {
  id: number;
  name: string;
  location: string;
}

export interface Reservation {
  id: number;
  computerId: number;
  userId: number;
  date: string;
  duration: number;
  location: string;
  computerName?: string;
  user?: string;
}

@Component({
  selector: 'app-computer-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './computer-management.component.html',
  styleUrls: ['./computer-management.component.scss']
})
export class ComputerManagementComponent implements OnInit {
  private reservationsService = inject(ReservationsService);
  private authService = inject(AuthService);

  users = computed<User[]>(() => this.authService.getUsers());

  computers = signal<Computer[]>(Array.from({ length: 10 }, (_, i) => ({
    id: 101 + i,
    name: `PC-${101 + i}`,
    location: `Room ${String.fromCharCode(65 + (i % 3))}`
  })));

  reservations = signal<Reservation[]>([]);

  get usedComputers() {
    return this.computers().filter(pc =>
      this.reservations().some(r => r.computerId === pc.id)
    );
  }

  ngOnInit() {
    this.reservationsService.loadReservations();
    this.reservations.set(this.reservationsService.reservations());
  }

  deleteReservation(resId: number) {
    this.reservations.update(list => list.filter(res => res.id !== resId));
  }

  deleteAllReservations(computerId: number) {
    if (confirm('Are you sure you want to delete all reservations for this computer?')) {
      this.reservations.update(list => list.filter(res => res.computerId !== computerId));
    }
  }

  getReservations(computerId: number) {
    return this.reservations()
      .filter(r => r.computerId === computerId)
      .map(r => ({
        ...r,
        user: this.users().find(u => u.id === r.userId)?.name || 'Unknown'
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
