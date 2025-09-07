import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RandomUserService, RandomUser } from '../../core/services/random-user.service';
import { NgForOf } from '@angular/common';

export interface AppUser extends RandomUser {
  role: 'user' | 'admin';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgForOf],
  template: `
    <h3 class="text-xl font-semibold mb-4">User Management</h3>

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

  users = signal<AppUser[]>([]);
  private localIdCounter = 1;

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user' as 'user' | 'admin', Validators.required],
  });

  ngOnInit() {
    // ⚡ Admin par défaut
    const adminUser: AppUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      location: 'HQ, France',
      role: 'admin'
    };

    // ⚡ Charger les utilisateurs enregistrés via AuthService (register)
    const registeredUsers: AppUser[] = JSON.parse(localStorage.getItem('users') || '[]')
      .map((u: any) => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        location: 'Registered',
        role: u.role as 'user' | 'admin'
      }));

    // ⚡ Charger les utilisateurs locaux créés dans ce composant
    const localUsers: AppUser[] = JSON.parse(localStorage.getItem('localUsers') || '[]');
    const savedCounter = parseInt(localStorage.getItem('localIdCounter') || '1', 10);
    this.localIdCounter = savedCounter;

    // ⚡ Fusionner toutes les sources
    const initialUsers: AppUser[] = [adminUser, ...registeredUsers, ...localUsers];
    this.users.set(initialUsers);

    // Charger les randoms
    this.reloadRandomUsers();
  }

  addUser() {
    if (this.form.invalid) return;

    const newUser: AppUser = {
      id: `local-${this.localIdCounter++}`,
      name: this.form.value.username!,
      email: this.form.value.email!,
      location: 'Local',
      role: this.form.value.role! as 'user' | 'admin'
    };

    this.users.update(list => [newUser, ...list]);

    // Sauvegarder dans les deux stockages (users + localUsers)
    this.saveLocalUsers();
    this.saveRegisteredUser(newUser);

    this.form.reset({ role: 'user' });
  }

  reloadRandomUsers() {
    this.randomUserService.getUsers().subscribe({
      next: (data) => {
        const currentUsers = this.users();

        const newRandomUsers: AppUser[] = data
          .map(u => ({
            ...u,
            id: `random-${u.id}`,   // ⚡ éviter les collisions
            role: 'user' as 'user'
          }))
          .filter(u => !currentUsers.some(existing => existing.id === u.id));

        this.users.update(list => [...list, ...newRandomUsers]);
      },
      error: (err) => console.error(err)
    });
  }


  deleteUser(id: string) {
    this.users.update(list => list.filter(u => u.id !== id));

    // ⚡ Mettre à jour les stockages
    this.saveLocalUsers();
    this.removeRegisteredUser(id);
  }

  private saveLocalUsers() {
    const localUsers = this.users().filter(u => u.id.startsWith('local-'));
    localStorage.setItem('localUsers', JSON.stringify(localUsers));
    localStorage.setItem('localIdCounter', this.localIdCounter.toString());
  }

  private saveRegisteredUser(user: AppUser) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    localStorage.setItem('users', JSON.stringify(users));
  }

  private removeRegisteredUser(id: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.filter((u: any) => u.id.toString() !== id.toString());
    localStorage.setItem('users', JSON.stringify(updated));
  }
}
