import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '../admin-dashboard.component/admin-dashboard.component';
import { UserManagementComponent } from '../user-management.component/user-management.component';
import { ComputerManagementComponent } from '../computer-management.component/computer-management.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'users', component: UserManagementComponent },
  { path: 'computers', component: ComputerManagementComponent },
];
