import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-computer-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="text-xl font-semibold mb-4">Computer Management</h3>
    <p>Here the admin can add, edit, or remove computers.</p>
    <!-- Future: Table of computers, CRUD actions -->
  `
})
export class ComputerManagementComponent {}
