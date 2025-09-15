import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserManagementComponent, AppUser } from './user-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RandomUserService } from '../../../core/services/random-user.service/random-user.service';

// Mock du service RandomUserService
class MockRandomUserService {
    getUsers() {
        return of([
            { id: 1, name: 'Random User 1', email: 'r1@test.com', location: 'Random' },
            { id: 2, name: 'Random User 2', email: 'r2@test.com', location: 'Random' },
        ]);
    }
}

describe('UserManagementComponent - Intégration', () => {
    let component: UserManagementComponent;
    let fixture: ComponentFixture<UserManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserManagementComponent, ReactiveFormsModule],
            providers: [
                { provide: RandomUserService, useClass: MockRandomUserService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('devrait créer le composant et afficher le titre', () => {
        expect(component).toBeTruthy();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.title')?.textContent).toContain('User Management');
    });

    it('devrait supprimer un utilisateur', fakeAsync(() => {
        // Ajouter un utilisateur d’abord
        component.addUser();
        fixture.detectChanges();
        tick();

        const firstUser = component.users()[0];
        component.deleteUser(firstUser.id);
        fixture.detectChanges();
        tick();

        expect(component.users().some(u => u.id === firstUser.id)).toBeFalse();
    }));

    it('devrait recharger des utilisateurs random', fakeAsync(() => {
        component.reloadRandomUsers();
        tick();
        fixture.detectChanges();

        const users = component.users();
        expect(users.some(u => u.name === 'Random User 1')).toBeTrue();
        expect(users.some(u => u.name === 'Random User 2')).toBeTrue();
    }));
});
