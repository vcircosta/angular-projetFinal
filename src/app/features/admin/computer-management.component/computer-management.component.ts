import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

export interface Computer {
  id: number;
  name: string;
  location: string;
}

export interface Reservation {
  id: number;
  computerId: number;
  user: string;
  date: string;
  duration: number;
}

@Component({
  selector: 'app-computer-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './computer-management.component.html',
  styleUrls: ['./computer-management.component.scss']
})
export class ComputerManagementComponent implements OnInit {
  private fb = inject(FormBuilder);

  computers = signal<Computer[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `PC-${101 + i}`,
      location: `Room ${String.fromCharCode(65 + (i % 3))}`
    }))
  );

  reservations = signal<Reservation[]>([
    { id: 1, computerId: 1, user: 'Alice', date: '2025-09-07', duration: 2 },
    { id: 2, computerId: 2, user: 'Bob', date: '2025-09-08', duration: 3 }
  ]);

  usedComputers = computed(() =>
    this.computers().filter(pc => this.reservations().some(r => r.computerId === pc.id))
  );

  form = this.fb.group({
    name: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    location: this.fb.control('', { validators: Validators.required, nonNullable: true }),
  });

  ngOnInit() { }

  addComputer() {
    if (this.form.invalid) return;

    const newComputer: Computer = {
      id: this.computers().length + 1,
      name: this.form.get('name')!.value,
      location: this.form.get('location')!.value,
    };

    this.computers.update(list => [...list, newComputer]);
    this.form.reset({ name: '', location: '' });
  }

  deleteComputer(id: number) {
    this.computers.update(list => list.filter(c => c.id !== id));
    this.reservations.update(list => list.filter(r => r.computerId !== id));
  }

  getReservations(computerId: number) {
    return this.reservations().filter(r => r.computerId === computerId);
  }
}
