import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ADMIN_ROUTES } from './admin.routes';
import { AdminDashboardComponent } from '../admin-dashboard.component/admin-dashboard.component';
import { UserManagementComponent } from '../user-management.component/user-management.component';
import { ComputerManagementComponent } from '../computer-management.component/computer-management.component';

describe('ADMIN_ROUTES', () => {
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(ADMIN_ROUTES)]
        });

        router = TestBed.inject(Router);
    });

    it('✅ devrait avoir une route pour le dashboard admin', () => {
        const route = ADMIN_ROUTES.find(r => r.path === '');
        expect(route).toBeTruthy();
        expect(route?.component).toBe(AdminDashboardComponent);
    });

    it('✅ devrait avoir une route pour la gestion des utilisateurs', () => {
        const route = ADMIN_ROUTES.find(r => r.path === 'users');
        expect(route).toBeTruthy();
        expect(route?.component).toBe(UserManagementComponent);
    });

    it('✅ devrait avoir une route pour la gestion des ordinateurs', () => {
        const route = ADMIN_ROUTES.find(r => r.path === 'computers');
        expect(route).toBeTruthy();
        expect(route?.component).toBe(ComputerManagementComponent);
    });
});
