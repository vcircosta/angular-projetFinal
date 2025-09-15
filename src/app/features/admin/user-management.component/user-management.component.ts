import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RandomUserService } from '../../../core/services/random-user.service/random-user.service';
import { RandomUser } from '../../../core/models/randomuser.model';

export interface AppUser extends RandomUser {
  role: 'user' | 'admin';
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
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
    const adminUser: AppUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      location: 'HQ, France',
      role: 'admin'
    };

    const registeredUsers: AppUser[] = (JSON.parse(localStorage.getItem('users') || '[]') as AppUser[])
      .map(u => ({
        id: u.id.toString(),
        name: u.name,
        email: u.email,
        location: 'Registered',
        role: u.role
      }));

    const localUsers: AppUser[] = JSON.parse(localStorage.getItem('localUsers') || '[]');
    const savedCounter = parseInt(localStorage.getItem('localIdCounter') || '1', 10);
    this.localIdCounter = savedCounter;

    const initialUsers: AppUser[] = [adminUser, ...registeredUsers, ...localUsers];
    this.users.set(initialUsers);

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
            id: `random-${u.id}`,
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

    this.saveLocalUsers();
    this.removeRegisteredUser(id);
  }

  private saveLocalUsers() {
    const localUsers = this.users().filter(u => u.id.startsWith('local-'));
    localStorage.setItem('localUsers', JSON.stringify(localUsers));
    localStorage.setItem('localIdCounter', this.localIdCounter.toString());
  }

  private saveRegisteredUser(user: AppUser) {
    const users: AppUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  private removeRegisteredUser(id: string) {
    const users: AppUser[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.filter(u => u.id.toString() !== id.toString());
    localStorage.setItem('users', JSON.stringify(updated));
  }
}
