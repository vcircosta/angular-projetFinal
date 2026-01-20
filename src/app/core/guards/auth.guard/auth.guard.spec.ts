import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
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
        mockState = { url: '/reservations' } as RouterStateSnapshot;
    });

    function runGuard() {
        return TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    }

    it('✅ doit autoriser si utilisateur connecté', () => {
        authService.isLoggedIn.and.returnValue(true);

        const result = runGuard();

        expect(result).toBeTrue();
    });

    it('🚫 doit rediriger si utilisateur non connecté', () => {
        const fakeUrlTree = new UrlTree();
        router.parseUrl.and.returnValue(fakeUrlTree);

        authService.isLoggedIn.and.returnValue(false);

        const result = runGuard();

        expect(router.parseUrl).toHaveBeenCalledWith('/auth/login');
        expect(result).toBe(fakeUrlTree);
    });
});
