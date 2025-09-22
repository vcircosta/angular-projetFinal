import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ErrorService } from '../../../shared/services/error.services';
import { of } from 'rxjs';

describe('AuthService', () => {
    let service: AuthService;
    let errorService: jasmine.SpyObj<ErrorService>;

    beforeEach(() => {
        const errorSpy = jasmine.createSpyObj('ErrorService', ['showError', 'showInfo']);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: ErrorService, useValue: errorSpy }
            ]
        });

        service = TestBed.inject(AuthService);
        errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;

        localStorage.clear();

        spyOn(service, 'login').and.callFake(() => {
            service['currentUser'].set({ id: 2, name: 'Normal User', email: 'user@example.com', role: 'user' });
            localStorage.setItem('authToken', 'mock-token-2');
            return of({ id: 2, name: 'Normal User', email: 'user@example.com', role: 'user', token: 'mock-token-2' });
        });
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('✅ devrait se créer', () => {
        expect(service).toBeTruthy();
    });


    describe('isAdmin()', () => {
        it('✅ devrait retourner false si non connecté', () => {
            expect(service.isAdmin()).toBeFalse();
        });

        it('✅ devrait retourner true si admin connecté', () => {
            service['currentUser'].set({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' });
            expect(service.isAdmin()).toBeTrue();
        });
    });
});
