import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgForOf],
  template: `
    <h3 class="text-xl font-semibold mb-4">User Management</h3>

    <!-- Liste des utilisateurs -->
    <table class="table-auto border-collapse border border-gray-400 w-full mb-6">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-400 px-2 py-1">ID</th>
          <th class="border border-gray-400 px-2 py-1">Username</th>
          <th class="border border-gray-400 px-2 py-1">Email</th>
          <th class="border border-gray-400 px-2 py-1">Role</th>
          <th class="border border-gray-400 px-2 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users()">
          <td class="border border-gray-400 px-2 py-1">{{ user.id }}</td>
          <td class="border border-gray-400 px-2 py-1">{{ user.name }}</td>
          <td class="border border-gray-400 px-2 py-1">{{ user.email }}</td>
          <td class="border border-gray-400 px-2 py-1">{{ user.role }}</td>
          <td class="border border-gray-400 px-2 py-1">
            <button class="bg-red-600 text-white px-2 py-1 rounded"
              (click)="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulaire d’ajout -->
    <form [formGroup]="form" (ngSubmit)="addUser()" class="flex gap-2 items-end">
      <input formControlName="username" placeholder="Username" class="border p-2 rounded" />
      <input formControlName="email" placeholder="Email" type="email" class="border p-2 rounded" />
      <select formControlName="role" class="border p-2 rounded">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" [disabled]="form.invalid" class="bg-green-600 text-white px-3 py-1 rounded">
        Add User
      </button>
    </form>
  `
})
export class UserManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  // ⚡ état réactif avec signals
  users = signal<User[]>([]);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users) => this.users.set(users),
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  addUser() {
    if (this.form.invalid) return;

    // Ici tu peux soit mocker, soit appeler une API pour créer l'utilisateur
    const newUser: User = {
      id: this.users().length + 1, // temporaire
      ...this.form.value
    } as User;

    // ajout dans le signal
    this.users.update(list => [...list, newUser]);
    this.form.reset({ role: 'user' });
  }

  deleteUser(id: number) {
    // Optionnel : appeler AuthService pour supprimer côté backend
    this.users.update(list => list.filter(u => u.id !== id));
  }
}
