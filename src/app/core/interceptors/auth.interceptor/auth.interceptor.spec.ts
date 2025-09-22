import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authSpy },
            ],
        });

        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    function runInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
        return TestBed.runInInjectionContext(() =>
            authInterceptor(request, next)
        );
    }

    it('✅ doit ajouter le header Authorization si un token existe', (done) => {
        const fakeToken = 'fake-jwt-token';
        authService.getToken.and.returnValue(fakeToken);

        const req = new HttpRequest('GET', '/api/test');
        const next: HttpHandlerFn = (request) => {
            expect(request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
            return of({} as HttpEvent<any>);
        };

        runInterceptor(req, next).subscribe(() => done());
    });

    it('🚫 ne doit pas modifier la requête si aucun token', (done) => {
        authService.getToken.and.returnValue(null);

        const req = new HttpRequest('GET', '/api/test');
        const next: HttpHandlerFn = (request) => {
            expect(request.headers.has('Authorization')).toBeFalse();
            return of({} as HttpEvent<any>);
        };

        runInterceptor(req, next).subscribe(() => done());
    });
});
