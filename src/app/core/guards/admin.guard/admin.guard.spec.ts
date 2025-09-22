import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service/auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['currentUser']);
        const routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerSpy },
            ],
        });

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = { url: '/admin' } as RouterStateSnapshot;
    });

    function runGuard() {
        return TestBed.runInInjectionContext(() => adminGuard(mockRoute, mockState));
    }

    it('✅ doit autoriser un utilisateur admin', () => {
        authService.currentUser.and.returnValue({
            id: 1,
            name: 'Admin Test',
            email: 'admin@test.com',
            role: 'admin'
        });

        const result = runGuard();

        expect(result).toBeTrue();
    });

    it('🚫 doit rediriger un utilisateur non-admin', () => {
        const fakeUrlTree = new UrlTree();
        router.parseUrl.and.returnValue(fakeUrlTree);

        authService.currentUser.and.returnValue({
            id: 2,
            name: 'User Test',
            email: 'user@test.com',
            role: 'user'
        });

        const result = runGuard();

        expect(router.parseUrl).toHaveBeenCalledWith('/');
        expect(result).toBe(fakeUrlTree);
    });


    it('🚫 doit rediriger si aucun utilisateur connecté', () => {
        const fakeUrlTree = new UrlTree();
        router.parseUrl.and.returnValue(fakeUrlTree);

        authService.currentUser.and.returnValue(null);

        const result = runGuard();

        expect(router.parseUrl).toHaveBeenCalledWith('/');
        expect(result).toBe(fakeUrlTree);
    });
});
