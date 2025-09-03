import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="text-xl font-semibold mb-4">User Management</h3>
    <p>Here the admin can view, add, or remove users.</p>
    <!-- Future: Table of users, CRUD actions -->
  `
})
export class UserManagementComponent {}
