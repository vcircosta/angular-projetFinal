import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RandomUserService, RandomUser } from '../../core/services/random-user.service';
import { NgForOf } from '@angular/common';

// ⚡ Nouveau type : RandomUser avec role
export interface AppUser extends RandomUser {
  role: 'user' | 'admin';
}

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
          <th class="border border-gray-400 px-2 py-1">Name</th>
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

    <button (click)="reloadRandomUsers()" class="mt-4 bg-blue-500 text-white px-3 py-1 rounded">
      Reload Random Users
    </button>
  `
})
export class UserManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private randomUserService = inject(RandomUserService);

  // ⚡ Utilise AppUser et non RandomUser
  users = signal<AppUser[]>([]);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user' as 'user' | 'admin', Validators.required], // ⚡ type littéral
  });

  ngOnInit() {
    // ⚡ Utilisateur connecté avec role
    const connectedUser: AppUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      location: 'HQ, France',
      role: 'admin'
    };
    this.users.set([connectedUser]);

    // Charger les Random Users
    this.reloadRandomUsers();
  }

  reloadRandomUsers() {
    this.randomUserService.getUsers().subscribe({
      next: (data) => {
        // ⚡ Ajoute role par défaut aux RandomUsers
        const randomUsersWithRole: AppUser[] = data.map(u => ({ ...u, role: 'user' }));
        // Fusionne avec les utilisateurs existants (évite de supprimer l’admin)
        const merged = [...this.users(), ...randomUsersWithRole].filter(
          (user, index, self) => index === self.findIndex(u => u.id === user.id)
        );
        this.users.set(merged);
      },
      error: (err) => console.error(err)
    });
  }

  addUser() {
    if (this.form.invalid) return;

    const newUser: AppUser = {
      id: (this.users().length + 1).toString(),
      name: this.form.value.username!,
      email: this.form.value.email!,
      location: 'Local',
      role: this.form.value.role! as 'user' | 'admin'
    };

    this.users.update(list => [...list, newUser]);
    this.form.reset({ role: 'user' });
  }

  deleteUser(id: string) {
    this.users.update(list => list.filter(u => u.id !== id));
  }
}
