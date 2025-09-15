import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  // computed signal pour vérifier le rôle
  isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
