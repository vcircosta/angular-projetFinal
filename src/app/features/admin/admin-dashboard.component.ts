import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-2xl font-bold mb-4">Admin Dashboard</h2>
    <p>Welcome to the admin panel. From here, you can manage users and computers.</p>

    <nav class="mt-4 flex gap-4">
      <a routerLink="users" class="text-blue-600 underline">Manage Users</a>
      <a routerLink="computers" class="text-blue-600 underline">Manage Computers</a>
    </nav>
  `
})
export class AdminDashboardComponent {}
