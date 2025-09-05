import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// Modèle mock d'ordinateur
export interface Computer {
  id: number;
  name: string;
  location: string;
}

@Component({
  selector: 'app-computer-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h3 class="text-xl font-semibold mb-4">Computer Management</h3>

    <!-- Liste des ordinateurs -->
    <table class="table-auto border-collapse border border-gray-400 w-full mb-6">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-400 px-2 py-1">ID</th>
          <th class="border border-gray-400 px-2 py-1">Name</th>
          <th class="border border-gray-400 px-2 py-1">Location</th>
          <th class="border border-gray-400 px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let computer of computers()">
          <td class="border border-gray-400 px-2 py-1">{{ computer.id }}</td>
          <td class="border border-gray-400 px-2 py-1">{{ computer.name }}</td>
          <td class="border border-gray-400 px-2 py-1">{{ computer.location }}</td>
          <td class="border border-gray-400 px-2 py-1">
            <button class="bg-red-600 text-white px-2 py-1 rounded"
                    (click)="deleteComputer(computer.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulaire d’ajout -->
    <form [formGroup]="form" (ngSubmit)="addComputer()" class="flex gap-2 items-end">
      <input formControlName="name" placeholder="Computer Name" class="border p-2 rounded" />
      <input formControlName="location" placeholder="Location" class="border p-2 rounded" />
      <button type="submit" [disabled]="form.invalid" class="bg-green-600 text-white px-3 py-1 rounded">
        Add Computer
      </button>
    </form>
  `
})
export class ComputerManagementComponent {
  private fb = inject(FormBuilder);

  // Signal pour gérer la liste
  computers = signal<Computer[]>([
    { id: 1, name: 'PC-101', location: 'Room A' },
    { id: 2, name: 'PC-102', location: 'Room B' },
  ]);

  form = this.fb.group({
    name: this.fb.control('', { validators: Validators.required, nonNullable: true }),
    location: this.fb.control('', { validators: Validators.required, nonNullable: true }),
  });

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
  }
}
